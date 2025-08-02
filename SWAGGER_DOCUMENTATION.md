# Bean Vibes API - Swagger Documentation

## Tổng quan

Tài liệu Swagger này cung cấp đầy đủ thông tin về tất cả các endpoint của Bean Vibes API - một nền tảng khám phá và đánh giá quán cà phê.

## Cấu trúc API

### Base URL
- Development: `http://localhost:3000/v1`
- Production: `https://api.beanvibes.com/v1`

### Authentication
API sử dụng JWT Bearer token cho xác thực. Thêm header sau vào request:
```
Authorization: Bearer <your_jwt_token>
```

## Các nhóm Endpoint

### 1. Authentication (`/auth`)
- **POST** `/auth/register` - Đăng ký tài khoản mới
- **POST** `/auth/login` - Đăng nhập
- **POST** `/auth/logout` - Đăng xuất
- **POST** `/auth/refresh-tokens` - Làm mới token
- **POST** `/auth/forgot-password` - Quên mật khẩu
- **POST** `/auth/reset-password` - Đặt lại mật khẩu
- **POST** `/auth/send-verification-email` - Gửi email xác thực
- **POST** `/auth/verify-email` - Xác thực email

### 2. Users (`/users`)
- **POST** `/users` - Tạo user mới (Admin only)
- **GET** `/users` - Lấy danh sách users (Admin only)
- **GET** `/users/{id}` - Lấy thông tin user
- **PATCH** `/users/{id}` - Cập nhật user
- **DELETE** `/users/{id}` - Xóa user (Admin only)
- **GET** `/users/profile` - Lấy thông tin profile

### 3. Places (`/places`)
#### Public Endpoints (Không cần auth)
- **GET** `/places/public` - Lấy danh sách places công khai
- **GET** `/places/public/{placeId}` - Lấy chi tiết place công khai
- **GET** `/places/public/search` - Tìm kiếm places
- **GET** `/places/public/trending` - Places đang trending
- **GET** `/places/public/hot-weekly` - Places hot tuần này
- **GET** `/places/public/verified` - Places đã xác thực
- **GET** `/places/public/category/{categoryId}` - Places theo category
- **GET** `/places/public/category/{categoryId}/hot` - Places hot theo category

#### User Endpoints (Cần auth)
- **POST** `/places/user` - Tạo place mới
- **GET** `/places/user` - Lấy places của user
- **GET** `/places/user/my-places` - Lấy places của tôi
- **GET** `/places/user/{placeId}` - Lấy chi tiết place của user
- **PATCH** `/places/user/{placeId}` - Cập nhật place
- **DELETE** `/places/user/{placeId}` - Xóa place
- **POST** `/places/user/check-content` - Kiểm tra nội dung

#### Admin Endpoints (Admin only)
- **GET** `/places/admin` - Lấy tất cả places (Admin)
- **GET** `/places/admin/pending` - Places chờ duyệt
- **GET** `/places/admin/{placeId}` - Lấy chi tiết place (Admin)
- **PATCH** `/places/admin/{placeId}` - Cập nhật place (Admin)
- **DELETE** `/places/admin/{placeId}` - Xóa place (Admin)
- **PATCH** `/places/admin/{placeId}/approval-status` - Cập nhật trạng thái duyệt
- **PATCH** `/places/admin/{placeId}/rating` - Cập nhật rating (Admin)

### 4. Reviews (`/reviews`)
- **POST** `/reviews` - Tạo review mới
- **GET** `/reviews` - Lấy danh sách reviews
- **GET** `/reviews/search` - Tìm kiếm reviews
- **GET** `/reviews/anonymous` - Lấy anonymous reviews
- **GET** `/reviews/place/{placeId}` - Reviews theo place
- **GET** `/reviews/user/{userId}` - Reviews theo user
- **GET** `/reviews/{reviewId}` - Lấy chi tiết review
- **PATCH** `/reviews/{reviewId}` - Cập nhật review
- **DELETE** `/reviews/{reviewId}` - Xóa review
- **POST** `/reviews/{reviewId}/reactions` - Thêm reaction cho review
- **DELETE** `/reviews/{reviewId}/reactions` - Xóa reaction khỏi review
- **POST** `/reviews/{reviewId}/comments` - Thêm comment cho review

