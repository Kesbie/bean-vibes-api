# Reported Users Statistics API Documentation

## Overview

This document describes the new endpoint for getting statistics of users who have been reported. This endpoint provides aggregated data about users who have received reports, including their report counts, status breakdowns, and user information.

## New Endpoint

### Get Reported Users Statistics (Admin Only)
```
GET /v1/reports/stats/users
Authorization: Bearer <admin_token>
```

**Description:** Get statistics of users who have been reported, sorted by report count

**Headers:**
- `Authorization`: Bearer token with admin privileges

**Query Parameters:**
- `limit` (number, optional): Maximum number of results per page (default: 10, max: 100)
- `page` (number, optional): Page number (default: 1)
- `sortBy` (string, optional): Sort option (default: 'reportCount:desc')

**Available Sort Options:**
- `reportCount:desc` - Sort by report count descending (default)
- `reportCount:asc` - Sort by report count ascending
- `latestReport:desc` - Sort by latest report date descending
- `latestReport:asc` - Sort by latest report date ascending

**Response:**
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "results": [
      {
        "userId": "user_id",
        "user": {
          "id": "user_id",
          "name": "User Name",
          "email": "user@example.com",
          "avatar": "avatar_url"
        },
        "reportCount": 5,
        "pendingReports": 2,
        "resolvedReports": 3,
        "latestReport": {
          "id": "report_id",
          "title": "Latest Report Title",
          "reason": "Report reason",
          "status": "pending",
          "createdAt": "2024-01-01T00:00:00.000Z"
        },
        "reasons": [
          "Inappropriate content",
          "Spam content",
          "Offensive language"
        ],
        "resolvedActions": [
          ["hide"],
          ["delete", "warn_user"],
          ["ban_user"]
        ]
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "totalCount": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Response Structure

### User Statistics Object
- `userId`: The user's ID
- `user`: User information object
  - `id`: User ID
  - `name`: User's display name
  - `email`: User's email address
  - `avatar`: User's avatar URL
- `reportCount`: Total number of reports for this user
- `pendingReports`: Number of pending reports
- `resolvedReports`: Number of resolved reports
- `latestReport`: Information about the most recent report
  - `id`: Report ID
  - `title`: Report title
  - `reason`: Report reason
  - `status`: Report status
  - `createdAt`: Report creation date
- `reasons`: Array of all report reasons for this user
- `resolvedActions`: Array of resolved actions taken for each report

### Pagination Object
- `page`: Current page number
- `limit`: Number of results per page
- `totalPages`: Total number of pages
- `totalCount`: Total number of unique users with reports
- `hasNextPage`: Whether there's a next page
- `hasPrevPage`: Whether there's a previous page

## Business Logic

### Aggregation Pipeline
The endpoint uses MongoDB aggregation to:
1. **Group by user**: Groups all reports by the user who was reported
2. **Count reports**: Calculates total, pending, and resolved report counts
3. **Get latest report**: Finds the most recent report for each user
4. **Collect reasons**: Gathers all report reasons
5. **Collect actions**: Gathers all resolved actions
6. **Lookup user info**: Populates user information from the users collection
7. **Sort results**: Orders by report count (descending by default)
8. **Apply pagination**: Limits results and skips for pagination

### Data Processing
- **Deduplication**: Each user appears only once in the results
- **Counting**: Accurate counts for total, pending, and resolved reports
- **Latest Report**: Most recent report based on creation date
- **User Population**: Full user information is populated for each entry

## Error Responses

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Please authenticate"
}
```
**When:** No valid authentication token provided

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Forbidden"
}
```
**When:** User doesn't have `getReports` permission

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Validation failed",
  "details": "Invalid query parameters"
}
```
**When:** Invalid query parameters provided

## Usage Examples

### Get default statistics
```bash
curl -X GET \
  http://localhost:3000/v1/reports/stats/users \
  -H 'Authorization: Bearer admin_token'
```

### Get statistics with custom pagination
```bash
curl -X GET \
  'http://localhost:3000/v1/reports/stats/users?limit=5&page=2' \
  -H 'Authorization: Bearer admin_token'
```

### Get statistics sorted by latest report
```bash
curl -X GET \
  'http://localhost:3000/v1/reports/stats/users?sortBy=latestReport:desc' \
  -H 'Authorization: Bearer admin_token'
```

### Using JavaScript/Fetch
```javascript
const getReportedUsersStats = async (token, options = {}) => {
  const params = new URLSearchParams(options);
  const response = await fetch(`/v1/reports/stats/users?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Usage examples
try {
  // Get default stats
  const stats1 = await getReportedUsersStats('admin_token');
  console.log('Default stats:', stats1);
  
  // Get stats with pagination
  const stats2 = await getReportedUsersStats('admin_token', {
    limit: 5,
    page: 1,
    sortBy: 'reportCount:desc'
  });
  console.log('Paginated stats:', stats2);
} catch (error) {
  console.error('Error getting stats:', error);
}
```

### Using Axios
```javascript
import axios from 'axios';

const getReportedUsersStats = async (options = {}) => {
  try {
    const response = await axios.get('/v1/reports/stats/users', {
      params: options,
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting stats:', error.response.data);
    throw error;
  }
};
```

## Integration with Existing Endpoints

### Related Endpoints
- `GET /v1/reports` - Get all reports
- `GET /v1/reports/pending` - Get pending reports
- `GET /v1/reports/user/:userId` - Get reports for a specific user
- `PATCH /v1/reports/:reportId/resolve` - Resolve a report

### Workflow Example
1. **Get reported users stats**: `GET /v1/reports/stats/users`
2. **Review specific user**: `GET /v1/reports/user/:userId`
3. **Resolve reports**: `PATCH /v1/reports/:reportId/resolve`

## Use Cases

### Admin Dashboard
- Display top reported users
- Monitor user behavior patterns
- Track moderation effectiveness

### User Management
- Identify problematic users
- Prioritize moderation efforts
- Track user improvement over time

### Analytics
- Generate moderation reports
- Analyze report patterns
- Measure community health

## Performance Considerations

### Indexing
- **User field**: Indexed for efficient grouping
- **Status field**: Indexed for status filtering
- **CreatedAt field**: Indexed for latest report sorting

### Aggregation Optimization
- **Efficient grouping**: Groups by user ID for fast aggregation
- **Minimal data transfer**: Only fetches necessary user fields
- **Pagination**: Limits result set size

### Caching Strategy
- **Short-term caching**: Cache results for 5-10 minutes
- **Cache invalidation**: Invalidate when new reports are created
- **User-specific caching**: Cache per user for personalized views

## Security Considerations

1. **Authentication Required**: All requests must include a valid Bearer token
2. **Authorization Required**: Only users with `getReports` permission can access this endpoint
3. **Data Privacy**: Only returns necessary user information (name, email, avatar)
4. **Rate Limiting**: Endpoint should be rate-limited to prevent abuse
5. **Audit Trail**: Access to this endpoint should be logged for security monitoring

## Testing

Run the test script to verify functionality:
```bash
node test-reported-users-stats.js
```

This script will:
1. Create test users and reports
2. Test the aggregation functionality
3. Verify data structure and sorting
4. Test pagination
5. Clean up test data

## Database Impact

- **Read Operation**: Uses aggregation pipeline for efficient data processing
- **No Write Operations**: This is a read-only endpoint
- **Index Usage**: Leverages existing indexes on user and status fields
- **Memory Usage**: Aggregation pipeline is optimized for memory efficiency
