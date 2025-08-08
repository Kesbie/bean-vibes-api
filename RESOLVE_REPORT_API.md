# Resolve Report API Documentation

## Overview

This document describes the new endpoint for resolving reports. Admins can now easily change the status of a report from "pending" to "resolved" and specify what actions were taken to resolve the report.

## New Endpoint

### Resolve a Report (Admin Only)
```
PATCH /v1/reports/:reportId/resolve
Authorization: Bearer <admin_token>
```

**Description:** Changes the status of a report from "pending" to "resolved" and optionally records actions taken

**Parameters:**
- `reportId` (string, required): The ID of the report to resolve

**Headers:**
- `Authorization`: Bearer token with admin privileges
- `Content-Type`: application/json

**Request Body (Optional):**
```json
{
  "resolvedActions": ["hide", "warn_user"]
}
```

**Available Actions:**
- `hide`: Content was hidden from public view
- `delete`: Content was permanently deleted
- `ban_user`: User was banned from the platform
- `warn_user`: User was given a warning

**Response:**
```json
{
  "code": 200,
  "message": "OK",
  "data": {
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
    "status": "resolved",
    "resolvedActions": ["hide", "warn_user"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Business Logic

### Validation Rules
1. **Report Existence**: The report must exist in the database
2. **Status Check**: The report must be in "pending" status to be resolved
3. **Admin Permission**: Only users with `manageReports` permission can resolve reports
4. **Actions Validation**: If provided, resolvedActions must contain valid action types

### Status Flow
- **pending** → **resolved** ✅ (Allowed)
- **resolved** → **resolved** ❌ (Not allowed - will return error)

### Resolved Actions
- Actions are stored as an array of strings
- Multiple actions can be recorded for a single report
- If no actions are provided, the array remains empty
- Actions help track what measures were taken to address the reported content

## Error Responses

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Report is not in pending status"
}
```
**When:** Report is already resolved or in another status

### 400 Bad Request (Invalid Actions)
```json
{
  "code": 400,
  "message": "Validation failed",
  "details": "resolvedActions contains invalid action types"
}
```
**When:** Invalid action types are provided in resolvedActions

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
**When:** User doesn't have `manageReports` permission

### 404 Not Found
```json
{
  "code": 404,
  "message": "Report not found"
}
```
**When:** Report ID doesn't exist in the database

## Usage Examples

### Resolve a report without actions
```bash
curl -X PATCH \
  http://localhost:3000/v1/reports/report_id/resolve \
  -H 'Authorization: Bearer admin_token' \
  -H 'Content-Type: application/json'
```

### Resolve a report with actions
```bash
curl -X PATCH \
  http://localhost:3000/v1/reports/report_id/resolve \
  -H 'Authorization: Bearer admin_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "resolvedActions": ["hide", "warn_user"]
  }'
```

### Using JavaScript/Fetch
```javascript
const resolveReport = async (reportId, token, actions = []) => {
  const response = await fetch(`/v1/reports/${reportId}/resolve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      resolvedActions: actions
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Usage examples
try {
  // Resolve without actions
  const result1 = await resolveReport('report_id', 'admin_token');
  console.log('Report resolved:', result1);
  
  // Resolve with actions
  const result2 = await resolveReport('report_id', 'admin_token', ['hide', 'delete']);
  console.log('Report resolved with actions:', result2);
} catch (error) {
  console.error('Error resolving report:', error);
}
```

### Using Axios
```javascript
import axios from 'axios';

const resolveReport = async (reportId, actions = []) => {
  try {
    const response = await axios.patch(
      `/v1/reports/${reportId}/resolve`,
      {
        resolvedActions: actions
      },
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error resolving report:', error.response.data);
    throw error;
  }
};
```

## Integration with Existing Endpoints

### Related Endpoints
- `GET /v1/reports` - Get all reports (can filter by status)
- `GET /v1/reports/pending` - Get only pending reports
- `GET /v1/reports/status/:status` - Get reports by specific status
- `PATCH /v1/reports/:reportId/status` - Update report status (general purpose)

### Workflow Example
1. **Get pending reports**: `GET /v1/reports/pending`
2. **Review a specific report**: `GET /v1/reports/:reportId`
3. **Resolve the report with actions**: `PATCH /v1/reports/:reportId/resolve`
4. **Verify resolution**: `GET /v1/reports/:reportId`

## Model Changes

### Removed Fields
- `review`: Removed redundant field (use `reportable` with `reportableModel` instead)
- `comment`: Removed redundant field (use `reportable` with `reportableModel` instead)

### Added Fields
- `resolvedActions`: Array of strings to track actions taken when resolving reports

### Polymorphic Relationship
The report model now uses a cleaner polymorphic relationship:
- `reportable`: ObjectId reference to the reported content
- `reportableModel`: String indicating the type ('Review' or 'Comment')

## Testing

Run the test script to verify functionality:
```bash
node test-resolve-report.js
```

This script will:
1. Create test reports with pending status
2. Test the resolve functionality with and without actions
3. Verify status changes and action recording
4. Test error cases (resolving already resolved reports)
5. Test default values for resolvedActions
6. Clean up test data

## Security Considerations

1. **Authentication Required**: All requests must include a valid Bearer token
2. **Authorization Required**: Only users with `manageReports` permission can access this endpoint
3. **Input Validation**: Report ID is validated to ensure it's a valid ObjectId
4. **Status Validation**: Only reports in "pending" status can be resolved
5. **Actions Validation**: Only valid action types are accepted
6. **Audit Trail**: The `updatedAt` timestamp is automatically updated when a report is resolved

## Database Impact

- **Read Operation**: Fetches the report by ID
- **Write Operation**: Updates the `status` field and optionally the `resolvedActions` array
- **Index Usage**: Uses the primary key index for efficient lookups
- **No Cascade**: Resolving a report doesn't affect the reported content (review/comment)

## Performance Considerations

- **Single Document Update**: Only updates the status and actions fields, minimal database impact
- **Indexed Queries**: Uses ObjectId for fast lookups
- **No Population**: Doesn't populate related documents unless needed
- **Atomic Operation**: Status change and actions recording is atomic and consistent
