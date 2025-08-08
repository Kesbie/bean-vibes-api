# Migration to Cloudinary-Only Storage

## Tổng quan

Hệ thống đã được chuyển đổi từ lưu trữ local sang sử dụng Cloudinary hoàn toàn cho tất cả file uploads.

## Những thay đổi chính

### ✅ Đã hoàn thành

1. **Loại bỏ local storage**:
   - Xóa disk storage configuration trong Multer
   - Chỉ sử dụng memory storage cho Cloudinary
   - Loại bỏ fallback logic

2. **Cập nhật Media Model**:
   - Cloudinary fields giờ là required
   - `cloudinaryId`, `cloudinaryUrl`, `format` bắt buộc
   - `width`, `height`, `bytes` optional

3. **Cập nhật Upload Controller**:
   - Upload trực tiếp lên Cloudinary
   - Không còn tạo local URLs
   - Delete từ Cloudinary khi xóa media

4. **Tạo Cloudinary Service**:
   - Centralized Cloudinary operations
   - Upload, delete, transform functions
   - Error handling

### 🔧 Cấu hình cần thiết

Đảm bảo các environment variables được set:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Migration Steps

### 1. Backup dữ liệu hiện tại

```bash
# Export media records từ database
# Backup thư mục uploads/ nếu cần
```

### 2. Cập nhật code

Tất cả code đã được cập nhật. Chỉ cần:

```bash
# Install dependencies
npm install

# Set environment variables
# Chạy ứng dụng
npm run dev
```

### 3. Cleanup local files

```bash
# Xóa thư mục uploads local
npm run cleanup:local-uploads
```

### 4. Test upload

```bash
# Test upload file mới
curl -X POST http://localhost:8000/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@test-image.jpg"
```

## API Changes

### Upload Response

Trước:
```json
{
  "url": "http://localhost:8000/uploads/file-123.jpg"
}
```

Sau:
```json
{
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/bean-vibes/file-123.jpg",
  "cloudinaryId": "bean-vibes/file-123",
  "cloudinaryUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/bean-vibes/file-123.jpg",
  "format": "jpg",
  "width": 1920,
  "height": 1080,
  "bytes": 245760
}
```

### Delete Process

Trước:
- Chỉ xóa record từ database
- File local vẫn còn

Sau:
- Xóa file từ Cloudinary
- Xóa record từ database
- Nếu Cloudinary delete fail → toàn bộ operation fail

## Benefits

### 🚀 Performance
- **CDN Delivery**: Files được serve từ global CDN
- **Automatic Optimization**: Images/videos được optimize tự động
- **Faster Loading**: Không phụ thuộc vào server bandwidth

### 💾 Storage
- **No Disk Usage**: Không tốn disk space local
- **Unlimited Storage**: Cloudinary storage không giới hạn
- **Automatic Backup**: Cloudinary tự động backup

### 🔧 Features
- **Image Transformations**: Resize, crop, filter on-the-fly
- **Format Optimization**: Tự động chọn format tốt nhất
- **Quality Optimization**: Tự động optimize quality

## Important Notes

### ⚠️ Dependencies
- Hệ thống giờ phụ thuộc vào Cloudinary availability
- Nếu Cloudinary down → uploads sẽ fail
- Cần có internet connection

### 🔒 Security
- API keys được lưu trong environment variables
- Secure URLs được sử dụng
- File validation vẫn được áp dụng

### 📊 Monitoring
- Monitor Cloudinary usage và costs
- Track upload success/failure rates
- Monitor CDN performance

## Troubleshooting

### Upload Failures
1. Kiểm tra Cloudinary credentials
2. Kiểm tra internet connection
3. Kiểm tra file size limits
4. Kiểm tra file type validation

### Delete Failures
1. Kiểm tra Cloudinary API permissions
2. Kiểm tra public_id format
3. Kiểm tra resource_type (image/video)

### Performance Issues
1. Kiểm tra CDN settings
2. Optimize image transformations
3. Monitor Cloudinary usage

## Rollback Plan

Nếu cần rollback về local storage:

1. Restore backup của Multer config
2. Restore backup của Upload controller
3. Restore backup của Media model
4. Restore local upload files
5. Update environment variables

## Support

Nếu gặp vấn đề:
1. Kiểm tra logs
2. Verify Cloudinary configuration
3. Test với file nhỏ trước
4. Contact development team 