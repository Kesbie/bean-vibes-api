# Hidden Content API Documentation

## Overview

This document describes the new functionality for hiding comments and reviews. Admins can now hide inappropriate content from public view while preserving the data for moderation purposes.

## New Fields

### Comment Model
- `isHidden` (Boolean, default: false): Indicates whether the comment is hidden from public view

### Review Model  
- `isHidden` (Boolean, default: false): Indicates whether the review is hidden from public view

## New Permissions

Two new permissions have been added to the roles system:

- `manageHiddenComments`: Allows hiding/unhiding comments
- `manageHiddenReviews`: Allows hiding/unhiding reviews

These permissions are available to `admin` and `superAdmin` roles.

## API Endpoints

### Comments

#### Hide a Comment (Admin Only)
```
PATCH /v1/comments/:commentId/hide
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "id": "comment_id",
  "content": "Comment content",
  "isHidden": true,
  "user": "user_id",
  "review": "review_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Unhide a Comment (Admin Only)
```
PATCH /v1/comments/:commentId/unhide
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "id": "comment_id",
  "content": "Comment content", 
  "isHidden": false,
  "user": "user_id",
  "review": "review_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Comments (with hidden content option)
```
GET /v1/comments?includeHidden=true
Authorization: Bearer <admin_token> (required for includeHidden=true)
```

**Query Parameters:**
- `includeHidden` (boolean, optional): Include hidden comments in results (admin only)

### Reviews

#### Hide a Review (Admin Only)
```
PATCH /v1/reviews/:reviewId/hide
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "id": "review_id",
  "title": "Review title",
  "content": "Review content",
  "isHidden": true,
  "user": "user_id",
  "place": "place_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Unhide a Review (Admin Only)
```
PATCH /v1/reviews/:reviewId/unhide
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "id": "review_id",
  "title": "Review title",
  "content": "Review content",
  "isHidden": false,
  "user": "user_id",
  "place": "place_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Reviews (with hidden content option)
```
GET /v1/reviews?includeHidden=true
Authorization: Bearer <admin_token> (required for includeHidden=true)
```

**Query Parameters:**
- `includeHidden` (boolean, optional): Include hidden reviews in results (admin only)

## Behavior Changes

### Default Filtering
- All existing endpoints now automatically filter out hidden content by default
- Hidden content is only returned when explicitly requested with `includeHidden=true`
- This ensures that hidden content doesn't appear in public-facing API responses

### Admin Access
- Admins can view hidden content by adding `includeHidden=true` to query parameters
- Admins can hide/unhide content using the new endpoints
- Regular users cannot access hidden content or use hide/unhide endpoints

## Error Responses

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Please authenticate"
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "Comment not found"
}
```

## Usage Examples

### Hide an inappropriate comment
```bash
curl -X PATCH \
  http://localhost:3000/v1/comments/comment_id/hide \
  -H 'Authorization: Bearer admin_token' \
  -H 'Content-Type: application/json'
```

### View all comments including hidden ones (admin only)
```bash
curl -X GET \
  'http://localhost:3000/v1/comments?includeHidden=true' \
  -H 'Authorization: Bearer admin_token'
```

### Unhide a review that was mistakenly hidden
```bash
curl -X PATCH \
  http://localhost:3000/v1/reviews/review_id/unhide \
  -H 'Authorization: Bearer admin_token' \
  -H 'Content-Type: application/json'
```

## Database Migration

The new `isHidden` fields are added with default values of `false`, so existing data will remain visible. No migration script is required.

## Testing

Run the test script to verify functionality:
```bash
node test-hidden-content.js
```

This script will:
1. Create test comments and reviews
2. Test hiding/unhiding functionality
3. Verify that hidden content is properly filtered
4. Clean up test data
