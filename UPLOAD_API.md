# Upload API Documentation

## Overview
The upload API allows users to upload media files (images and videos) to the server. All endpoints require authentication.

## Endpoints

### Upload Media
**POST** `/v1/upload`

Upload a single media file (image or video).

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: multipart/form-data`

**Body:**
- `file`: The file to upload (required)

**Supported file types:**
- Images: jpg, jpeg, png, gif, webp
- Videos: mp4, avi, mov, wmv, flv, webm

**File size limit:** 10MB

**Response:**
```json
{
  "status": "success",
  "data": {
    "media": {
      "_id": "media_id",
      "type": "image",
      "size": 123456,
      "url": "/uploads/file-1234567890-123456789.jpg",
      "originalName": "example.jpg",
      "filename": "file-1234567890-123456789.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get Media
**GET** `/v1/upload/:mediaId`

Get media information by ID.

**Response:**
```json
{
  "status": "success",
  "data": {
    "media": {
      "_id": "media_id",
      "type": "image",
      "size": 123456,
      "url": "/uploads/file-1234567890-123456789.jpg",
      "originalName": "example.jpg",
      "filename": "file-1234567890-123456789.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Delete Media
**DELETE** `/v1/upload/:mediaId`

Delete media by ID. Requires authentication.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "status": "success",
  "message": "Media deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "code": 400,
  "message": "No file uploaded"
}
```

### 400 Bad Request - Invalid File Type
```json
{
  "code": 400,
  "message": "Invalid file type. Only images and videos are allowed."
}
```

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Please authenticate"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "Media not found"
}
```

## File Storage

Uploaded files are stored in the `uploads/` directory at the project root. Files are served statically at the `/uploads/` URL path.

## Security

- File uploads are restricted to authenticated users with the `uploadMedia` permission
- File types are validated both by extension and MIME type
- File size is limited to 10MB
- Unique filenames are generated to prevent conflicts
- Uploaded files are not committed to version control (uploads/ directory is gitignored) 