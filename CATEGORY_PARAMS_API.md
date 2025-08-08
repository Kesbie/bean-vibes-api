# Places Filtering API Documentation

## Overview

API này hỗ trợ nhiều cách lọc places theo categories và names một cách linh hoạt và user-friendly.

## Supported Filtering Options

### 1. Name Filtering
```
GET /v1/places?name=house
GET /v1/places?name=coffee
GET /v1/places?name=cafe
```
**Mô tả**: Tìm kiếm places theo tên sử dụng case-insensitive regex search
**Kết quả**: Trả về tất cả places có tên chứa từ khóa tìm kiếm

### 2. Category Filtering

#### Single Category Slug
```
GET /v1/places?category=tay-ho
```
**Mô tả**: Lọc places theo một category duy nhất
**Kết quả**: Trả về tất cả places thuộc category "tay-ho"

#### Comma-Separated Categories
```
GET /v1/places?category=tay-ho,cau-giay
```
**Mô tả**: Lọc places theo nhiều categories, phân cách bằng dấu phẩy
**Kết quả**: Trả về tất cả places thuộc category "tay-ho" HOẶC "cau-giay"

#### Multiple Category Parameters
```
GET /v1/places?category=tay-ho&category=cau-giay
```
**Mô tả**: Sử dụng nhiều parameter `category` riêng biệt
**Kết quả**: Trả về tất cả places thuộc category "tay-ho" HOẶC "cau-giay"

#### Mixed Format with Spaces
```
GET /v1/places?category=tay-ho, cau-giay , ba-dinh
```
**Mô tả**: Hỗ trợ spaces và whitespace, tự động trim
**Kết quả**: Trả về tất cả places thuộc categories "tay-ho", "cau-giay", hoặc "ba-dinh"

### 3. Combined Filtering

#### Name + Category
```
GET /v1/places?name=cafe&category=tay-ho
```
**Mô tả**: Kết hợp name filter với category filter
**Kết quả**: Trả về places có tên chứa "cafe" VÀ thuộc category "tay-ho"

#### Name + Multiple Categories
```
GET /v1/places?name=cafe&category=tay-ho,cau-giay
```
**Mô tả**: Kết hợp name filter với multiple categories
**Kết quả**: Trả về places có tên chứa "cafe" VÀ thuộc category "tay-ho" HOẶC "cau-giay"

#### With Additional Filters
```
GET /v1/places?name=cafe&category=tay-ho,cau-giay&limit=2&sortBy=name:asc
```
**Mô tả**: Kết hợp name và category filters với pagination và sorting
**Kết quả**: Trả về tối đa 2 places, sắp xếp theo tên

### 4. Empty and Invalid Filters
```
GET /v1/places?name=,tay-ho,,invalid-slug,
```
**Mô tả**: Tự động loại bỏ empty strings và invalid slugs
**Kết quả**: Chỉ lọc theo category hợp lệ "tay-ho"

## API Endpoint

### Get Places with Category Filtering
```
GET /v1/places
```

**Query Parameters:**
- `name` (string, optional): Filter by place name - case-insensitive regex search
- `category` (string|array, optional): Category slug(s) - hỗ trợ nhiều format
- `limit` (number, optional): Maximum number of results per page (default: 10)
- `page` (number, optional): Page number (default: 1)
- `sortBy` (string, optional): Sort option

