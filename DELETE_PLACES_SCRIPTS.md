# Delete Places Scripts Documentation

## Tổng quan

Các script này được sử dụng để xóa places và dữ liệu liên quan từ database. **⚠️ CẢNH BÁO: Các script này sẽ xóa dữ liệu vĩnh viễn!**

## Scripts có sẵn

### 1. Delete All Places Script

**File:** `scripts/deleteAllPlaces.js`

**Mô tả:** Xóa tất cả places và dữ liệu liên quan (ratings, reviews, comments, reactions, reports)

**Cách sử dụng:**
```bash
# Sử dụng npm script
npm run delete:all-places

# Hoặc chạy trực tiếp
node scripts/deleteAllPlaces.js
```

**Tính năng:**
- Xóa tất cả places
- Xóa tất cả ratings
- Xóa tất cả reviews
- Xóa tất cả comments
- Xóa tất cả reactions
- Xóa tất cả reports
- Hiển thị thống kê trước và sau khi xóa
- Yêu cầu xác nhận trước khi xóa

### 2. Advanced Delete Places Script

**File:** `scripts/deletePlacesAdvanced.js`

**Mô tả:** Script nâng cao với nhiều tùy chọn xóa và thống kê

**Cách sử dụng:**
```bash
# Sử dụng npm script
npm run delete:places-advanced -- [options]

# Hoặc chạy trực tiếp
node scripts/deletePlacesAdvanced.js [options]
```

## Các tùy chọn của Advanced Script

### 1. Hiển thị thống kê

```bash
# Hiển thị thống kê database
npm run delete:places-advanced -- --stats
```

**Output:**
```
📊 Database Statistics:
- Places: 150
- Ratings: 450
- Reviews: 200
- Comments: 300
- Reactions: 150
- Reports: 25

📋 Places by Status:
- Pending: 20
- Approved: 120
- Rejected: 10
- Verified: 80

🏷️ Top Categories:
- Category 64f8a1b2c3d4e5f6a7b8c9d0: 25 places
- Category 64f8a1b2c3d4e5f6a7b8c9d1: 20 places
```

### 2. Xóa theo tiêu chí

```bash
# Xóa places pending
npm run delete:places-advanced -- --criteria pending

# Xóa places chưa xác thực
npm run delete:places-advanced -- --criteria unverified

# Xóa places đã xác thực
npm run delete:places-advanced -- --criteria verified

# Xóa places đã approve
npm run delete:places-advanced -- --criteria approved

# Xóa places bị reject
npm run delete:places-advanced -- --criteria rejected
```

### 3. Xóa theo ID cụ thể

```bash
# Xóa places theo ID
npm run delete:places-advanced -- --ids 64f8a1b2c3d4e5f6a7b8c9d0,64f8a1b2c3d4e5f6a7b8c9d1
```

## Các tiêu chí có sẵn

| Tiêu chí | Mô tả | Filter |
|----------|-------|--------|
| `pending` | Places đang chờ duyệt | `approvalStatus: 'pending'` |
| `approved` | Places đã được duyệt | `approvalStatus: 'approved'` |
| `rejected` | Places bị từ chối | `approvalStatus: 'rejected'` |
| `unverified` | Places chưa xác thực | `isVerified: false` |
| `verified` | Places đã xác thực | `isVerified: true` |

## Quy trình xóa

Cả hai script đều tuân theo quy trình xóa an toàn:

1. **Kết nối database**
2. **Hiển thị thống kê hiện tại**
3. **Yêu cầu xác nhận từ user**
4. **Xóa dữ liệu liên quan trước** (để tránh lỗi foreign key):
   - Ratings
   - Reactions
   - Comments
   - Reports
   - Reviews
5. **Xóa places**
6. **Hiển thị thống kê sau khi xóa**
7. **Ngắt kết nối database**

## Ví dụ sử dụng

### Xóa tất cả places (testing)

```bash
npm run delete:all-places
```

Output:
```
🗑️  Starting deletion of all places...

📊 Current data counts:
- Places: 150
- Ratings: 450
- Reviews: 200
- Comments: 300
- Reactions: 150
- Reports: 25

⚠️  WARNING: This will delete ALL places and related data!
Are you sure you want to continue? (yes/no): yes

🗑️  Starting deletion process...
1. Deleting ratings...
   ✅ Deleted 450 ratings
2. Deleting reactions...
   ✅ Deleted 150 reactions
3. Deleting comments...
   ✅ Deleted 300 comments
4. Deleting reports...
   ✅ Deleted 25 reports
5. Deleting reviews...
   ✅ Deleted 200 reviews
6. Deleting places...
   ✅ Deleted 150 places

✅ Deletion completed successfully!

📊 Remaining data counts:
- Places: 0
- Ratings: 0
- Reviews: 0
- Comments: 0
- Reactions: 0
- Reports: 0

🎉 All places and related data have been deleted!
```

### Xóa places pending

```bash
npm run delete:places-advanced -- --criteria pending
```

Output:
```
🗑️  Starting deletion with criteria...
Criteria: {"approvalStatus":"pending"}

📊 Found 20 places matching criteria

📋 Sample places to be deleted:
- Coffee House 1 (pending)
- Coffee House 2 (pending)
- Coffee House 3 (pending)
- ... and 17 more

⚠️  WARNING: This will delete 20 places!
Are you sure you want to continue? (yes/no): yes

🗑️  Starting deletion process...
✅ Deleted 45 ratings
✅ Deleted 12 reactions
✅ Deleted 30 comments
✅ Deleted 5 reports
✅ Deleted 20 reviews
✅ Deleted 20 places

🎉 Deletion completed successfully!
```

### Xem thống kê

```bash
npm run delete:places-advanced -- --stats
```

## Lưu ý quan trọng

### ⚠️ Cảnh báo

1. **Dữ liệu bị xóa vĩnh viễn**: Không thể khôi phục sau khi xóa
2. **Xóa cascade**: Khi xóa place, tất cả dữ liệu liên quan cũng bị xóa
3. **Không có backup tự động**: Hãy backup dữ liệu trước khi chạy script

### 🔒 Bảo mật

1. **Xác nhận bắt buộc**: Script luôn yêu cầu xác nhận trước khi xóa
2. **Hiển thị thông tin**: Script hiển thị rõ ràng những gì sẽ bị xóa
3. **Thống kê chi tiết**: Hiển thị số lượng trước và sau khi xóa

### 🛠️ Troubleshooting

**Lỗi kết nối database:**
```bash
# Kiểm tra file .env
# Đảm bảo MONGODB_URL được set đúng
```

**Lỗi permission:**
```bash
# Đảm bảo có quyền write vào database
# Kiểm tra user database permissions
```

**Lỗi validation:**
```bash
# Kiểm tra format ID nếu sử dụng --ids
# Đảm bảo ID hợp lệ
```

## Best Practices

1. **Backup trước khi xóa**: Luôn backup database trước khi chạy script
2. **Test trên môi trường dev**: Chạy script trên môi trường development trước
3. **Kiểm tra thống kê**: Sử dụng `--stats` để xem dữ liệu trước khi xóa
4. **Xóa từng bước**: Sử dụng criteria cụ thể thay vì xóa tất cả
5. **Logging**: Ghi log lại các thao tác xóa quan trọng

## Script tùy chỉnh

Nếu cần xóa với criteria phức tạp, có thể chỉnh sửa script:

```javascript
// Trong deletePlacesAdvanced.js
const customCriteria = {
  approvalStatus: 'pending',
  isVerified: false,
  createdAt: { $lt: new Date('2024-01-01') }
};

deletePlacesWithCriteria(customCriteria);
``` 