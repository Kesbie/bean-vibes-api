# Place Routes Documentation

## Overview
Place routes được tổ chức theo 3 nhóm phân quyền rõ ràng:

1. **Public Routes** - Không cần authentication, client chỉ xem places đã approved
2. **User Routes** - Cần authentication, users chỉ xem và quản lý places họ tạo
3. **Admin Routes** - Cần quyền admin/moderator, admin xem và quản lý tất cả places

## 1. Public Routes (No Authentication Required)

### GET `/v1/places/public`
- **Mô tả**: Lấy danh sách places đã approved và active
- **Query params**: `categories`, `district`, `ward`, `sortBy`, `limit`, `page`
- **Filter tự động**: `status: 'active'`, `approvalStatus: 'approved'`

### GET `/v1/places/public/:placeId`
- **Mô tả**: Lấy chi tiết một place đã approved
- **Params**: `placeId` (MongoDB ObjectId)

### GET `/v1/places/public/search`
- **Mô tả**: Tìm kiếm places đã approved
- **Query params**: `q` (search term), `sortBy`, `limit`, `page`

### GET `/v1/places/public/trending`
- **Mô tả**: Lấy danh sách places trending
- **Query params**: `limit`, `page`, `period`

### GET `/v1/places/public/hot-weekly`
- **Mô tả**: Lấy danh sách places hot trong tuần
- **Query params**: `limit`, `page`

### GET `/v1/places/public/verified`
- **Mô tả**: Lấy danh sách places đã verified
- **Query params**: `sortBy`, `limit`, `page`

### GET `/v1/places/public/category/:categoryId`
- **Mô tả**: Lấy places theo category
- **Params**: `categoryId` (MongoDB ObjectId)
- **Query params**: `sortBy`, `limit`, `page`

### GET `/v1/places/public/category/:categoryId/hot`
- **Mô tả**: Lấy places hot theo category
- **Params**: `categoryId` (MongoDB ObjectId)
- **Query params**: `limit`, `page`, `period`

## 2. User Routes (Authentication Required)

### POST `/v1/places/user`
- **Mô tả**: Tạo place mới
- **Auth**: Required
- **Body**: Place data

### GET `/v1/places/user`
- **Mô tả**: Lấy danh sách places user có thể xem (places họ tạo + places đã approved)
- **Auth**: Required
- **Query params**: `status`, `approvalStatus`, `sortBy`, `limit`, `page`

### GET `/v1/places/user/my-places`
- **Mô tả**: Lấy danh sách places user đã tạo
- **Auth**: Required
- **Query params**: `status`, `approvalStatus`, `sortBy`, `limit`, `page`

### GET `/v1/places/user/:placeId`
- **Mô tả**: Lấy chi tiết place (places họ tạo hoặc places đã approved)
- **Auth**: Required
- **Params**: `placeId` (MongoDB ObjectId)

### PATCH `/v1/places/user/:placeId`
- **Mô tả**: Cập nhật place (chỉ places họ tạo)
- **Auth**: Required + `manageOwnPlaces` permission
- **Params**: `placeId` (MongoDB ObjectId)
- **Body**: Update data

### DELETE `/v1/places/user/:placeId`
- **Mô tả**: Xóa place (chỉ places họ tạo)
- **Auth**: Required + `manageOwnPlaces` permission
- **Params**: `placeId` (MongoDB ObjectId)

### POST `/v1/places/user/check-content`
- **Mô tả**: Kiểm tra nội dung place có vi phạm không
- **Auth**: Required
- **Body**: Place content data

## 3. Admin Routes (Admin/Moderator Only)

### GET `/v1/places/admin`
- **Mô tả**: Lấy tất cả places (admin xem tất cả)
- **Auth**: Required + `managePlaces` permission
- **Query params**: `status`, `approvalStatus`, `isVerified`, `createdBy`, `sortBy`, `limit`, `page`

### GET `/v1/places/admin/pending`
- **Mô tả**: Lấy danh sách places đang chờ duyệt
- **Auth**: Required + `approvePlaces` permission
- **Query params**: `sortBy`, `limit`, `page`
- **Filter tự động**: `approvalStatus: 'pending'`

### GET `/v1/places/admin/:placeId`
- **Mô tả**: Lấy chi tiết place (admin xem tất cả)
- **Auth**: Required + `managePlaces` permission
- **Params**: `placeId` (MongoDB ObjectId)

### PATCH `/v1/places/admin/:placeId`
- **Mô tả**: Cập nhật place (admin cập nhật bất kỳ place nào)
- **Auth**: Required + `managePlaces` permission
- **Params**: `placeId` (MongoDB ObjectId)
- **Body**: Update data

### DELETE `/v1/places/admin/:placeId`
- **Mô tả**: Xóa place (admin xóa bất kỳ place nào)
- **Auth**: Required + `managePlaces` permission
- **Params**: `placeId` (MongoDB ObjectId)

### PATCH `/v1/places/admin/:placeId/approval-status`
- **Mô tả**: Cập nhật trạng thái duyệt place
- **Auth**: Required + `approvePlaces` permission
- **Params**: `placeId` (MongoDB ObjectId)
- **Body**: `{ status: 'pending' | 'approved' | 'rejected' }`

### PATCH `/v1/places/admin/:placeId/rating`
- **Mô tả**: Cập nhật rating place
- **Auth**: Required + `managePlaces` permission
- **Params**: `placeId` (MongoDB ObjectId)
- **Body**: `{ averageRating, totalRatings }`

## Phân Quyền Chi Tiết

### Client (Không đăng nhập)
- Chỉ xem places có `status: 'active'` và `approvalStatus: 'approved'`
- Không thể tạo, sửa, xóa places

### User (Đã đăng nhập)
- Xem places họ tạo (bất kỳ trạng thái nào)
- Xem places đã approved của người khác
- Tạo places mới
- Sửa/xóa places họ tạo
- Không thể sửa/xóa places của người khác

### Admin/Moderator
- Xem tất cả places (bất kỳ trạng thái nào)
- Tạo, sửa, xóa bất kỳ place nào
- Duyệt/từ chối places
- Cập nhật rating places

## Trạng Thái Places

### Status
- `active`: Place đang hoạt động
- `inactive`: Place không hoạt động

### ApprovalStatus
- `pending`: Đang chờ duyệt
- `approved`: Đã được duyệt
- `rejected`: Bị từ chối

### IsVerified
- `true`: Place đã được xác minh
- `false`: Place chưa được xác minh

## Ví Dụ Sử Dụng

### Client tìm kiếm places
```bash
GET /v1/places/public/search?q=cà phê&limit=10&page=1
```

### User xem places họ tạo
```bash
GET /v1/places/user/my-places?status=active&limit=20&page=1
```

### Admin xem places đang chờ duyệt
```bash
GET /v1/places/admin/pending?limit=50&page=1
```

### Admin duyệt place
```bash
PATCH /v1/places/admin/507f1f77bcf86cd799439011/approval-status
Content-Type: application/json

{
  "status": "approved"
}
```