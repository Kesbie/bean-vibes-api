# Rating Criteria API Documentation

## Tổng quan

API này cung cấp các endpoint để lấy thông tin trung bình từng tiêu chí đánh giá riêng biệt cho các địa điểm. **Rating details được bao gồm mặc định trong tất cả các endpoint lấy thông tin place.**

## Các tiêu chí đánh giá

- **drinkQuality**: Chất lượng đồ uống (0-5)
- **location**: Vị trí (0-5)
- **price**: Giá cả (0-5)
- **service**: Dịch vụ (0-5)
- **staffAttitude**: Thái độ nhân viên (0-5) - tùy chọn

## API Endpoints

### 1. Lấy trung bình từng tiêu chí (riêng biệt)

**Endpoint:** `GET /v1/rating/:placeId/criteria-averages`

**Mô tả:** Lấy điểm trung bình của từng tiêu chí đánh giá riêng biệt

**Parameters:**
- `placeId` (string, required): ID của địa điểm

**Response:**
```json
{
  "success": true,
  "message": "Lấy điểm trung bình từng tiêu chí thành công",
  "data": {
    "drinkQuality": 4.2,
    "location": 3.8,
    "price": 4.0,
    "service": 4.5,
    "staffAttitude": 4.1,
    "totalRatings": 25
  }
}
```

### 2. Lấy chi tiết đánh giá với trung bình từng tiêu chí

**Endpoint:** `GET /v1/rating/:placeId/breakdown`

**Mô tả:** Lấy chi tiết đánh giá bao gồm trung bình từng tiêu chí và tổng quan

**Parameters:**
- `placeId` (string, required): ID của địa điểm

**Response:**
```json
{
  "success": true,
  "message": "Lấy chi tiết đánh giá thành công",
  "data": {
    "drinkQuality": {
      "average": 4.2,
      "count": 25
    },
    "location": {
      "average": 3.8,
      "count": 25
    },
    "price": {
      "average": 4.0,
      "count": 25
    },
    "service": {
      "average": 4.5,
      "count": 25
    },
    "staffAttitude": {
      "average": 4.1,
      "count": 20
    },
    "totalRatings": 25,
    "overallAverage": 4.1
  }
}
```

### 3. Lấy thông tin địa điểm (bao gồm rating details mặc định)

**Endpoint:** `GET /v1/place/:placeId/info`

**Mô tả:** Lấy thông tin địa điểm kèm theo chi tiết trung bình từng tiêu chí đánh giá (mặc định)

**Parameters:**
- `placeId` (string, required): ID của địa điểm

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Coffee House",
    "description": "A cozy coffee shop",
    "address": {
      "fullAddress": "123 Main St, Hanoi"
    },
    "averageRating": 4.1,
    "totalRatings": 25,
    "ratingDetails": {
      "drinkQuality": 4.2,
      "location": 3.8,
      "price": 4.0,
      "service": 4.5,
      "staffAttitude": 4.1,
      "totalRatings": 25
    }
  }
}
```

### 4. Danh sách địa điểm (bao gồm rating details mặc định)

**Endpoint:** `GET /v1/place`

**Mô tả:** Lấy danh sách địa điểm với rating details cho mỗi place

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "results": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Coffee House",
        "averageRating": 4.1,
        "totalRatings": 25,
        "ratingDetails": {
          "drinkQuality": 4.2,
          "location": 3.8,
          "price": 4.0,
          "service": 4.5,
          "staffAttitude": 4.1,
          "totalRatings": 25
        }
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalResults": 50
  }
}
```

## Các endpoint khác bao gồm rating details

Tất cả các endpoint sau đây đều bao gồm `ratingDetails` mặc định:

- `GET /v1/place` - Danh sách địa điểm
- `GET /v1/place/:placeId/info` - Thông tin địa điểm
- `GET /v1/place/search` - Tìm kiếm địa điểm
- `GET /v1/place/trending` - Địa điểm trending
- `GET /v1/place/hot-weekly` - Địa điểm hot tuần
- `GET /v1/place/verified` - Địa điểm đã xác thực
- `GET /v1/place/category/:categoryId` - Địa điểm theo danh mục
- `GET /v1/place/public/category/:categoryId/hot` - Địa điểm hot theo danh mục

## Cách sử dụng

### Frontend Integration

```javascript
// Lấy thông tin địa điểm (đã bao gồm rating details)
const getPlaceInfo = async (placeId) => {
  const response = await fetch(`/v1/place/${placeId}/info`);
  const data = await response.json();
  return data.data; // Đã bao gồm ratingDetails
};

// Lấy danh sách địa điểm (đã bao gồm rating details)
const getPlaces = async () => {
  const response = await fetch('/v1/place');
  const data = await response.json();
  return data.data.results; // Mỗi place đã bao gồm ratingDetails
};

// Hiển thị rating stars cho từng tiêu chí
const displayCriteriaRatings = (place) => {
  if (!place.ratingDetails) return null;
  
  return {
    drinkQuality: place.ratingDetails.drinkQuality,
    location: place.ratingDetails.location,
    price: place.ratingDetails.price,
    service: place.ratingDetails.service,
    staffAttitude: place.ratingDetails.staffAttitude
  };
};
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const PlaceCard = ({ placeId }) => {
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`/v1/place/${placeId}/info`);
        const data = await response.json();
        setPlace(data.data);
      } catch (error) {
        console.error('Error fetching place:', error);
      }
    };

    fetchPlace();
  }, [placeId]);

  if (!place) return <div>Loading...</div>;

  return (
    <div className="place-card">
      <h3>{place.name}</h3>
      <p>{place.description}</p>
      
      {/* Overall rating */}
      <div className="overall-rating">
        <span>Đánh giá chung: {place.averageRating}/5</span>
        <span>({place.totalRatings} đánh giá)</span>
      </div>
      
      {/* Individual criteria ratings */}
      {place.ratingDetails && (
        <div className="criteria-ratings">
          <h4>Chi tiết đánh giá:</h4>
          <div className="criteria">
            <span>Chất lượng đồ uống:</span>
            <span>{place.ratingDetails.drinkQuality}/5</span>
          </div>
          <div className="criteria">
            <span>Vị trí:</span>
            <span>{place.ratingDetails.location}/5</span>
          </div>
          <div className="criteria">
            <span>Giá cả:</span>
            <span>{place.ratingDetails.price}/5</span>
          </div>
          <div className="criteria">
            <span>Dịch vụ:</span>
            <span>{place.ratingDetails.service}/5</span>
          </div>
          <div className="criteria">
            <span>Thái độ nhân viên:</span>
            <span>{place.ratingDetails.staffAttitude}/5</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceCard;
```

## Lưu ý

1. **Rating details mặc định**: Tất cả endpoint lấy place đều bao gồm `ratingDetails`
2. **Tính toán trung bình**: Điểm trung bình được làm tròn đến 1 chữ số thập phân
3. **Tiêu chí tùy chọn**: `staffAttitude` có thể không có trong một số đánh giá
4. **Cập nhật tự động**: Khi có đánh giá mới, các trung bình sẽ được cập nhật tự động
5. **Performance**: Các endpoint được tối ưu để trả về kết quả nhanh chóng

## Error Handling

```json
{
  "success": false,
  "message": "Place not found",
  "error": "NOT_FOUND"
}
```

## Status Codes

- `200`: Success
- `400`: Bad Request (validation error)
- `404`: Place not found
- `500`: Internal Server Error 