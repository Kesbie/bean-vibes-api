# Address Structure for Places

Cấu trúc địa chỉ mới cho địa điểm với các trường text và tọa độ địa lý.

## Tổng quan

Thay vì chỉ lưu địa chỉ dưới dạng string đơn giản, hệ thống giờ đây lưu trữ địa chỉ với cấu trúc chi tiết bao gồm các thành phần địa chỉ và tọa độ địa lý.

## Cấu trúc Address Object

### Schema
```javascript
address: {
  street: String,           // Đường/Phố (tối đa 200 ký tự)
  ward: String,             // Phường/Xã (tối đa 100 ký tự)
  district: String,         // Quận/Huyện (tối đa 100 ký tự)
  fullAddress: String,      // Địa chỉ đầy đủ (tối đa 500 ký tự)
  coordinates: {
    latitude: Number,       // Vĩ độ (-90 đến 90)
    longitude: Number,      // Kinh độ (-180 đến 180)
  }
}
```

### Ví dụ
```javascript
{
  "address": {
    "street": "123 Nguyễn Huệ",
    "ward": "Bến Nghé",
    "district": "Quận 1",
    "fullAddress": "123 Nguyễn Huệ, Bến Nghé, Quận 1",
    "coordinates": {
      "latitude": 10.7769,
      "longitude": 106.7009
    }
  }
}
```

## API Endpoints

### 1. Tạo địa điểm với địa chỉ mới
```http
POST /v1/places
Content-Type: application/json

{
  "name": "Quán cà phê ABC",
  "description": "Quán cà phê ngon",
  "address": {
    "street": "123 Nguyễn Huệ",
    "ward": "Bến Nghé",
    "district": "Quận 1",
    "fullAddress": "123 Nguyễn Huệ, Bến Nghé, Quận 1",
    "coordinates": {
      "latitude": 10.7769,
      "longitude": 106.7009
    }
  }
}
```

### 2. Cập nhật địa chỉ
```http
PATCH /v1/places/{placeId}
Content-Type: application/json

{
  "address": {
    "street": "456 Lê Lợi",
    "ward": "Bến Thành",
    "district": "Quận 1",
    "coordinates": {
      "latitude": 10.7770,
      "longitude": 106.7010
    }
  }
}
```

## Geolocation Features

### 1. Tìm kiếm địa điểm gần đây
```http
GET /v1/places/nearby?lat=10.7769&lng=106.7009&radius=5&limit=10
```

### 2. Tìm kiếm theo quận/huyện
```http
GET /v1/places/district/Quận 1?limit=20&page=1
```

### 3. Tìm kiếm theo phường/xã
```http
GET /v1/places/ward/Bến Nghé?limit=10
```

### 4. Tìm kiếm trong vùng địa lý
```http
GET /v1/places/bounds?minLat=10.7&maxLat=10.8&minLng=106.6&maxLng=106.8
```

## Geolocation Service

### Methods

#### 1. `searchPlacesByLocation(latitude, longitude, radius, options)`
Tìm địa điểm trong bán kính nhất định từ một điểm.

```javascript
const nearbyPlaces = await geolocationService.searchPlacesByLocation(
  10.7769,  // latitude
  106.7009, // longitude
  5,        // radius in km
  { limit: 10 }
);
```

#### 2. `searchPlacesByDistrict(district, options)`
Tìm địa điểm theo quận/huyện.

```javascript
const districtPlaces = await geolocationService.searchPlacesByDistrict(
  'Quận 1',
  { limit: 20, page: 1 }
);
```

#### 3. `searchPlacesByWard(ward, options)`
Tìm địa điểm theo phường/xã.

```javascript
const wardPlaces = await geolocationService.searchPlacesByWard(
  'Bến Nghé',
  { limit: 10 }
);
```

#### 4. `getPlacesInBoundingBox(minLat, maxLat, minLng, maxLng, options)`
Tìm địa điểm trong vùng địa lý được định nghĩa.

```javascript
const boxPlaces = await geolocationService.getPlacesInBoundingBox(
  10.7,  // minLat
  10.8,  // maxLat
  106.6, // minLng
  106.8, // maxLng
  { limit: 50 }
);
```

#### 5. `calculateDistance(lat1, lng1, lat2, lng2)`
Tính khoảng cách giữa hai điểm.

```javascript
const distance = geolocationService.calculateDistance(
  10.7769, 106.7009, // Point 1
  10.7770, 106.7010  // Point 2
);
// Returns distance in kilometers
```

#### 6. `getPopularAreas(options)`
Lấy danh sách các khu vực phổ biến.

```javascript
const popularAreas = await geolocationService.getPopularAreas({
  limit: 10
});
```

#### 7. `validateCoordinates(latitude, longitude)`
Kiểm tra tính hợp lệ của tọa độ.

```javascript
const isValid = geolocationService.validateCoordinates(10.7769, 106.7009);
// Returns true if coordinates are valid
```

#### 8. `generateFullAddress(addressComponents)`
Tạo địa chỉ đầy đủ từ các thành phần.

```javascript
const fullAddress = geolocationService.generateFullAddress({
  street: '123 Nguyễn Huệ',
  ward: 'Bến Nghé',
  district: 'Quận 1'
});
// Returns: "123 Nguyễn Huệ, Bến Nghé, Quận 1"
```

## Database Indexes

### Geospatial Index
```javascript
// Index for geospatial queries
placeSchema.index({ 'address.coordinates': '2dsphere' });
```

### Text Indexes
```javascript
// Indexes for district and ward searches
placeSchema.index({ 'address.district': 1 });
placeSchema.index({ 'address.ward': 1 });
```

## Migration từ cấu trúc cũ

### Legacy Address Format
```javascript
// Cũ
{
  "address": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh"
}
```

### New Address Format
```javascript
// Mới
{
  "address": {
    "street": "123 Nguyễn Huệ",
    "ward": "Bến Nghé",
    "district": "Quận 1",
    "fullAddress": "123 Nguyễn Huệ, Bến Nghé, Quận 1",
    "coordinates": {
      "latitude": 10.7769,
      "longitude": 106.7009
    }
  }
}
```

## Validation Rules

### Required Fields
- `reason` (khi tạo place mới)

### Optional Fields
- `street`, `ward`, `district`
- `fullAddress` (có thể tự động tạo từ các thành phần)
- `coordinates` (latitude, longitude)

### Validation Constraints
- `street`: tối đa 200 ký tự
- `ward`, `district`: tối đa 100 ký tự
- `fullAddress`: tối đa 500 ký tự
- `latitude`: -90 đến 90
- `longitude`: -180 đến 180

## Content Filter Integration

Hệ thống content filter tự động kiểm tra tất cả các trường địa chỉ:
- `address.street`
- `address.ward`
- `address.district`
- `address.fullAddress`

## Lưu ý

1. **Backward Compatibility**: Hệ thống vẫn hỗ trợ địa chỉ dạng string cũ
2. **Auto Generation**: Có thể tự động tạo `fullAddress` từ các thành phần
3. **Geospatial Queries**: Sử dụng MongoDB 2dsphere index cho tìm kiếm theo vị trí
4. **Performance**: Indexes được tối ưu cho tìm kiếm theo district và ward 