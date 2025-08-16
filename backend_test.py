#!/usr/bin/env python3
"""
Comprehensive Backend Testing for LoyalHOOD VPS Hosting Website
Tests all API endpoints, monitoring service, and database operations
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timedelta
import os
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

class BackendTester:
    def __init__(self):
        # Get backend URL from frontend .env file
        frontend_env_path = Path(__file__).parent / "frontend" / ".env"
        self.backend_url = None
        
        if frontend_env_path.exists():
            with open(frontend_env_path, 'r') as f:
                for line in f:
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        self.backend_url = line.split('=', 1)[1].strip()
                        break
        
        if not self.backend_url:
            self.backend_url = "http://localhost:8001"
            
        self.api_url = f"{self.backend_url}/api"
        self.test_results = []
        self.session = None
        
        print(f"🔧 Testing backend at: {self.api_url}")
        
    async def setup(self):
        """Setup test session"""
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(timeout=timeout)
        
    async def cleanup(self):
        """Cleanup test session"""
        if self.session:
            await self.session.close()
            
    def log_test(self, test_name: str, success: bool, message: str, details: dict = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat()
        })
        
    async def test_health_endpoint(self):
        """Test /api/health endpoint"""
        try:
            async with self.session.get(f"{self.api_url}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Check required fields
                    required_fields = ["status", "timestamp", "database", "monitoring"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if missing_fields:
                        self.log_test("Health Endpoint", False, 
                                    f"Missing fields: {missing_fields}", data)
                        return False
                        
                    if data["status"] == "healthy" and data["database"] == "connected":
                        self.log_test("Health Endpoint", True, 
                                    f"Service healthy, monitoring: {data['monitoring']}", data)
                        return True
                    else:
                        self.log_test("Health Endpoint", False, 
                                    f"Service unhealthy: {data}", data)
                        return False
                else:
                    self.log_test("Health Endpoint", False, 
                                f"HTTP {response.status}", {"status_code": response.status})
                    return False
                    
        except Exception as e:
            self.log_test("Health Endpoint", False, f"Exception: {str(e)}")
            return False
            
    async def test_websites_status_endpoint(self):
        """Test /api/status/websites endpoint"""
        try:
            async with self.session.get(f"{self.api_url}/status/websites") as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Check structure
                    required_fields = ["websites", "overall", "lastUpdated"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if missing_fields:
                        self.log_test("Websites Status", False, 
                                    f"Missing fields: {missing_fields}", data)
                        return False
                    
                    # Check websites data
                    expected_websites = ["loyalhood.xyz", "host.loyalhood.xyz", "pm.loyalhood.xyz"]
                    websites = data.get("websites", {})
                    
                    missing_websites = [site for site in expected_websites if site not in websites]
                    if missing_websites:
                        self.log_test("Websites Status", False, 
                                    f"Missing websites: {missing_websites}", data)
                        return False
                    
                    # Validate website data structure
                    for website, info in websites.items():
                        required_website_fields = ["website", "status", "responseTime", "lastChecked", "statusCode"]
                        missing_website_fields = [field for field in required_website_fields if field not in info]
                        
                        if missing_website_fields:
                            self.log_test("Websites Status", False, 
                                        f"Website {website} missing fields: {missing_website_fields}", info)
                            return False
                    
                    # Check overall status
                    valid_overall_statuses = ["operational", "degraded", "outage", "checking"]
                    if data["overall"] not in valid_overall_statuses:
                        self.log_test("Websites Status", False, 
                                    f"Invalid overall status: {data['overall']}", data)
                        return False
                    
                    self.log_test("Websites Status", True, 
                                f"All 3 websites monitored, overall: {data['overall']}", 
                                {"websites_count": len(websites), "overall": data["overall"]})
                    return True
                    
                else:
                    self.log_test("Websites Status", False, 
                                f"HTTP {response.status}", {"status_code": response.status})
                    return False
                    
        except Exception as e:
            self.log_test("Websites Status", False, f"Exception: {str(e)}")
            return False
            
    async def test_individual_website_status(self):
        """Test /api/status/websites/{website} endpoint"""
        websites = ["loyalhood.xyz", "host.loyalhood.xyz", "pm.loyalhood.xyz"]
        all_passed = True
        
        for website in websites:
            try:
                async with self.session.get(f"{self.api_url}/status/websites/{website}") as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Check required fields
                        required_fields = ["website", "status", "responseTime", "lastChecked", "statusCode"]
                        missing_fields = [field for field in required_fields if field not in data]
                        
                        if missing_fields:
                            self.log_test(f"Individual Status ({website})", False, 
                                        f"Missing fields: {missing_fields}", data)
                            all_passed = False
                            continue
                            
                        if data["website"] != website:
                            self.log_test(f"Individual Status ({website})", False, 
                                        f"Website mismatch: expected {website}, got {data['website']}", data)
                            all_passed = False
                            continue
                            
                        self.log_test(f"Individual Status ({website})", True, 
                                    f"Status: {data['status']}, Response: {data['responseTime']}ms", 
                                    {"status": data["status"], "response_time": data["responseTime"]})
                                    
                    elif response.status == 404:
                        self.log_test(f"Individual Status ({website})", False, 
                                    "Website not found or no data", {"status_code": 404})
                        all_passed = False
                    else:
                        self.log_test(f"Individual Status ({website})", False, 
                                    f"HTTP {response.status}", {"status_code": response.status})
                        all_passed = False
                        
            except Exception as e:
                self.log_test(f"Individual Status ({website})", False, f"Exception: {str(e)}")
                all_passed = False
                
        return all_passed
        
    async def test_uptime_endpoint(self):
        """Test /api/status/uptime endpoint"""
        try:
            async with self.session.get(f"{self.api_url}/status/uptime") as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if "uptime" not in data:
                        self.log_test("Uptime Data", False, "Missing 'uptime' field", data)
                        return False
                    
                    uptime_data = data["uptime"]
                    if not isinstance(uptime_data, list):
                        self.log_test("Uptime Data", False, "Uptime data is not a list", data)
                        return False
                    
                    # Should have 24 hours of data
                    if len(uptime_data) != 24:
                        self.log_test("Uptime Data", False, 
                                    f"Expected 24 hours, got {len(uptime_data)}", 
                                    {"hours_count": len(uptime_data)})
                        return False
                    
                    # Validate each hour's data
                    for hour_data in uptime_data:
                        required_fields = ["hour", "percentage", "incidents"]
                        missing_fields = [field for field in required_fields if field not in hour_data]
                        
                        if missing_fields:
                            self.log_test("Uptime Data", False, 
                                        f"Hour data missing fields: {missing_fields}", hour_data)
                            return False
                            
                        # Validate ranges
                        if not (0 <= hour_data["hour"] <= 23):
                            self.log_test("Uptime Data", False, 
                                        f"Invalid hour: {hour_data['hour']}", hour_data)
                            return False
                            
                        if not (0 <= hour_data["percentage"] <= 100):
                            self.log_test("Uptime Data", False, 
                                        f"Invalid percentage: {hour_data['percentage']}", hour_data)
                            return False
                    
                    avg_uptime = sum(h["percentage"] for h in uptime_data) / len(uptime_data)
                    total_incidents = sum(h["incidents"] for h in uptime_data)
                    
                    self.log_test("Uptime Data", True, 
                                f"24-hour data available, avg uptime: {avg_uptime:.1f}%", 
                                {"avg_uptime": avg_uptime, "total_incidents": total_incidents})
                    return True
                    
                else:
                    self.log_test("Uptime Data", False, 
                                f"HTTP {response.status}", {"status_code": response.status})
                    return False
                    
        except Exception as e:
            self.log_test("Uptime Data", False, f"Exception: {str(e)}")
            return False
            
    async def test_force_check_endpoint(self):
        """Test /api/status/check endpoint"""
        try:
            async with self.session.post(f"{self.api_url}/status/check") as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if "message" in data and "initiated" in data["message"].lower():
                        self.log_test("Force Check", True, "Status check initiated successfully", data)
                        
                        # Wait a moment and check if data was updated
                        await asyncio.sleep(2)
                        
                        # Verify that the check actually happened by getting fresh data
                        async with self.session.get(f"{self.api_url}/status/websites") as verify_response:
                            if verify_response.status == 200:
                                verify_data = await verify_response.json()
                                self.log_test("Force Check Verification", True, 
                                            "Data refreshed after force check", 
                                            {"last_updated": verify_data.get("lastUpdated")})
                            else:
                                self.log_test("Force Check Verification", False, 
                                            "Could not verify force check results")
                        
                        return True
                    else:
                        self.log_test("Force Check", False, "Unexpected response format", data)
                        return False
                else:
                    self.log_test("Force Check", False, 
                                f"HTTP {response.status}", {"status_code": response.status})
                    return False
                    
        except Exception as e:
            self.log_test("Force Check", False, f"Exception: {str(e)}")
            return False
            
    async def test_invalid_website_endpoint(self):
        """Test /api/status/websites/{invalid_website} endpoint"""
        try:
            invalid_website = "invalid-website.com"
            async with self.session.get(f"{self.api_url}/status/websites/{invalid_website}") as response:
                if response.status == 404:
                    self.log_test("Invalid Website Handling", True, 
                                "Correctly returns 404 for invalid website", 
                                {"status_code": 404})
                    return True
                else:
                    self.log_test("Invalid Website Handling", False, 
                                f"Expected 404, got {response.status}", 
                                {"status_code": response.status})
                    return False
                    
        except Exception as e:
            self.log_test("Invalid Website Handling", False, f"Exception: {str(e)}")
            return False
            
    async def test_concurrent_requests(self):
        """Test API performance with concurrent requests"""
        try:
            # Create multiple concurrent requests
            tasks = []
            for i in range(10):
                task = self.session.get(f"{self.api_url}/status/websites")
                tasks.append(task)
            
            start_time = time.time()
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            end_time = time.time()
            
            # Check responses
            successful_responses = 0
            for response in responses:
                if isinstance(response, Exception):
                    continue
                if response.status == 200:
                    successful_responses += 1
                response.close()
            
            total_time = end_time - start_time
            avg_time = total_time / len(tasks)
            
            if successful_responses >= 8:  # Allow some failures
                self.log_test("Concurrent Requests", True, 
                            f"{successful_responses}/10 requests successful, avg: {avg_time:.2f}s", 
                            {"successful": successful_responses, "total": len(tasks), "avg_time": avg_time})
                return True
            else:
                self.log_test("Concurrent Requests", False, 
                            f"Only {successful_responses}/10 requests successful", 
                            {"successful": successful_responses, "total": len(tasks)})
                return False
                
        except Exception as e:
            self.log_test("Concurrent Requests", False, f"Exception: {str(e)}")
            return False
            
    async def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            headers = {
                'Origin': 'https://example.com',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            # Test preflight request
            async with self.session.options(f"{self.api_url}/health", headers=headers) as response:
                cors_headers = {
                    'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                    'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                    'access-control-allow-headers': response.headers.get('access-control-allow-headers')
                }
                
                if cors_headers['access-control-allow-origin'] == '*':
                    self.log_test("CORS Configuration", True, 
                                "CORS properly configured for all origins", cors_headers)
                    return True
                else:
                    self.log_test("CORS Configuration", False, 
                                "CORS not properly configured", cors_headers)
                    return False
                    
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Exception: {str(e)}")
            return False
            
    async def test_monitoring_service_persistence(self):
        """Test that monitoring service is persisting data"""
        try:
            # Get initial data
            async with self.session.get(f"{self.api_url}/status/websites") as response1:
                if response1.status != 200:
                    self.log_test("Monitoring Persistence", False, "Could not get initial data")
                    return False
                    
                data1 = await response1.json()
                initial_time = data1.get("lastUpdated")
            
            # Wait for monitoring cycle (30+ seconds)
            print("⏳ Waiting 35 seconds for monitoring cycle...")
            await asyncio.sleep(35)
            
            # Get updated data
            async with self.session.get(f"{self.api_url}/status/websites") as response2:
                if response2.status != 200:
                    self.log_test("Monitoring Persistence", False, "Could not get updated data")
                    return False
                    
                data2 = await response2.json()
                updated_time = data2.get("lastUpdated")
            
            # Check if data was updated
            if initial_time != updated_time:
                self.log_test("Monitoring Persistence", True, 
                            "Background monitoring is updating data", 
                            {"initial": initial_time, "updated": updated_time})
                return True
            else:
                self.log_test("Monitoring Persistence", False, 
                            "Data not updated by background monitoring", 
                            {"initial": initial_time, "updated": updated_time})
                return False
                
        except Exception as e:
            self.log_test("Monitoring Persistence", False, f"Exception: {str(e)}")
            return False
            
    def print_summary(self):
        """Print test summary"""
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t["success"]])
        failed_tests = total_tests - passed_tests
        
        print("\n" + "="*60)
        print("🧪 BACKEND TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for test in self.test_results:
                if not test["success"]:
                    print(f"  • {test['test']}: {test['message']}")
        
        print("\n" + "="*60)
        
        return passed_tests, failed_tests
        
async def main():
    """Run all backend tests"""
    print("🚀 Starting LoyalHOOD VPS Backend Testing")
    print("="*60)
    
    tester = BackendTester()
    await tester.setup()
    
    try:
        # Core API Tests
        await tester.test_health_endpoint()
        await tester.test_websites_status_endpoint()
        await tester.test_individual_website_status()
        await tester.test_uptime_endpoint()
        await tester.test_force_check_endpoint()
        
        # Error Handling Tests
        await tester.test_invalid_website_endpoint()
        
        # Performance Tests
        await tester.test_concurrent_requests()
        await tester.test_cors_configuration()
        
        # Monitoring Service Test (takes time)
        await tester.test_monitoring_service_persistence()
        
    finally:
        await tester.cleanup()
    
    # Print summary
    passed, failed = tester.print_summary()
    
    # Return appropriate exit code
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)