### 5. Comments (`/comments`)
- **POST** `/comments` - Tạo comment mới
- **GET** `/comments` - Lấy danh sách comments
- **GET** `/comments/{commentId}` - Lấy chi tiết comment
- **PATCH** `/comments/{commentId}` - Cập nhật comment
- **DELETE** `/comments/{commentId}` - Xóa comment
- **GET** `/comments/review/{reviewId}` - Comments theo review
- **GET** `/comments/user/{userId}` - Comments theo user

### 6. Ratings (`/rating`)
- **GET** `/rating/{placeId}/average` - Lấy rating trung bình
- **GET** `/rating/{placeId}/breakdown` - Lấy breakdown rating
- **PUT** `/rating/{placeId}/update-average` - Cập nhật rating trung bình
- **GET** `/rating/{placeId}/ratings` - Lấy tất cả ratings của place
- **POST** `/rating` - Tạo rating mới
- **PUT** `/rating/{ratingId}` - Cập nhật rating
- **DELETE** `/rating/{ratingId}` - Xóa rating

### 7. Categories (`/categories`)
- **POST** `/categories` - Tạo category mới (Admin only)
- **GET** `/categories` - Lấy danh sách categories
- **GET** `/categories/{categoryId}` - Lấy chi tiết category
- **PATCH** `/categories/{categoryId}` - Cập nhật category (Admin only)
- **DELETE** `/categories/{categoryId}` - Xóa category (Admin only)

### 8. Upload (`/upload`)
- **POST** `/upload` - Upload media files
- **GET** `/upload/{mediaId}` - Lấy thông tin media
- **DELETE** `/upload/{mediaId}` - Xóa media file

### 9. Reactions (`/reactions`)
- **POST** `/reactions` - Tạo reaction mới
- **GET** `/reactions` - Lấy danh sách reactions
- **POST** `/reactions/toggle` - Toggle reaction
- **GET** `/reactions/count` - Lấy số lượng reactions
- **GET** `/reactions/user/{userId}` - Reactions theo user
- **GET** `/reactions/review/{reviewId}` - Reactions theo review
- **GET** `/reactions/comment/{commentId}` - Reactions theo comment
- **GET** `/reactions/type/{type}` - Reactions theo type
- **GET** `/reactions/{reactionId}` - Lấy chi tiết reaction
- **PATCH** `/reactions/{reactionId}` - Cập nhật reaction
- **DELETE** `/reactions/{reactionId}` - Xóa reaction

### 10. Reports (`/reports`)
- **POST** `/reports` - Tạo report mới
- **GET** `/reports` - Lấy danh sách reports
- **GET** `/reports/{reportId}` - Lấy chi tiết report
- **PATCH** `/reports/{reportId}` - Cập nhật report
- **DELETE** `/reports/{reportId}` - Xóa report

### 11. Address (`/address`)
- **GET** `/address` - Lấy thông tin địa chỉ
- **GET** `/address/districts` - Lấy danh sách districts
- **GET** `/address/wards` - Lấy danh sách wards

### 12. Moderator Requests (`/moderator-requests`)
- **POST** `/moderator-requests` - Tạo request moderator
- **GET** `/moderator-requests` - Lấy danh sách requests
- **GET** `/moderator-requests/{requestId}` - Lấy chi tiết request
- **PATCH** `/moderator-requests/{requestId}` - Cập nhật request
- **DELETE** `/moderator-requests/{requestId}` - Xóa request

### 13. Restricted Words (`/restricted-words`)
- **POST** `/restricted-words` - Tạo restricted word mới (Admin only)
- **GET** `/restricted-words` - Lấy danh sách restricted words
- **GET** `/restricted-words/{wordId}` - Lấy chi tiết restricted word
- **PATCH** `/restricted-words/{wordId}` - Cập nhật restricted word (Admin only)
- **DELETE** `/restricted-words/{wordId}` - Xóa restricted word (Admin only)

## Cách sử dụng Swagger UI

### 1. Truy cập Swagger UI
- Development: `http://localhost:3000/v1/docs`
- Production: `https://api.beanvibes.com/v1/docs`

