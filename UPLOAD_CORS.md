# Upload CORS Configuration

## Overview

The uploads directory has been configured with relaxed CORS (Cross-Origin Resource Sharing) settings to allow images and other media files to be loaded from external websites and applications.

## Configuration Details

### CORS Headers

The following CORS headers are set for all requests to `/uploads/*`:

- `Access-Control-Allow-Origin: *` - Allows requests from any origin
- `Access-Control-Allow-Methods: GET, HEAD, OPTIONS` - Allows these HTTP methods
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With` - Allows these request headers
- `Access-Control-Expose-Headers: Content-Length, Content-Type` - Exposes these response headers to the client
- `Access-Control-Max-Age: 86400` - Caches preflight requests for 24 hours

### Content Security Policy

The Content Security Policy (CSP) has been relaxed to allow images from any origin:

```javascript
imgSrc: ["'self'", "data:", "blob:", "*"]
```

This allows:
- Images from the same origin (`'self'`)
- Data URLs (`data:`)
- Blob URLs (`blob:`)
- Images from any external origin (`*`)

### Origin Validation

The CORS configuration includes origin validation that:

1. Allows requests with no origin (mobile apps, curl requests, etc.)
2. Allows requests from the configured frontend URL (if set in environment variables)
3. Allows requests from any other origin for uploads

## Usage Examples

### Loading Images in HTML

```html
<!-- This will work from any domain -->
<img src="https://your-api-domain.com/uploads/image-123456.jpg" alt="Uploaded Image">
```

### Loading Images in JavaScript

```javascript
// Fetch image from another domain
fetch('https://your-api-domain.com/uploads/image-123456.jpg')
  .then(response => response.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = url;
    document.body.appendChild(img);
  });
```

### CSS Background Images

```css
/* This will work from any domain */
.background-image {
  background-image: url('https://your-api-domain.com/uploads/image-123456.jpg');
}
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Public Access**: All files in the uploads directory are publicly accessible. Do not store sensitive files here.

2. **File Validation**: Ensure proper file validation is in place during upload to prevent malicious files.

3. **Rate Limiting**: Consider implementing rate limiting for upload endpoints to prevent abuse.

4. **File Size Limits**: The current configuration allows files up to 10MB.

5. **Allowed File Types**: Only images and videos are allowed (jpg, jpeg, png, gif, webp, mp4, avi, mov, wmv, flv, webm).

## Environment Variables

The following environment variables can be used to configure CORS behavior:

- `FRONTEND_URL`: The URL of your frontend application (optional)
- `DOMAIN`: The domain of your API (optional)

## Testing

Run the CORS tests to verify the configuration:

```bash
npm test -- tests/integration/upload-cors.test.js
```

## Troubleshooting

### Common Issues

1. **Images not loading**: Check that the file exists in the uploads directory
2. **CORS errors**: Verify that the CORS headers are being set correctly
3. **CSP blocking**: Ensure the Content Security Policy allows images from the desired origins

### Debugging

To debug CORS issues, check the browser's developer tools Network tab for:
- CORS preflight requests (OPTIONS)
- Response headers containing CORS information
- Any CORS-related error messages

## API Endpoints

The following endpoints are available for uploads:

- `POST /v1/upload` - Upload media files (requires authentication)
- `GET /v1/upload/:mediaId` - Get media information
- `DELETE /v1/upload/:mediaId` - Delete media (requires authentication)
- `GET /uploads/:filename` - Direct access to uploaded files (public) 