**Response:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "results": [
      {
        "id": "place_id",
        "name": "Place Name",
        "description": "Place description",
        "categories": [
          {
            "id": "category_id",
            "name": "Category Name",
            "slug": "category-slug"
          }
        ],
        "approvalStatus": "approved",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "ratingDetails": {...}
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalResults": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Usage Examples

### JavaScript/Fetch
```javascript
const getPlacesByFilters = async (filters = {}, options = {}) => {
  const params = new URLSearchParams(options);
  
  // Handle name filter
  if (filters.name) {
    params.append('name', filters.name);
  }
  
  // Handle category filter
  if (filters.category) {
    if (Array.isArray(filters.category)) {
      // Multiple categories - use comma-separated format
      params.append('category', filters.category.join(','));
    } else {
      // Single category
      params.append('category', filters.category);
    }
  }
  
  const response = await fetch(`/v1/places?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Usage examples
try {
  // Name filter only
  const coffeePlaces = await getPlacesByFilters({ name: 'coffee' });
  console.log('Coffee places:', coffeePlaces);
  
  // Category filter only
  const tayHoPlaces = await getPlacesByFilters({ category: 'tay-ho' });
  console.log('Tay Ho places:', tayHoPlaces);
  
  // Multiple categories
  const multiCategoryPlaces = await getPlacesByFilters({ category: ['tay-ho', 'cau-giay'] });
  console.log('Multi-category places:', multiCategoryPlaces);
  
  // Combined name and category
  const cafeInTayHo = await getPlacesByFilters({ 
    name: 'cafe', 
    category: 'tay-ho' 
  });
  console.log('Cafe in Tay Ho:', cafeInTayHo);
  
  // With additional options
  const limitedPlaces = await getPlacesByFilters(
    { name: 'cafe', category: ['tay-ho', 'cau-giay'] },
    { limit: 5, page: 1, sortBy: 'name:asc' }
  );
  console.log('Limited places:', limitedPlaces);
} catch (error) {
  console.error('Error getting places:', error);
}
```

### Axios
```javascript
import axios from 'axios';

const getPlacesByCategories = async (categorySlugs, options = {}) => {
  try {
    const params = { ...options };
    
    // Handle single slug or array of slugs
    if (categorySlugs) {
      if (Array.isArray(categorySlugs)) {
        // Multiple categories - use comma-separated format
        params.category = categorySlugs.join(',');
      } else {
        // Single category
        params.category = categorySlugs;
      }
    }
    
    const response = await axios.get('/v1/places', {
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting places:', error.response.data);
    throw error;
  }
};
```

### cURL Examples
```bash
# Name filter only
curl -X GET "http://localhost:3001/v1/places?name=coffee" \
  -H "Content-Type: application/json"

# Category filter only
curl -X GET "http://localhost:3001/v1/places?category=tay-ho" \
  -H "Content-Type: application/json"

# Multiple categories (comma-separated)
curl -X GET "http://localhost:3001/v1/places?category=tay-ho,cau-giay" \
  -H "Content-Type: application/json"

# Multiple categories (separate parameters)
curl -X GET "http://localhost:3001/v1/places?category=tay-ho&category=cau-giay" \
  -H "Content-Type: application/json"

# Combined name and category
curl -X GET "http://localhost:3001/v1/places?name=cafe&category=tay-ho" \
  -H "Content-Type: application/json"

# Combined name and multiple categories
curl -X GET "http://localhost:3001/v1/places?name=cafe&category=tay-ho,cau-giay" \
  -H "Content-Type: application/json"

# With spaces and additional filters
curl -X GET "http://localhost:3001/v1/places?name=cafe&category=tay-ho%2C%20cau-giay&limit=5&sortBy=name:asc" \
  -H "Content-Type: application/json"
```

## Business Logic

### Name Processing
1. **Case Insensitive**: Tìm kiếm không phân biệt hoa thường
2. **Regex Search**: Sử dụng MongoDB regex để tìm kiếm partial matches
3. **Partial Matching**: Tìm kiếm places có tên chứa từ khóa

### Category Processing
1. **Input Parsing**: Hỗ trợ cả string và array input
2. **Whitespace Handling**: Tự động trim spaces và whitespace
3. **Duplicate Removal**: Loại bỏ duplicate categories
4. **Empty Filtering**: Loại bỏ empty strings và invalid slugs
5. **Slug Validation**: Chỉ lọc theo categories hợp lệ

### Filtering Logic
- **AND Logic**: Name và category filters được kết hợp với AND logic
- **OR Logic**: Multiple categories sử dụng OR logic
- **Case Insensitive**: Cả name và slug matching đều case-insensitive
- **Error Handling**: Non-existent slugs được ignore (không throw error)
- **Fallback**: Nếu không có filter, trả về tất cả approved places

### Performance Considerations
- **Index Usage**: Sử dụng indexes trên category ObjectIds
- **Efficient Lookup**: Sử dụng MongoDB's `$in` operator cho optimal performance
- **Caching**: Category slug to ID mapping có thể được cache

## Error Handling

### Invalid Categories
- Non-existent slugs được ignore
- Không throw error cho invalid slugs
- Trả về empty results nếu không có valid categories match

### Malformed Queries
- Empty category parameter được ignore
- Malformed comma-separated lists được handle gracefully
- Whitespace được tự động trim

## Testing

Run the test scripts để verify functionality:
```bash
# Test category filtering
node test-category-formats-simple.js

# Test name filtering
node test-name-filtering.js
```

Test scripts sẽ kiểm tra:

**Category Filtering:**
1. Single category filtering
2. Multiple categories (comma-separated)
3. Multiple categories (separate parameters)
4. Mixed format with spaces
5. Combined with other filters
6. Empty and invalid categories
7. No category filter

**Name Filtering:**
1. Single word search ("house", "coffee", "cafe")
2. Partial word search ("space", "mobius", "laika")
3. Non-existent name search
4. Case insensitive search
5. Combined name and category filters
6. Combined name and multiple categories

## Migration Notes

### Backward Compatibility
- Existing category ID filtering tiếp tục hoạt động
- New slug-based filtering là additive, không replace
- Cả hai methods có thể coexist

### Performance Impact
- Minimal performance impact cho slug-based filtering
- Category slug to ID lookup được optimize
- Indexes trên category fields đảm bảo fast queries

## Security Considerations

1. **Input Validation**: Slugs được validate against existing categories
2. **SQL Injection Prevention**: Sử dụng parameterized queries
3. **Rate Limiting**: Standard rate limiting applies
4. **Data Privacy**: Chỉ trả về approved places cho non-admin users