### 2. Authentication
1. Đăng nhập vào hệ thống để lấy JWT token
2. Click vào nút "Authorize" ở góc trên bên phải
3. Nhập token theo format: `Bearer <your_jwt_token>`
4. Click "Authorize"

### 3. Test API
1. Chọn endpoint muốn test
2. Click "Try it out"
3. Điền các tham số cần thiết
4. Click "Execute"

## Response Codes

- **200** - OK: Request thành công
- **201** - Created: Tạo mới thành công
- **204** - No Content: Xóa thành công
- **400** - Bad Request: Dữ liệu không hợp lệ
- **401** - Unauthorized: Chưa xác thực
- **403** - Forbidden: Không có quyền truy cập
- **404** - Not Found: Không tìm thấy resource
- **413** - Payload Too Large: File quá lớn
- **500** - Internal Server Error: Lỗi server

## Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "user|admin|moderator",
  "isEmailVerified": "boolean",
  "avatar": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Place
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "address": "string",
  "latitude": "number",
  "longitude": "number",
  "phone": "string",
  "website": "string",
  "openingHours": "object",
  "categoryId": "string",
  "category": "Category",
  "rating": "number",
  "totalReviews": "number",
  "totalRatings": "number",
  "isVerified": "boolean",
  "isApproved": "boolean",
  "status": "active|inactive|pending",
  "createdBy": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Review
```json
{
  "id": "string",
  "content": "string",
  "rating": "number (1-5)",
  "placeId": "string",
  "place": "Place",
  "userId": "string",
  "user": "User",
  "isAnonymous": "boolean",
  "totalReactions": "number",
  "totalComments": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Category
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "type": "coffee_shop|restaurant|cafe|bar",
  "icon": "string",
  "color": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Pagination

Hầu hết các endpoint GET đều hỗ trợ pagination với các tham số:
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng item mỗi trang (mặc định: 10)

Response format:
```json
{
  "results": [...],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 50
}
```

## Filtering & Sorting

Nhiều endpoint hỗ trợ filtering và sorting:

### Filtering
- `name`: Lọc theo tên
- `type`: Lọc theo loại
- `status`: Lọc theo trạng thái
- `rating`: Lọc theo rating
- `categoryId`: Lọc theo category

### Sorting
- `sortBy`: Sắp xếp theo field (format: `field:asc|desc`)
- Ví dụ: `createdAt:desc`, `rating:asc`, `name:asc`

## Error Handling

Tất cả lỗi đều trả về format:
```json
{
  "code": 400,
  "message": "Error description"
}
```

## Rate Limiting

API có giới hạn request rate để tránh spam:
- 100 requests per minute cho authenticated users
- 20 requests per minute cho anonymous users

## File Upload

### Supported Formats
- Images: JPG, JPEG, PNG, GIF, WebP
- Videos: MP4, AVI, MOV, WMV
- Documents: PDF, DOC, DOCX

### File Size Limits
- Images: Tối đa 5MB
- Videos: Tối đa 50MB
- Documents: Tối đa 10MB

### Upload Endpoint
```
POST /upload
Content-Type: multipart/form-data

files: [binary files]
```

## Content Filtering

API có hệ thống lọc nội dung tự động:
- Kiểm tra từ cấm trong reviews, comments
- Thay thế từ cấm bằng `***`
- Log các vi phạm cho admin review

## Security Features

1. **JWT Authentication**: Token-based authentication
2. **Role-based Access Control**: User, Admin, Moderator roles
3. **Input Validation**: Tất cả input đều được validate
4. **Content Filtering**: Tự động lọc nội dung không phù hợp
5. **Rate Limiting**: Giới hạn số request
6. **CORS**: Cross-origin resource sharing
7. **Helmet**: Security headers

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access Swagger UI
http://localhost:3000/v1/docs
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Support

Nếu có vấn đề với API, vui lòng:
1. Kiểm tra documentation này
2. Xem error logs
3. Liên hệ support team: support@beanvibes.com

## Version History

- **v1.0.0**: Initial release với đầy đủ CRUD operations
- **v1.1.0**: Thêm content filtering và moderation
- **v1.2.0**: Thêm reactions và improved search
- **v1.3.0**: Thêm file upload và media management 