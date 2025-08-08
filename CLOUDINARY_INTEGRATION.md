# Cloudinary Integration with Multer

This document explains how Cloudinary has been integrated with Multer for file uploads in the Bean Vibes API.

## Overview

The integration uses Cloudinary cloud storage exclusively for all file uploads, providing:
- Automatic image/video optimization
- CDN delivery for faster loading
- Image transformations on-the-fly
- Better scalability and reliability
- No local file storage

## Configuration

### Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Cloudinary Configuration

The Cloudinary configuration is in `src/config/cloudinary.js`:

```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

## Multer Configuration

### Memory Storage Only

The Multer configuration uses memory storage exclusively for Cloudinary integration:

```javascript
const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10, // Maximum 10 files per request
  },
  fileFilter: fileFilter,
});
```

**Note**: No local disk storage is used. All files are uploaded directly to Cloudinary.

## Cloudinary Service

A dedicated service (`src/services/cloudinary.service.js`) provides:

### Functions

- `uploadFile(fileBuffer, folder, options)` - Upload single file
- `uploadMultipleFiles(files, folder, options)` - Upload multiple files
- `deleteFile(publicId, resourceType)` - Delete file from Cloudinary
- `getFileInfo(publicId, resourceType)` - Get file metadata
- `getTransformedUrl(publicId, transformations)` - Generate transformed URLs

### Usage Examples

```javascript
const { cloudinaryService } = require('../services');

// Upload single file
const result = await cloudinaryService.uploadFile(fileBuffer, 'bean-vibes');

// Upload multiple files
const results = await cloudinaryService.uploadMultipleFiles(files, 'bean-vibes');

// Delete file
await cloudinaryService.deleteFile('public_id', 'image');

// Get transformed URL
const url = cloudinaryService.getTransformedUrl('public_id', {
  width: 300,
  height: 200,
  crop: 'fill'
});
```

## Media Model

The Media model (`src/models/media.model.js`) includes required Cloudinary fields:

```javascript
// Cloudinary specific fields (all required)
cloudinaryId: {
  type: String,
  required: true,
},
cloudinaryUrl: {
  type: String,
  required: true,
},
format: {
  type: String,
  required: true,
},
width: {
  type: Number,
  required: false,
},
height: {
  type: Number,
  required: false,
},
bytes: {
  type: Number,
  required: false,
},
```

## Upload Controller

The upload controller (`src/controllers/upload.controller.js`) exclusively handles Cloudinary uploads:

### Upload Process

1. Files are received via Multer with memory storage
2. Each file is uploaded to Cloudinary using the service
3. Cloudinary metadata is stored in the Media model
4. The secure URL is used for serving files

### Delete Process

1. Media record is retrieved from database
2. File is deleted from Cloudinary
3. Media record is deleted from database
4. If Cloudinary deletion fails, the entire operation fails

## API Endpoints

The existing upload endpoints work exclusively with Cloudinary:

- `POST /v1/upload` - Upload media files to Cloudinary
- `GET /v1/upload/:mediaId` - Get media info
- `DELETE /v1/upload/:mediaId` - Delete media from Cloudinary and database

## File Types Supported

- **Images**: jpg, jpeg, png, gif, webp
- **Videos**: mp4, avi, mov, wmv, flv, webm

## Cloudinary Features

### Automatic Optimization

Files are automatically optimized with:
- Quality: `auto:good`
- Format: `auto` (best format for browser)

### Folder Organization

Files are organized in Cloudinary folders:
- Default folder: `bean-vibes`

### Transformations

You can apply transformations on-the-fly:

```javascript
// Resize image
const url = cloudinaryService.getTransformedUrl('public_id', {
  width: 300,
  height: 200,
  crop: 'fill'
});

// Apply filters
const url = cloudinaryService.getTransformedUrl('public_id', {
  effect: 'blur:1000'
});
```

## Error Handling

The integration includes strict error handling:

- Cloudinary upload failures cause the entire operation to fail
- Cloudinary deletion failures prevent database deletion
- Detailed error messages for debugging
- No fallback to local storage

## Performance Benefits

- **Faster loading**: CDN delivery
- **Automatic optimization**: Reduced file sizes
- **Scalability**: No local storage limitations
- **Reliability**: Cloudinary's infrastructure
- **No disk space usage**: All files stored in the cloud

## Security

- Secure URLs are used for all Cloudinary files
- API keys are stored in environment variables
- File type validation prevents malicious uploads
- File size limits prevent abuse
- No local file storage reduces security risks

## Migration from Local Storage

If you have existing media files stored locally:

1. **Backup your data**: Export existing media records
2. **Re-upload to Cloudinary**: Upload existing files through the new API
3. **Update database**: Replace local URLs with Cloudinary URLs
4. **Remove local files**: Clean up local upload directory

## Important Notes

- **No local storage**: All files are stored exclusively on Cloudinary
- **Required fields**: Cloudinary fields are now required in the Media model
- **No fallback**: If Cloudinary is unavailable, uploads will fail
- **Dependency**: The system now depends on Cloudinary's availability 