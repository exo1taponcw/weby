import asyncio
import aiohttp
import time
from datetime import datetime, timedelta
from typing import Dict, Tuple
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import WebsiteStatus, UptimeHistory

logger = logging.getLogger(__name__)

class WebsiteMonitor:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.websites = [
            "https://loyalhood.xyz",
            "https://host.loyalhood.xyz", 
            "https://pm.loyalhood.xyz"
        ]
        self.monitoring = False
        
    async def check_website(self, url: str) -> Tuple[str, int, int]:
        """Check a single website and return status, response time, and status code"""
        try:
            start_time = time.time()
            
            timeout = aiohttp.ClientTimeout(total=5)  # 5 second timeout
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(url, allow_redirects=True) as response:
                    end_time = time.time()
                    response_time = int((end_time - start_time) * 1000)  # Convert to milliseconds
                    
                    if response.status == 200:
                        return "online", response_time, response.status
                    elif 400 <= response.status < 500:
                        return "degraded", response_time, response.status
                    else:
                        return "offline", response_time, response.status
                        
        except asyncio.TimeoutError:
            logger.warning(f"Timeout checking {url}")
            return "offline", 5000, 0  # 5 second timeout
        except aiohttp.ClientError as e:
            logger.warning(f"Client error checking {url}: {e}")
            return "offline", 0, 0
        except Exception as e:
            logger.error(f"Unexpected error checking {url}: {e}")
            return "offline", 0, 0
    
    async def check_all_websites(self) -> Dict[str, Dict]:
        """Check all websites and return their status"""
        results = {}
        
        for url in self.websites:
            try:
                website_name = url.replace("https://", "").replace("http://", "")
                status, response_time, status_code = await self.check_website(url)
                
                # Store in database
                website_status = WebsiteStatus(
                    website=website_name,
                    status=status,
                    responseTime=response_time,
                    statusCode=status_code
                )
                
                await self.db.website_status.insert_one(website_status.dict())
                
                results[website_name] = {
                    "status": status,
                    "responseTime": response_time,
                    "lastChecked": website_status.checkedAt,
                    "statusCode": status_code
                }
                
                logger.info(f"Checked {website_name}: {status} ({response_time}ms)")
                
            except Exception as e:
                logger.error(f"Error processing {url}: {e}")
                website_name = url.replace("https://", "").replace("http://", "")
                results[website_name] = {
                    "status": "offline",
                    "responseTime": 0,
                    "lastChecked": datetime.utcnow(),
                    "statusCode": 0
                }
        
        return results
    
    async def get_latest_status(self) -> Dict[str, Dict]:
        """Get the latest status for all websites from database"""
        results = {}
        
        for url in self.websites:
            website_name = url.replace("https://", "").replace("http://", "")
            
            # Get latest status from database
            latest = await self.db.website_status.find_one(
                {"website": website_name},
                sort=[("checkedAt", -1)]
            )
            
            if latest:
                results[website_name] = {
                    "status": latest["status"],
                    "responseTime": latest["responseTime"],
                    "lastChecked": latest["checkedAt"],
                    "statusCode": latest["statusCode"]
                }
            else:
                # No data in database, return unknown status
                results[website_name] = {
                    "status": "checking",
                    "responseTime": 0,
                    "lastChecked": datetime.utcnow(),
                    "statusCode": 0
                }
        
        return results
    
    def calculate_overall_status(self, websites: Dict[str, Dict]) -> str:
        """Calculate overall system status based on individual website statuses"""
        statuses = [site["status"] for site in websites.values()]
        
        if all(status == "online" for status in statuses):
            return "operational"
        elif any(status == "offline" for status in statuses):
            if all(status == "offline" for status in statuses):
                return "outage"
            else:
                return "degraded"
        elif any(status == "degraded" for status in statuses):
            return "degraded"
        else:
            return "checking"
    
    async def calculate_uptime_history(self) -> List[Dict]:
        """Calculate 24-hour uptime history"""
        uptime_data = []
        now = datetime.utcnow()
        
        for hour in range(24):
            hour_start = now.replace(minute=0, second=0, microsecond=0) - timedelta(hours=23-hour)
            hour_end = hour_start + timedelta(hours=1)
            
            # Count total checks and successful checks for this hour
            total_checks = 0
            successful_checks = 0
            
            for url in self.websites:
                website_name = url.replace("https://", "").replace("http://", "")
                
                # Get all checks for this website in this hour
                checks = await self.db.website_status.find({
                    "website": website_name,
                    "checkedAt": {
                        "$gte": hour_start,
                        "$lt": hour_end
                    }
                }).to_list(None)
                
                total_checks += len(checks)
                successful_checks += len([c for c in checks if c["status"] == "online"])
            
            # Calculate uptime percentage
            if total_checks > 0:
                uptime_percentage = (successful_checks / total_checks) * 100
            else:
                uptime_percentage = 100  # Assume 100% if no data
            
            uptime_data.append({
                "hour": hour,
                "percentage": round(uptime_percentage, 1),
                "incidents": total_checks - successful_checks
            })
        
        return uptime_data
    
    async def start_monitoring(self):
        """Start the background monitoring process"""
        logger.info("Starting website monitoring...")
        self.monitoring = True
        
        while self.monitoring:
            try:
                await self.check_all_websites()
                await asyncio.sleep(30)  # Check every 30 seconds
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                await asyncio.sleep(30)  # Continue monitoring even if there's an error
    
    def stop_monitoring(self):
        """Stop the background monitoring process"""
        logger.info("Stopping website monitoring...")
        self.monitoring = False
    
    async def cleanup_old_data(self):
        """Clean up data older than 30 days"""
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        
        result = await self.db.website_status.delete_many({
            "createdAt": {"$lt": cutoff_date}
        })
        
        logger.info(f"Cleaned up {result.deleted_count} old website status records")
        
        result = await self.db.uptime_history.delete_many({
            "createdAt": {"$lt": cutoff_date}
        })
        
        logger.info(f"Cleaned up {result.deleted_count} old uptime history records")