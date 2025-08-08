# Reports API với Populated Content

## Tổng quan

API Reports đã được cập nhật để trả về nội dung đầy đủ của Review hoặc Comment bị báo cáo, giúp admin/moderator có thể xem và đánh giá nội dung bị báo cáo một cách dễ dàng.

## Cấu trúc dữ liệu trả về

### Report Object với Populated Content

```json
{
  "id": "507f1f77bcf86cd799439011",
  "reportable": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Review Title",           // Chỉ có với Review
    "content": "Review content...",    // Nội dung Review/Comment
    "user": "507f1f77bcf86cd799439013", // ID của user tạo nội dung
    "reportableType": "Review"         // Loại nội dung: "Review" hoặc "Comment"
  },
  "reportableModel": "Review",         // Loại đối tượng bị báo cáo
  "user": {
    "id": "507f1f77bcf86cd799439014",
    "name": "Reporter Name",
    "email": "reporter@example.com"
  },
  "title": "Inappropriate Content",
  "reason": "This content is offensive",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Các API Endpoints

### 1. Lấy tất cả Reports
```http
GET /v1/reports
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "results": [
    {
      "id": "507f1f77bcf86cd799439011",
      "reportable": {
        "id": "507f1f77bcf86cd799439012",
        "title": "Great Restaurant!",
        "content": "This place is amazing...",
        "user": "507f1f77bcf86cd799439013",
        "reportableType": "Review"
      },
      "reportableModel": "Review",
      "user": {
        "id": "507f1f77bcf86cd799439014",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "title": "Inappropriate Content",
      "reason": "Offensive language",
      "status": "pending"
    }
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 50
}
```

### 2. Lấy Report theo ID
```http
GET /v1/reports/:reportId
Authorization: Bearer <admin_token>
```

### 3. Lấy Pending Reports
```http
GET /v1/reports/pending
Authorization: Bearer <admin_token>
```

### 4. Lấy Reports theo Status
```http
GET /v1/reports/status/:status
Authorization: Bearer <admin_token>
```

### 5. Lấy Reports theo User
```http
GET /v1/reports/user/:userId
Authorization: Bearer <admin_token>
```

### 6. Lấy Reports theo Reportable Object
```http
GET /v1/reports/reportable/:reportableModel/:reportableId
Authorization: Bearer <admin_token>
```

## Sự khác biệt giữa Review và Comment

### Review Content
```json
{
  "reportable": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Review Title",           // Có title
    "content": "Review content...",    // Có content
    "user": "507f1f77bcf86cd799439013",
    "reportableType": "Review"
  }
}
```

### Comment Content
```json
{
  "reportable": {
    "id": "507f1f77bcf86cd799439012",
    "content": "Comment content...",   // Chỉ có content, không có title
    "user": "507f1f77bcf86cd799439013",
    "reportableType": "Comment"
  }
}
```

## Cách sử dụng trong Frontend

### React/Vue Example
```javascript
// Lấy reports với populated content
const fetchReports = async () => {
  const response = await fetch('/v1/reports', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  
  data.results.forEach(report => {
    console.log('Report ID:', report.id);
    console.log('Reported Content:', report.reportable.content);
    console.log('Content Type:', report.reportable.reportableType);
    console.log('Reporter:', report.user.name);
    
    // Hiển thị nội dung bị báo cáo
    if (report.reportable.reportableType === 'Review') {
      console.log('Review Title:', report.reportable.title);
    }
  });
};
```

## Testing

### Tạo Test Data
```bash
node scripts/createTestReports.js
```

### Test API
```bash
node test-reports-populate.js
```

## Lưu ý quan trọng

1. **Quyền truy cập**: Chỉ admin/moderator có quyền `getReports` mới có thể truy cập API này
2. **Performance**: Populate được thực hiện ở database level để tối ưu performance
3. **Security**: Chỉ trả về các field cần thiết của user (name, email) để bảo vệ privacy
4. **Flexibility**: Có thể dễ dàng mở rộng để hỗ trợ các loại nội dung khác trong tương lai

## Migration Notes

Nếu bạn đang sử dụng API reports cũ, hãy lưu ý:
- Response structure đã thay đổi để bao gồm `reportable` object
- Thêm field `reportableType` để dễ dàng xác định loại nội dung
- User info được populate với name và email
