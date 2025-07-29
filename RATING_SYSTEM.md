# Hệ thống Đánh giá và Điểm Trung bình

## Tổng quan

Hệ thống đánh giá đã được cập nhật để tự động tính toán và lưu trữ điểm đánh giá trung bình cho mỗi place. Điểm trung bình được tính từ các đánh giá của người dùng về các tiêu chí khác nhau.

## Các trường mới trong Place Model

- `averageRating`: Điểm đánh giá trung bình (0-5, làm tròn 1 chữ số thập phân)
- `totalRatings`: Tổng số lượng đánh giá

## Các tiêu chí đánh giá

Mỗi rating bao gồm các tiêu chí sau:
- `drinkQuality`: Chất lượng đồ uống (0-5)
- `location`: Vị trí (0-5)
- `price`: Giá cả (0-5)
- `service`: Dịch vụ (0-5)
- `staffAttitude`: Thái độ nhân viên (0-5, tùy chọn)

## API Endpoints

### 1. Lấy điểm đánh giá trung bình
```
GET /v1/rating/:placeId/average
```

### 2. Lấy chi tiết đánh giá
```
GET /v1/rating/:placeId/breakdown
```

### 3. Cập nhật điểm đánh giá trung bình
```
PUT /v1/rating/:placeId/update-average
```

### 4. Lấy danh sách đánh giá của place
```
GET /v1/rating/:placeId/ratings
```

### 5. Tạo đánh giá mới
```
POST /v1/rating
Body: {
  "place": "placeId",
  "user": "userId",
  "drinkQuality": 4,
  "location": 5,
  "price": {
    "min": 25000,
    "max": 60000
  },
  "service": 4,
  "staffAttitude": 5
}
```

### 6. Cập nhật đánh giá
```
PUT /v1/rating/:ratingId
Body: {
  "drinkQuality": 5,
  "location": 4
}
```

### 7. Xóa đánh giá
```
DELETE /v1/rating/:ratingId
```

## Tính năng tự động

- Khi tạo đánh giá mới, điểm trung bình sẽ tự động được cập nhật
- Khi cập nhật đánh giá, điểm trung bình sẽ tự động được tính lại
- Khi xóa đánh giá, điểm trung bình sẽ tự động được cập nhật

## Cách tính điểm trung bình

Điểm trung bình được tính bằng cách:
1. Lấy tất cả các rating của place
2. Tính tổng điểm của tất cả các tiêu chí (drinkQuality, location, price, service, staffAttitude nếu có)
3. Chia cho tổng số tiêu chí đã được đánh giá
4. Làm tròn đến 1 chữ số thập phân

## Script cập nhật hàng loạt

Để cập nhật điểm đánh giá trung bình cho tất cả các place hiện có:

```bash
node src/scripts/updateAllPlaceRatings.js
```

## Ví dụ Response

### Lấy điểm đánh giá trung bình
```json
{
  "code": 200,
  "message": "Lấy điểm đánh giá trung bình thành công",
  "data": {
    "averageRating": 4.2,
    "totalRatings": 15
  }
}
```

### Lấy chi tiết đánh giá
```json
{
  "code": 200,
  "message": "Lấy chi tiết đánh giá thành công",
  "data": {
    "drinkQuality": {
      "average": 4.3,
      "count": 15
    },
    "location": {
      "average": 4.1,
      "count": 15
    },
    "price": {
      "average": 3.8,
      "count": 15
    },
    "service": {
      "average": 4.5,
      "count": 15
    },
    "staffAttitude": {
      "average": 4.0,
      "count": 12
    },
    "totalRatings": 15
  }
}
``` 