from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import (
    WebsiteStatusOverview, WebsiteStatusResponse, UptimeResponse,
    WebsiteStatus, UptimeHistory
)
from website_monitor import WebsiteMonitor
import asyncio
from datetime import datetime
from typing import Dict, Any

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize website monitor
website_monitor = WebsiteMonitor(db)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Background monitoring task
monitoring_task = None

@app.on_event("startup")
async def startup_event():
    """Start background monitoring when server starts"""
    global monitoring_task
    logging.info("Starting website monitoring background task...")
    monitoring_task = asyncio.create_task(website_monitor.start_monitoring())

@app.on_event("shutdown")
async def shutdown_event():
    """Stop background monitoring when server shuts down"""
    global monitoring_task
    if monitoring_task:
        website_monitor.stop_monitoring()
        monitoring_task.cancel()
        try:
            await monitoring_task
        except asyncio.CancelledError:
            pass
    client.close()

# Website Status Monitoring Endpoints
@api_router.get("/status/websites")
async def get_all_website_status():
    """Get current status of all monitored websites"""
    try:
        websites_data = await website_monitor.get_latest_status()
        overall = website_monitor.calculate_overall_status(websites_data)
        
        # Convert to proper response format
        websites_response = {}
        for website_name, data in websites_data.items():
            websites_response[website_name] = {
                "website": website_name,
                "status": data["status"],
                "responseTime": data["responseTime"],
                "lastChecked": data["lastChecked"],
                "statusCode": data["statusCode"]
            }
        
        return {
            "websites": websites_response,
            "overall": overall,
            "lastUpdated": datetime.utcnow()
        }
    except Exception as e:
        logging.error(f"Error getting website status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get website status")

@api_router.get("/status/websites/{website}", response_model=WebsiteStatusResponse)
async def get_website_status(website: str):
    """Get detailed status for a specific website"""
    try:
        # Validate website parameter
        valid_websites = ["loyalhood.xyz", "host.loyalhood.xyz", "pm.loyalhood.xyz"]
        if website not in valid_websites:
            raise HTTPException(status_code=404, detail="Website not found")
        
        # Get latest status from database
        latest = await db.website_status.find_one(
            {"website": website},
            sort=[("checkedAt", -1)]
        )
        
        if not latest:
            raise HTTPException(status_code=404, detail="No status data found for website")
        
        return WebsiteStatusResponse(
            website=latest["website"],
            status=latest["status"],
            responseTime=latest["responseTime"],
            lastChecked=latest["checkedAt"],
            statusCode=latest["statusCode"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting status for {website}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get website status")

@api_router.get("/status/uptime")
async def get_uptime_data():
    """Get 24-hour uptime data for visualization"""
    try:
        uptime_data = await website_monitor.calculate_uptime_history()
        return {"uptime": uptime_data}
    except Exception as e:
        logging.error(f"Error getting uptime data: {e}")
        raise HTTPException(status_code=500, detail="Failed to get uptime data")

@api_router.post("/status/check")
async def force_status_check(background_tasks: BackgroundTasks):
    """Force an immediate status check of all websites"""
    try:
        background_tasks.add_task(website_monitor.check_all_websites)
        return {"message": "Status check initiated"}
    except Exception as e:
        logging.error(f"Error initiating status check: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate status check")

@api_router.delete("/status/cleanup")
async def cleanup_old_data():
    """Clean up old monitoring data (30+ days)"""
    try:
        await website_monitor.cleanup_old_data()
        return {"message": "Old data cleanup completed"}
    except Exception as e:
        logging.error(f"Error cleaning up old data: {e}")
        raise HTTPException(status_code=500, detail="Failed to cleanup old data")

# Original endpoints (keep for compatibility)
@api_router.get("/")
async def root():
    return {"message": "LoyalHOOD VPS Hosting API"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow(),
            "database": "connected",
            "monitoring": "active" if website_monitor.monitoring else "inactive"
        }
    except Exception as e:
        logging.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)