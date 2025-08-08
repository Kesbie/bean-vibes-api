# Place Sorting by ApprovalStatus API Documentation

## Overview

This document describes the custom sorting functionality for places in the admin interface. Places are now sorted by approvalStatus in a specific order: **pending** first, then **approved**, and finally **rejected**.

## Custom Sorting Logic

### Sorting Order
1. **Pending** places (priority 1) - Places awaiting approval
2. **Approved** places (priority 2) - Places that have been approved
3. **Rejected** places (priority 3) - Places that have been rejected

### Implementation Details
The sorting is implemented using MongoDB aggregation pipeline with a custom `$switch` operator to assign priority values:

```javascript
approvalStatusOrder: {
  $switch: {
    branches: [
      { case: { $eq: ['$approvalStatus', 'pending'] }, then: 1 },
      { case: { $eq: ['$approvalStatus', 'approved'] }, then: 2 },
      { case: { $eq: ['$approvalStatus', 'rejected'] }, then: 3 }
    ],
    default: 4
  }
}
```

## API Endpoint

### Get Admin Places with Custom Sorting
```
GET /v1/places/admin
Authorization: Bearer <admin_token>
```

**Description:** Get all places with custom sorting by approvalStatus

**Headers:**
- `Authorization`: Bearer token with admin privileges

**Query Parameters:**
- `limit` (number, optional): Maximum number of results per page (default: 10)
- `page` (number, optional): Page number (default: 1)
- `approvalStatus` (string, optional): Filter by specific approval status
- `status` (string, optional): Filter by place status
- `isVerified` (boolean, optional): Filter by verification status
- `createdBy` (string, optional): Filter by creator ID

**Response:**
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "results": [
      {
        "id": "place_id",
        "name": "Place Name",
        "description": "Place description",
        "approvalStatus": "pending",
        "status": "active",
        "isVerified": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "categories": [...],
        "ratingDetails": {...}
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
1. **Priority Assignment**: Each approvalStatus gets a numeric priority
2. **Primary Sort**: By approvalStatus priority (ascending)
3. **Secondary Sort**: By creation date (descending) - newest first within each status group
4. **Pagination**: Applied after sorting to maintain order across pages

### Fallback Behavior
- If `customSort` is not specified, uses regular pagination with default sorting
- If approvalStatus is not one of the expected values, it gets lowest priority (4)

## Usage Examples

### Get all places with custom sorting
```bash
curl -X GET \
  http://localhost:3000/v1/places/admin \
  -H 'Authorization: Bearer admin_token'
```

### Get places with pagination
```bash
curl -X GET \
  'http://localhost:3000/v1/places/admin?limit=5&page=2' \
  -H 'Authorization: Bearer admin_token'
```

### Get only pending places
```bash
curl -X GET \
  'http://localhost:3000/v1/places/admin?approvalStatus=pending' \
  -H 'Authorization: Bearer admin_token'
```

### Using JavaScript/Fetch
```javascript
const getAdminPlaces = async (token, options = {}) => {
  const params = new URLSearchParams(options);
  const response = await fetch(`/v1/places/admin?${params}`, {
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
  // Get all places with custom sorting
  const places1 = await getAdminPlaces('admin_token');
  console.log('All places:', places1);
  
  // Get places with pagination
  const places2 = await getAdminPlaces('admin_token', {
    limit: 5,
    page: 1
  });
  console.log('Paginated places:', places2);
  
  // Get only pending places
  const places3 = await getAdminPlaces('admin_token', {
    approvalStatus: 'pending'
  });
  console.log('Pending places:', places3);
} catch (error) {
  console.error('Error getting places:', error);
}
```

### Using Axios
```javascript
import axios from 'axios';

const getAdminPlaces = async (options = {}) => {
  try {
    const response = await axios.get('/v1/places/admin', {
      params: options,
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting places:', error.response.data);
    throw error;
  }
};
```

## Expected Results

### Sorting Order Example
Given the following places:
1. "Cafe A" - approved (created: 2024-01-01)
2. "Restaurant B" - pending (created: 2024-01-02)
3. "Bar C" - rejected (created: 2024-01-03)
4. "Coffee D" - pending (created: 2024-01-04)

**Result order:**
1. "Restaurant B" - pending (newer)
2. "Coffee D" - pending (older)
3. "Cafe A" - approved (newer)
4. "Bar C" - rejected (newer)

## Integration with Existing Features

### Related Endpoints
- `GET /v1/places/admin/:placeId` - Get specific place details
- `PATCH /v1/places/admin/:placeId/approval` - Update approval status
- `GET /v1/places/pending` - Get only pending places

### Workflow Example
1. **Get admin places**: `GET /v1/places/admin` (pending places appear first)
2. **Review pending place**: `GET /v1/places/admin/:placeId`
3. **Update approval**: `PATCH /v1/places/admin/:placeId/approval`
4. **Refresh list**: `GET /v1/places/admin` (updated order)

## Performance Considerations

### Indexing
- **approvalStatus field**: Indexed for efficient filtering and sorting
- **createdAt field**: Indexed for secondary sorting
- **Compound index**: Consider compound index on (approvalStatus, createdAt) for optimal performance

### Aggregation Optimization
- **Efficient grouping**: Uses MongoDB's native aggregation pipeline
- **Minimal data transfer**: Only processes necessary fields
- **Pagination**: Limits result set size

### Caching Strategy
- **Short-term caching**: Cache results for 2-5 minutes
- **Cache invalidation**: Invalidate when approval status changes
- **Status-specific caching**: Cache per approval status for filtered views

## Security Considerations

1. **Authentication Required**: All requests must include a valid Bearer token
2. **Authorization Required**: Only users with admin privileges can access this endpoint
3. **Data Privacy**: Returns only necessary place information
4. **Rate Limiting**: Endpoint should be rate-limited to prevent abuse

## Testing

Run the test script to verify functionality:
```bash
node test-place-sorting.js
```

This script will:
1. Create test places with different approvalStatus values
2. Test the custom sorting functionality
3. Verify the correct order: pending → approved → rejected
4. Test pagination with custom sorting
5. Test filtering with custom sorting
6. Clean up test data

## Database Impact

- **Read Operation**: Uses aggregation pipeline for efficient sorting
- **No Write Operations**: This is a read-only endpoint
- **Index Usage**: Leverages indexes on approvalStatus and createdAt fields
- **Memory Usage**: Aggregation pipeline is optimized for memory efficiency

## Migration Notes

### Existing Data
- No migration required for existing data
- Custom sorting works with all existing approvalStatus values
- Unknown status values get lowest priority

### Backward Compatibility
- Endpoint maintains backward compatibility
- If customSort is not specified, uses regular pagination
- Existing filters and parameters continue to work
