# Hot Ranking System

Hệ thống xếp hạng địa điểm theo độ hot dựa trên lượt xem, đánh giá và thời gian gần đây.

## Tổng quan

Hệ thống tự động track lượt xem địa điểm và tính toán hot score để sắp xếp các địa điểm theo độ phổ biến.

## Cách tính Hot Score

Hot score được tính dựa trên 2 yếu tố:

### 1. View Score (50%)
- Dựa trên tổng lượt xem
- Sử dụng logarit để tránh domination bởi số lượt xem cao
- Công thức: `Math.log10(viewCount + 1) * 10`

### 2. Rating Score (50%)
- Dựa trên điểm đánh giá trung bình và số lượng đánh giá
- Công thức: `averageRating * Math.min(totalRatings / 10, 1) * 20`

## API Endpoints

### 1. Lấy địa điểm trending
```http
GET /v1/places/trending?limit=10&page=1&period=all
```

**Query Parameters:**
- `limit`: Số lượng địa điểm trả về (default: 10, max: 100)
- `page`: Trang hiện tại (default: 1)
- `period`: 'all' (tất cả thời gian) hoặc 'weekly' (7 ngày gần đây)

**Response:**
```json
{
  "results": [
    {
      "id": "place_id",
      "name": "Quán cà phê ABC",
      "viewCount": 150,
      "hotScore": 85.5,
      "weeklyHotScore": 45.2,
      "averageRating": 4.5,
      "totalRatings": 25,
      "categories": [...]
    }
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 50
}
```

### 2. Lấy địa điểm hot theo danh mục
```http
GET /v1/places/category/{categoryId}/hot?limit=10&page=1&period=weekly
```

### 3. Xem chi tiết địa điểm (tự động track view)
```http
GET /v1/places/{placeId}
```
- Tự động tăng lượt xem và cập nhật hot score
- Không cần authentication để track view

## Cấu trúc Database

### Place Schema (thêm các trường mới)
```javascript
{
  // ... existing fields ...
  
  // Hot ranking system
  viewCount: Number,        // Tổng lượt xem
  hotScore: Number,         // Hot score tổng thể
  
  // Trending data (7 ngày gần đây)
  weeklyViews: Number,      // Lượt xem trong tuần
  weeklyHotScore: Number,   // Hot score trong tuần
}
```

## Scripts

### 1. Cập nhật hot scores cho tất cả địa điểm
```bash
npm run update:hot-scores
```

### 2. Reset weekly stats (chạy hàng tuần)
```bash
npm run reset:weekly-stats
```

## Cron Jobs (Recommended)

### 1. Reset weekly stats hàng tuần
```bash
# Chạy vào 00:00 mỗi Chủ nhật
0 0 * * 0 npm run reset:weekly-stats
```

### 2. Cập nhật hot scores hàng ngày
```bash
# Chạy vào 02:00 mỗi ngày
0 2 * * * npm run update:hot-scores
```

## Cách sử dụng trong code

### 1. Track view khi user xem địa điểm
```javascript
const { viewTrackingService } = require('../services');

// Tự động được gọi khi getPlaceById
const place = await placeService.getPlaceById(placeId, userId);
```

### 2. Lấy địa điểm trending
```javascript
const { placeService } = require('../services');

// Lấy top 10 địa điểm hot nhất
const trendingPlaces = await placeService.getTrendingPlaces({
  limit: 10,
  period: 'all'
});

// Lấy địa điểm hot trong tuần
const weeklyTrending = await placeService.getTrendingPlaces({
  limit: 10,
  period: 'weekly'
});
```

### 3. Lấy địa điểm hot theo danh mục
```javascript
const hotPlacesInCategory = await placeService.getHotPlacesByCategory(
  categoryId,
  { limit: 10, period: 'all' }
);
```

## Ví dụ sử dụng

### Frontend Integration
```javascript
// Lấy địa điểm trending cho homepage
const getTrendingPlaces = async () => {
  const response = await fetch('/v1/places/trending?limit=6&period=weekly');
  const data = await response.json();
  return data.results;
};

// Lấy địa điểm hot theo danh mục
const getHotPlacesByCategory = async (categoryId) => {
  const response = await fetch(`/v1/places/category/${categoryId}/hot?limit=10`);
  const data = await response.json();
  return data.results;
};
```

### Backend Integration
```javascript
// Trong controller
const getHomePageData = async (req, res) => {
  const [trendingPlaces, recentPlaces] = await Promise.all([
    placeService.getTrendingPlaces({ limit: 6, period: 'weekly' }),
    placeService.getTrendingPlaces({ limit: 6, period: 'all' })
  ]);
  
  res.json({
    trending: trendingPlaces.results,
    recent: recentPlaces.results
  });
};
```

## Lưu ý

1. **Performance**: Hot score được tính toán real-time khi có view mới
2. **Caching**: Nên cache kết quả trending để tối ưu performance
3. **Analytics**: Có thể mở rộng để track user behavior chi tiết hơn
4. **Customization**: Có thể điều chỉnh công thức tính hot score theo nhu cầu

## Monitoring

### Metrics cần theo dõi:
- Tổng lượt xem mỗi ngày
- Hot score trung bình
- Top trending places
- Performance của API endpoints

### Alerts:
- Hot score bất thường
- API response time cao
- Database performance issues 