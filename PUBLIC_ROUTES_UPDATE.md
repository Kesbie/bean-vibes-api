# Public Routes Update

## Overview
Đã thêm public routes cho categories để không cần authentication khi client truy cập.

## Changes Made

### 1. Category Routes (`src/routes/v1/category.route.js`)
- Thêm public routes cho categories:
  - `GET /categories/public` - Lấy tất cả categories (không cần auth)
  - `GET /categories/public/:categoryId` - Lấy chi tiết category (không cần auth)

### 2. Frontend Services
- Cập nhật `bean-vibes-fe/src/services/categories/index.ts`:
  - Thêm `getPublicCategories()` function
- Cập nhật `bean-vibes-fe/src/services/places/index.ts`:
  - Thêm `getPublicPlaces()` function
  - Thêm `getPublicPlace()` function

### 3. Frontend Types
- Cập nhật `bean-vibes-fe/src/services/categories/types.d.ts`:
  - Thêm `getPublicCategories` type
- Cập nhật `bean-vibes-fe/src/services/places/types.d.ts`:
  - Thêm `getPublicPlaces` type
  - Thêm `getPublicPlace` type

### 4. Frontend Hooks
- Cập nhật `bean-vibes-fe/src/hooks/useHomeData.ts`:
  - Sử dụng `getPublicPlaces()` thay vì `getPlaces()`
  - Sử dụng `getPublicCategories()` thay vì `getCategories()`
- Cập nhật `bean-vibes-fe/src/hooks/useSearchData.ts`:
  - Sử dụng `getPublicPlaces()` cho search
  - Sử dụng `getPublicCategories()` cho categories

### 5. API Documentation
- Thêm Swagger documentation cho public routes:
  - `/categories/public`
  - `/categories/public/{categoryId}`

## API Endpoints

### Public Categories
```
GET /v1/categories/public
GET /v1/categories/public/:categoryId
```

### Public Places (đã có sẵn)
```
GET /v1/places/public
GET /v1/places/public/:placeId
GET /v1/places/public/search
GET /v1/places/public/trending
GET /v1/places/public/hot-weekly
GET /v1/places/public/verified
GET /v1/places/public/category/:categoryId
GET /v1/places/public/category/:categoryId/hot
```

## Benefits
1. **No Authentication Required**: Client có thể truy cập categories và places mà không cần đăng nhập
2. **Better Performance**: Giảm overhead của authentication cho public data
3. **Improved UX**: Trang Home load nhanh hơn với dữ liệu thực từ API
4. **Security**: Vẫn giữ authentication cho admin routes

## Testing
1. Start API server: `npm run dev`
2. Test public endpoints:
   ```bash
   curl http://localhost:8000/v1/categories/public
   curl http://localhost:8000/v1/places/public
   ```
3. Check Swagger docs: http://localhost:8000/v1/docs 