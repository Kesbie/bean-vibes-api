# Comment Structure Documentation

## Overview
Comment chỉ thuộc về Review, không thuộc về Place. Mỗi comment được tạo bởi một user và liên kết với một review cụ thể.

## Comment Model

### Schema
```javascript
{
  review: ObjectId,        // Reference to Review (required)
  user: ObjectId,          // Reference to User (required)
  content: String,         // Comment content (required, max 1000 chars)
  reactions: [ObjectId],   // Array of Reaction references
  reports: [ObjectId],     // Array of Report references
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

### Relationships
- **Comment** → **Review** (Many-to-One)
- **Comment** → **User** (Many-to-One)
- **Comment** → **Reaction** (One-to-Many)
- **Comment** → **Report** (One-to-Many)

## API Endpoints

### 1. Create Comment
```http
POST /v1/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "review": "64f1a2b3c4d5e6f7g8h9i0j1",
  "content": "Great review! I totally agree with your points."
}
```

### 2. Get Comments
```http
GET /v1/comments?review=64f1a2b3c4d5e6f7g8h9i0j1&user=64f1a2b3c4d5e6f7g8h9i0j2&limit=10&page=1
```

### 3. Get Comment by ID
```http
GET /v1/comments/64f1a2b3c4d5e6f7g8h9i0j3
```

### 4. Update Comment
```http
PATCH /v1/comments/64f1a2b3c4d5e6f7g8h9i0j3
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

### 5. Delete Comment
```http
DELETE /v1/comments/64f1a2b3c4d5e6f7g8h9i0j3
Authorization: Bearer <token>
```

### 6. Get Comments by Review
```http
GET /v1/comments/review/64f1a2b3c4d5e6f7g8h9i0j1?limit=10&page=1
```

### 7. Get Comments by User
```http
GET /v1/comments/user/64f1a2b3c4d5e6f7g8h9i0j2?limit=10&page=1
```

### 8. Add Comment to Review (Alternative)
```http
POST /v1/reviews/64f1a2b3c4d5e6f7g8h9i0j1/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a great place!"
}
```

## Validation Rules

### Create/Update Comment
- `review`: Required, valid ObjectId
- `content`: Required, 1-1000 characters
- `user`: Auto-assigned from authenticated user

### Query Parameters
- `review`: Filter by review ID
- `user`: Filter by user ID
- `sortBy`: Sort field (e.g., "createdAt:desc")
- `limit`: Number of results (default: 10)
- `page`: Page number (default: 1)

## Response Examples

### Create Comment Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "review": "64f1a2b3c4d5e6f7g8h9i0j1",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "content": "Great review! I totally agree with your points.",
  "reactions": [],
  "reports": [],
  "createdAt": "2023-09-01T10:00:00.000Z",
  "updatedAt": "2023-09-01T10:00:00.000Z"
}
```

### Get Comments Response
```json
{
  "results": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "review": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "title": "Amazing Coffee Shop"
      },
      "user": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "content": "Great review! I totally agree with your points.",
      "reactions": [],
      "reports": [],
      "createdAt": "2023-09-01T10:00:00.000Z",
      "updatedAt": "2023-09-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "totalResults": 1
}
```

## Business Logic

### Comment Creation
1. User must be authenticated
2. Review must exist
3. Content must be valid (1-1000 characters)
4. Comment is automatically linked to the review
5. Review's comments array is updated

### Comment Updates
1. Only comment owner can update
2. Content validation applies
3. Updated timestamp is automatically set

### Comment Deletion
1. Only comment owner or admin can delete
2. Comment is removed from review's comments array
3. Associated reactions and reports are handled

### Content Filtering
- Comments go through the same content filtering as reviews
- Restricted words are checked and replaced if necessary
- Highly sensitive content may prevent comment creation

## Error Handling

### Common Errors
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Comment or review not found
- `422 Unprocessable Entity`: Content validation failed

### Error Response Format
```json
{
  "code": 400,
  "message": "Validation error",
  "details": {
    "content": "Content is required"
  }
}
```

## Security Considerations

### Authentication
- All comment operations require authentication
- User can only modify their own comments
- Admin/moderator can manage all comments

### Content Moderation
- Comments are subject to content filtering
- Users can report inappropriate comments
- Moderators can review and take action on reports

### Rate Limiting
- Comment creation is rate-limited to prevent spam
- Users cannot create multiple comments rapidly

## Integration with Review System

### Review Model Updates
```javascript
{
  // ... other fields
  comments: [ObjectId],  // Array of Comment references
  // ... other fields
}
```

### Automatic Updates
- When comment is created, it's added to review's comments array
- When comment is deleted, it's removed from review's comments array
- Review's comment count can be calculated from comments array length

## Performance Considerations

### Indexing
- Index on `review` field for efficient querying
- Index on `user` field for user-specific queries
- Index on `createdAt` for chronological sorting

### Population
- User data is populated for display
- Review data is populated when needed
- Reactions and reports are populated on demand

### Pagination
- All comment lists support pagination
- Default limit is 10 comments per page
- Maximum limit is 100 comments per page 