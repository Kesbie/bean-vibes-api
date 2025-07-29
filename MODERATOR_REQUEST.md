# Moderator Request System

Hệ thống quản lý yêu cầu trở thành kiểm duyệt viên cho người dùng.

## Tổng quan

Hệ thống cho phép người dùng gửi yêu cầu trở thành kiểm duyệt viên, bao gồm thông tin về lý do, kinh nghiệm và động lực. Admin/Moderator có thể review và approve/reject các yêu cầu này.

## Cấu trúc Database

### ModeratorRequest Schema
```javascript
{
  user: ObjectId,                    // User gửi yêu cầu
  reason: String,                    // Lý do muốn trở thành moderator (required)
  status: String,                    // 'pending', 'approved', 'rejected'
  rejectionReason: String,           // Lý do từ chối (nếu bị reject)
  reviewedBy: ObjectId,              // User review yêu cầu
  reviewedAt: Date,                  // Thời gian review
  timestamps: true
}
```

## API Endpoints

### User Endpoints (Yêu cầu authentication)

#### 1. Gửi yêu cầu trở thành moderator
```http
POST /v1/moderator-requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Tôi muốn góp phần xây dựng cộng đồng tốt hơn"
}
```

**Response:**
```json
{
  "id": "request_id",
  "user": "user_id",
  "reason": "Tôi muốn góp phần xây dựng cộng đồng tốt hơn",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Xem yêu cầu của mình
```http
GET /v1/moderator-requests/my-request
Authorization: Bearer {token}
```

#### 3. Kiểm tra có thể gửi yêu cầu không
```http
GET /v1/moderator-requests/can-submit
Authorization: Bearer {token}
```

**Response:**
```json
{
  "canSubmit": true,
  "reason": null
}
```

### Admin/Moderator Endpoints (Yêu cầu quyền manageModeratorRequests)

#### 1. Lấy danh sách tất cả yêu cầu
```http
GET /v1/moderator-requests?status=pending&limit=10&page=1
Authorization: Bearer {token}
```

#### 2. Lấy yêu cầu pending
```http
GET /v1/moderator-requests/pending?limit=10&page=1
Authorization: Bearer {token}
```

#### 3. Lấy yêu cầu theo status
```http
GET /v1/moderator-requests/status/pending?limit=10&page=1
Authorization: Bearer {token}
```

#### 4. Xem chi tiết yêu cầu
```http
GET /v1/moderator-requests/{requestId}
Authorization: Bearer {token}
```

#### 5. Review yêu cầu (Approve/Reject)
```http
PATCH /v1/moderator-requests/{requestId}/review
Authorization: Bearer {token}
Content-Type: application/json

// Approve
{
  "status": "approved"
}

// Reject
{
  "status": "rejected",
  "rejectionReason": "Chưa đủ kinh nghiệm, vui lòng thử lại sau"
}
```

#### 6. Cập nhật yêu cầu
```http
PATCH /v1/moderator-requests/{requestId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Lý do cập nhật"
}
```

#### 7. Xóa yêu cầu
```http
DELETE /v1/moderator-requests/{requestId}
Authorization: Bearer {token}
```

## Business Logic

### 1. Validation Rules
- User chỉ có thể có 1 yêu cầu pending tại một thời điểm
- User đã là moderator không thể gửi yêu cầu mới
- Khi reject yêu cầu, phải có lý do từ chối
- Yêu cầu đã được review không thể review lại

### 2. Auto Role Update
- Khi approve yêu cầu, user sẽ tự động được cập nhật role thành 'moderator'
- User có role 'moderator' sẽ có quyền review các yêu cầu khác

### 3. Status Flow
```
pending → approved (by admin/moderator)
pending → rejected (by admin/moderator)
```

## Cách sử dụng

### 1. User gửi yêu cầu
```javascript
const submitRequest = async () => {
  const response = await fetch('/v1/moderator-requests', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reason: 'Lý do muốn trở thành moderator'
    })
  });
  
  const result = await response.json();
  return result;
};
```

### 2. Admin review yêu cầu
```javascript
const reviewRequest = async (requestId, status, rejectionReason = null) => {
  const body = { status };
  if (status === 'rejected' && rejectionReason) {
    body.rejectionReason = rejectionReason;
  }
  
  const response = await fetch(`/v1/moderator-requests/${requestId}/review`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const result = await response.json();
  return result;
};
```

### 3. Kiểm tra trạng thái yêu cầu
```javascript
const checkMyRequest = async () => {
  const response = await fetch('/v1/moderator-requests/my-request', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  return result;
};
```

## Roles và Permissions

### User Role
- Gửi yêu cầu trở thành moderator
- Xem yêu cầu của mình
- Kiểm tra có thể gửi yêu cầu không

### Moderator Role
- Tất cả quyền của User
- Review yêu cầu moderator (approve/reject)
- Xem danh sách yêu cầu
- Quản lý yêu cầu

### Admin/SuperAdmin Role
- Tất cả quyền của Moderator
- Quản lý users
- Quản lý hệ thống

## Error Handling

### Common Errors
```json
{
  "code": 400,
  "message": "You already have a pending moderator request"
}
```

```json
{
  "code": 400,
  "message": "You are already a moderator"
}
```

```json
{
  "code": 400,
  "message": "Rejection reason is required when rejecting a request"
}
```

```json
{
  "code": 400,
  "message": "This request has already been reviewed"
}
```

## Monitoring và Analytics

### Metrics cần theo dõi:
- Số lượng yêu cầu mới mỗi ngày
- Tỷ lệ approve/reject
- Thời gian trung bình để review
- Số lượng moderator active

### Alerts:
- Yêu cầu pending quá lâu (>7 ngày)
- Tỷ lệ reject cao bất thường
- Số lượng yêu cầu tăng đột biến 