# Report Sorting by Status API Documentation

## Overview

This document describes the custom sorting functionality for reports in the admin interface. Reports are now sorted by status in a specific order: **pending** first, then **resolved**.

## Custom Sorting Logic

### Sorting Order
1. **Pending** reports (priority 1) - Reports awaiting resolution
2. **Resolved** reports (priority 2) - Reports that have been resolved

### Implementation Details
The sorting is implemented using MongoDB aggregation pipeline with a custom `$switch` operator to assign priority values:

```javascript
statusOrder: {
  $switch: {
    branches: [
      { case: { $eq: ['$status', 'pending'] }, then: 1 },
      { case: { $eq: ['$status', 'resolved'] }, then: 2 }
    ],
    default: 3
  }
}
```

## API Endpoint

### Get Reports with Custom Sorting
```
GET /v1/reports
Authorization: Bearer <admin_token>
```

**Description:** Get all reports with custom sorting by status

**Headers:**
- `Authorization`: Bearer token with admin privileges

**Query Parameters:**
- `limit` (number, optional): Maximum number of results per page (default: 10)
- `page` (number, optional): Page number (default: 1)
- `status` (string, optional): Filter by specific status
- `reportableModel` (string, optional): Filter by reportable model ('Review' or 'Comment')
- `user` (string, optional): Filter by user ID

**Response:**
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "results": [
      {
        "id": "report_id",
        "reportable": "reportable_id",
        "reportableModel": "Review",
        "user": {
          "id": "user_id",
          "name": "User Name",
          "email": "user@example.com"
        },
        "title": "Report Title",
        "reason": "Report reason",
        "status": "pending",
        "resolvedActions": [],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalResults": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Business Logic

### Custom Sorting Implementation
1. **Priority Assignment**: Each status gets a numeric priority
2. **Primary Sort**: By status priority (ascending)
3. **Secondary Sort**: By creation date (descending) - newest first within each status group
4. **Pagination**: Applied after sorting to maintain order across pages

### Fallback Behavior
- If `customSort` is not specified, uses regular pagination with default sorting
- If status is not one of the expected values, it gets lowest priority (3)

## Usage Examples

### Get all reports with custom sorting
```bash
curl -X GET \
  http://localhost:3000/v1/reports \
  -H 'Authorization: Bearer admin_token'
```

### Get reports with pagination
```bash
curl -X GET \
  'http://localhost:3000/v1/reports?limit=5&page=2' \
  -H 'Authorization: Bearer admin_token'
```

### Get only pending reports
```bash
curl -X GET \
  'http://localhost:3000/v1/reports?status=pending' \
  -H 'Authorization: Bearer admin_token'
```

### Get reports by reportable model
```bash
curl -X GET \
  'http://localhost:3000/v1/reports?reportableModel=Review' \
  -H 'Authorization: Bearer admin_token'
```

### Using JavaScript/Fetch
```javascript
const getReports = async (token, options = {}) => {
  const params = new URLSearchParams(options);
  const response = await fetch(`/v1/reports?${params}`, {
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
  // Get all reports with custom sorting
  const reports1 = await getReports('admin_token');
  console.log('All reports:', reports1);
  
  // Get reports with pagination
  const reports2 = await getReports('admin_token', {
    limit: 5,
    page: 1
  });
  console.log('Paginated reports:', reports2);
  
  // Get only pending reports
  const reports3 = await getReports('admin_token', {
    status: 'pending'
  });
  console.log('Pending reports:', reports3);
} catch (error) {
  console.error('Error getting reports:', error);
}
```

### Using Axios
```javascript
import axios from 'axios';

const getReports = async (options = {}) => {
  try {
    const response = await axios.get('/v1/reports', {
      params: options,
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting reports:', error.response.data);
    throw error;
  }
};
```

## Expected Results

### Sorting Order Example
Given the following reports:
1. "Report A" - resolved (created: 2024-01-01)
2. "Report B" - pending (created: 2024-01-02)
3. "Report C" - resolved (created: 2024-01-03)
4. "Report D" - pending (created: 2024-01-04)

**Result order:**
1. "Report B" - pending (newer)
2. "Report D" - pending (older)
3. "Report A" - resolved (newer)
4. "Report C" - resolved (older)

## Integration with Existing Features

### Related Endpoints
- `GET /v1/reports/pending` - Get only pending reports
- `GET /v1/reports/stats/users` - Get reported users statistics
- `PATCH /v1/reports/:reportId/resolve` - Resolve a report
- `GET /v1/reports/:reportId` - Get specific report details

### Workflow Example
1. **Get reports**: `GET /v1/reports` (pending reports appear first)
2. **Review pending report**: `GET /v1/reports/:reportId`
3. **Resolve report**: `PATCH /v1/reports/:reportId/resolve`
4. **Refresh list**: `GET /v1/reports` (updated order)

## Use Cases

### Admin Dashboard
- Display pending reports first for immediate attention
- Monitor resolution progress
- Track moderation workflow efficiency

### Report Management
- Prioritize pending reports for faster resolution
- Maintain organized view of resolved reports
- Streamline moderation workflow

### Analytics
- Generate resolution time reports
- Analyze report patterns by status
- Measure moderation effectiveness

## Performance Considerations

### Indexing
- **Status field**: Indexed for efficient filtering and sorting
- **CreatedAt field**: Indexed for secondary sorting
- **Compound index**: Consider compound index on (status, createdAt) for optimal performance

### Aggregation Optimization
- **Efficient grouping**: Uses MongoDB's native aggregation pipeline
- **Minimal data transfer**: Only processes necessary fields
- **Pagination**: Limits result set size

### Caching Strategy
- **Short-term caching**: Cache results for 2-5 minutes
- **Cache invalidation**: Invalidate when report status changes
- **Status-specific caching**: Cache per status for filtered views

## Security Considerations

1. **Authentication Required**: All requests must include a valid Bearer token
2. **Authorization Required**: Only users with `getReports` permission can access this endpoint
3. **Data Privacy**: Returns only necessary report information
4. **Rate Limiting**: Endpoint should be rate-limited to prevent abuse

## Testing

Run the test script to verify functionality:
```bash
node test-report-sorting.js
```

This script will:
1. Create test reports with different status values
2. Test the custom sorting functionality
3. Verify the correct order: pending → resolved
4. Test pagination with custom sorting
5. Test filtering with custom sorting
6. Clean up test data

## Database Impact

- **Read Operation**: Uses aggregation pipeline for efficient sorting
- **No Write Operations**: This is a read-only endpoint
- **Index Usage**: Leverages indexes on status and createdAt fields
- **Memory Usage**: Aggregation pipeline is optimized for memory efficiency

## Migration Notes

### Existing Data
- No migration required for existing data
- Custom sorting works with all existing status values
- Unknown status values get lowest priority

### Backward Compatibility
- Endpoint maintains backward compatibility
- If customSort is not specified, uses regular pagination
- Existing filters and parameters continue to work

## Technical Implementation

### Aggregation Pipeline Steps
1. **Match**: Apply filters to reports
2. **AddFields**: Add statusOrder field with priority values
3. **Sort**: Sort by statusOrder (ascending) and createdAt (descending)
4. **Skip/Limit**: Apply pagination
5. **Lookup**: Populate user and reportable information
6. **Project**: Remove temporary fields and format output

### Polymorphic Relationship Handling
- Uses conditional lookup for Review and Comment models
- Maintains reportableType information for frontend identification
- Handles both Review and Comment reportable types efficiently
