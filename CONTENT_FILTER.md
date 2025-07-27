# Content Filter System

Hệ thống lọc nội dung nhạy cảm cho ứng dụng Bean Vibes API.

## Tổng quan

Hệ thống sử dụng model `RestrictedWord` để quản lý các từ khóa nhạy cảm và tự động kiểm tra nội dung khi tạo hoặc cập nhật place.

## Các loại từ nhạy cảm

### 1. BAN (Cấm)
- **Mô tả**: Từ khóa bị cấm hoàn toàn
- **Hành động**: Không cho phép tạo/cập nhật place nếu chứa từ này
- **Response**: Trả về lỗi 400 Bad Request

### 2. WARN (Cảnh báo)
- **Mô tả**: Từ khóa cần được thay thế
- **Hành động**: Tự động thay thế bằng dấu `*`
- **Ví dụ**: "đéo" → "đ**"

### 3. HIDE (Ẩn)
- **Mô tả**: Từ khóa cần được ẩn hoàn toàn
- **Hành động**: Tự động thay thế bằng dấu `*`
- **Ví dụ**: "sex" → "***"

## API Endpoints

### 1. Kiểm tra nội dung trước khi tạo place
```http
POST /v1/places/check-content
Content-Type: application/json

{
  "name": "Tên quán",
  "description": "Mô tả quán",
  "address": "Địa chỉ quán"
}
```

**Response:**
```json
{
  "hasRestrictedWords": true,
  "hasBannedWords": false,
  "foundWords": [
    {
      "word": "đéo",
      "type": "warn",
      "replacement": "đ**"
    }
  ]
}
```

### 2. Tạo place (tự động kiểm tra nội dung)
```http
POST /v1/places
Content-Type: application/json

{
  "name": "Tên quán",
  "description": "Mô tả quán",
  "address": "Địa chỉ quán"
}
```

**Nếu chứa từ BAN:**
```json
{
  "code": 400,
  "message": "Content contains banned words: địt, đụ"
}
```

**Nếu chứa từ WARN/HIDE:**
- Tự động thay thế và tạo place thành công
- Nội dung sẽ được lưu với từ đã được thay thế

## Cách sử dụng

### 1. Thêm từ nhạy cảm vào database
```javascript
// Sử dụng RestrictedWord model
const restrictedWord = new RestrictedWord({
  word: 'từ_nhạy_cảm',
  type: 'ban', // hoặc 'warn', 'hide'
  replacement: 'từ_thay_thế' // optional
});
await restrictedWord.save();
```

### 2. Chạy script seed dữ liệu mẫu
```bash
node src/scripts/seedRestrictedWords.js
```

### 3. Kiểm tra nội dung trong code
```javascript
const { contentFilterService } = require('../services');

// Kiểm tra nội dung
const result = await contentFilterService.checkPlaceContent(placeData);

// Validate và throw error nếu có từ BAN
await contentFilterService.validatePlaceContent(placeData);

// Thay thế từ nhạy cảm
const processedContent = await contentFilterService.replaceRestrictedWords(content);
```

## Cấu trúc Database

### RestrictedWord Schema
```javascript
{
  word: String,           // Từ nhạy cảm
  normalizedWord: String, // Từ đã được normalize (tự động tạo)
  replacement: String,    // Từ thay thế (tự động tạo nếu không có)
  type: String,          // 'ban', 'warn', 'hide'
  timestamps: true
}
```

## Lưu ý

1. **Normalize text**: Hệ thống tự động normalize text (bỏ dấu, chuyển lowercase) để so sánh
2. **Case insensitive**: Tìm kiếm không phân biệt hoa thường
3. **Auto replacement**: Tự động tạo từ thay thế nếu không được cung cấp
4. **Performance**: Cache danh sách từ nhạy cảm để tối ưu hiệu suất

## Ví dụ sử dụng

### Tạo place với nội dung bình thường
```javascript
const placeData = {
  name: "Quán cà phê ABC",
  description: "Quán cà phê ngon",
  address: "123 Đường ABC"
};
// → Tạo thành công
```

### Tạo place với từ BAN
```javascript
const placeData = {
  name: "Quán địt ABC", // Chứa từ BAN
  description: "Quán cà phê ngon",
  address: "123 Đường ABC"
};
// → Lỗi 400: "Content contains banned words: địt"
```

### Tạo place với từ WARN
```javascript
const placeData = {
  name: "Quán đéo ABC", // Chứa từ WARN
  description: "Quán cà phê ngon",
  address: "123 Đường ABC"
};
// → Tạo thành công với name: "Quán đ** ABC"
``` 