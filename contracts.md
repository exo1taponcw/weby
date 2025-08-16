# LoyalHOOD VPS Hosting - API Contracts

## Overview
This document outlines the API contracts between frontend and backend for the LoyalHOOD VPS hosting website, specifically focusing on website status monitoring functionality.

## Current Mock Data Implementation
The frontend currently uses mock data from `/frontend/src/data/mock.js` for:
- Website status monitoring (loyalhood.xyz, host.loyalhood.xyz, pm.loyalhood.xyz)
- Response time simulation
- Status updates every 30 seconds

## Backend API Endpoints to Implement

### 1. Website Status Monitoring

#### GET /api/status/websites
**Purpose**: Get current status of all monitored websites
**Response**:
```json
{
  "websites": {
    "loyalhood.xyz": {
      "status": "online|offline|degraded",
      "responseTime": 150,
      "lastChecked": "2024-01-16T10:30:00Z",
      "statusCode": 200
    },
    "host.loyalhood.xyz": {
      "status": "online|offline|degraded", 
      "responseTime": 230,
      "lastChecked": "2024-01-16T10:30:00Z",
      "statusCode": 200
    },
    "pm.loyalhood.xyz": {
      "status": "online|offline|degraded",
      "responseTime": 180,
      "lastChecked": "2024-01-16T10:30:00Z", 
      "statusCode": 200
    }
  },
  "overall": "operational|degraded|outage",
  "lastUpdated": "2024-01-16T10:30:00Z"
}
```

#### GET /api/status/websites/{website}
**Purpose**: Get detailed status for a specific website
**Parameters**: website (loyalhood.xyz, host.loyalhood.xyz, pm.loyalhood.xyz)
**Response**:
```json
{
  "website": "loyalhood.xyz",
  "status": "online",
  "responseTime": 150,
  "lastChecked": "2024-01-16T10:30:00Z",
  "statusCode": 200,
  "history": [
    {
      "timestamp": "2024-01-16T10:25:00Z",
      "status": "online",
      "responseTime": 145
    }
  ]
}
```

#### GET /api/status/uptime
**Purpose**: Get 24-hour uptime data for visualization
**Response**:
```json
{
  "uptime": [
    {
      "hour": 0,
      "percentage": 100,
      "incidents": 0
    },
    {
      "hour": 1, 
      "percentage": 98.5,
      "incidents": 1
    }
  ]
}
```

## Backend Implementation Requirements

### 1. Website Status Checker Service
- Implement HTTP requests to check website availability
- Handle timeouts (5-second timeout recommended)
- Track response times
- Store status history in MongoDB
- Run periodic checks every 30 seconds using background job

### 2. Database Schema (MongoDB)

#### WebsiteStatus Collection
```javascript
{
  _id: ObjectId,
  website: "loyalhood.xyz",
  status: "online|offline|degraded",
  responseTime: 150,
  statusCode: 200,
  checkedAt: Date,
  createdAt: Date
}
```

#### UptimeHistory Collection  
```javascript
{
  _id: ObjectId,
  website: "loyalhood.xyz", 
  hour: 0, // 0-23
  date: "2024-01-16",
  uptime: 98.5,
  incidents: 1,
  createdAt: Date
}
```

### 3. Background Job Implementation
- Use FastAPI background tasks or APScheduler
- Check all 3 websites every 30 seconds
- Store results in database
- Calculate uptime percentages
- Clean up old data (keep 30 days of history)

## Frontend Integration Changes

### 1. API Service Integration
Replace mock data calls in `ResourceMonitor.js` with actual API calls:

```javascript
// Replace mock status checking with:
const fetchWebsiteStatus = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/status/websites`);
    const data = await response.json();
    setWebsiteStatus(data.websites);
  } catch (error) {
    console.error('Failed to fetch website status:', error);
    // Fallback to mock data or show error state
  }
};
```

### 2. Real-time Updates
- Implement WebSocket connection or polling every 30 seconds
- Update UI when status changes
- Show connection status indicators

### 3. Error Handling
- Handle API failures gracefully
- Show loading states
- Implement retry logic for failed requests

## Security Considerations
- Rate limit status endpoints to prevent abuse
- Implement CORS properly for frontend access
- Add authentication for sensitive status information if needed

## Testing Requirements
- Unit tests for website status checker functions
- Integration tests for API endpoints
- Mock external website responses for testing
- Test error scenarios (timeouts, network failures)

## Deployment Notes
- Backend needs to be able to make external HTTP requests
- Consider firewall rules for outbound connections
- Monitor background job performance
- Set up alerts for backend monitoring failures

## Migration Plan
1. Implement backend API endpoints
2. Test with Postman/curl
3. Update frontend to use real APIs
4. Deploy and monitor
5. Remove mock data once confirmed working