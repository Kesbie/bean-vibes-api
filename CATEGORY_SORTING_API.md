# Category Sorting API Documentation

## Overview

API categories đã được cập nhật để ưu tiên hiển thị các quận/categories có nhiều places lên đầu theo mặc định, đồng thời hỗ trợ nhiều tùy chọn sorting linh hoạt.

## Default Sorting Behavior

### Mặc định: Place Count Descending
Khi không có `sortBy` parameter, categories sẽ được sắp xếp theo:
1. **placeCount giảm dần** (nhiều places trước)
2. **name tăng dần** (alphabetical order) làm tie-breaker

```javascript
// Default sorting logic
{ $sort: { placeCount: -1, name: 1 } }
```

## API Endpoint

### Get Categories with Sorting
```
GET /v1/categories
```

**Query Parameters:**
- `sortBy` (string, optional): Field to sort by
  - `placeCount` - Sort by number of places
  - `name` - Sort by category name
  - `type` - Sort by category type
  - `createdAt` - Sort by creation date
  - `updatedAt` - Sort by update date
- `sortOrder` (string, optional): Sort order
  - `desc` - Descending order (default)
  - `asc` - Ascending order
- `type` (string, optional): Filter by category type
- `name` (string, optional): Filter by category name
- `limit` (number, optional): Maximum number of results per page (default: 10)
- `page` (number, optional): Page number (default: 1)

## Usage Examples

### 1. Default Sorting (Most Places First)
```bash
curl -X GET "http://localhost:3001/v1/categories" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "results": [
      {
        "id": "category_id_1",
        "name": "Quận Tây Hồ",
        "slug": "tay-ho",
        "placeCount": 5,  // Most places first
        "type": "region"
      },
      {
        "id": "category_id_2",
        "name": "Quận Cầu Giấy",
        "slug": "cau-giay",
        "placeCount": 3,
        "type": "region"
      },
      {
        "id": "category_id_3",
        "name": "Quận Ba Đình",
        "slug": "ba-dinh",
        "placeCount": 2,
        "type": "region"
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 6,
    "totalResults": 60
  }
}
```

### 2. Explicit Place Count Sorting
```bash
# Most places first
curl -X GET "http://localhost:3001/v1/categories?sortBy=placeCount&sortOrder=desc" \
  -H "Content-Type: application/json"

# Least places first
curl -X GET "http://localhost:3001/v1/categories?sortBy=placeCount&sortOrder=asc" \
  -H "Content-Type: application/json"
```

### 3. Name Sorting
```bash
# Alphabetical order (A-Z)
curl -X GET "http://localhost:3001/v1/categories?sortBy=name&sortOrder=asc" \
  -H "Content-Type: application/json"

# Reverse alphabetical order (Z-A)
curl -X GET "http://localhost:3001/v1/categories?sortBy=name&sortOrder=desc" \
  -H "Content-Type: application/json"
```

### 4. Type Filtering with Default Sorting
```bash
# Region categories, sorted by place count
curl -X GET "http://localhost:3001/v1/categories?type=region" \
  -H "Content-Type: application/json"

# Service categories, sorted by place count
curl -X GET "http://localhost:3001/v1/categories?type=service" \
  -H "Content-Type: application/json"
```

### 5. Pagination with Sorting
```bash
# First page, top 5 categories by place count
curl -X GET "http://localhost:3001/v1/categories?limit=5&page=1" \
  -H "Content-Type: application/json"

# Second page, top 5 categories by place count
curl -X GET "http://localhost:3001/v1/categories?limit=5&page=2" \
  -H "Content-Type: application/json"
```

## JavaScript/Fetch Examples

### Default Sorting
```javascript
const getCategories = async (options = {}) => {
  const params = new URLSearchParams(options);
  
  const response = await fetch(`/v1/categories?${params}`, {
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

// Default sorting (most places first)
const categories = await getCategories();
console.log('Categories sorted by place count:', categories);
```

### Custom Sorting
```javascript
// Sort by place count descending
const mostPlaces = await getCategories({
  sortBy: 'placeCount',
  sortOrder: 'desc',
  limit: 10
});

// Sort by name ascending
const alphabetical = await getCategories({
  sortBy: 'name',
  sortOrder: 'asc'
});

// Filter by type with default sorting
const regions = await getCategories({
  type: 'region',
  limit: 20
});
```

### Axios Example
```javascript
import axios from 'axios';

const getCategories = async (options = {}) => {
  try {
    const response = await axios.get('/v1/categories', {
      params: options,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting categories:', error.response.data);
    throw error;
  }
};

// Usage
const topCategories = await getCategories({
  sortBy: 'placeCount',
  sortOrder: 'desc',
  limit: 5
});
```

## Business Logic

### Sorting Priority
1. **Primary Sort**: `placeCount` (descending by default)
2. **Secondary Sort**: `name` (ascending) for tie-breaking
3. **Custom Sort**: Override with `sortBy` and `sortOrder` parameters

### Place Count Calculation
- Chỉ đếm **approved places** (không bao gồm pending/rejected)
- Một place có thể thuộc nhiều categories
- Real-time calculation (không cached)

### Performance Considerations
- **Index Usage**: Sử dụng indexes trên `approvalStatus` và `categories`
- **Aggregation Pipeline**: Efficient MongoDB aggregation
- **Pagination**: Support cho large datasets

## Validation Rules

### sortBy Values
- `placeCount` - Sort by number of places
- `name` - Sort by category name
- `type` - Sort by category type
- `createdAt` - Sort by creation date
- `updatedAt` - Sort by update date

### sortOrder Values
- `desc` - Descending order (default)
- `asc` - Ascending order

### Default Values
- `sortOrder`: `desc` (when sortBy is provided)
- `limit`: `10`
- `page`: `1`

## Testing

### Test Script
```bash
# Run the test script
node test-category-sorting.js
```

### Manual Testing
```bash
# Test default sorting
curl -X GET "http://localhost:3001/v1/categories" \
  -H "Content-Type: application/json" | jq '.data.results[] | {name: .name, placeCount: .placeCount}'

# Test explicit place count sorting
curl -X GET "http://localhost:3001/v1/categories?sortBy=placeCount&sortOrder=desc" \
  -H "Content-Type: application/json" | jq '.data.results[] | {name: .name, placeCount: .placeCount}'

# Test region filtering with default sorting
curl -X GET "http://localhost:3001/v1/categories?type=region" \
  -H "Content-Type: application/json" | jq '.data.results[] | {name: .name, placeCount: .placeCount}'
```

## Migration Notes

### Backward Compatibility
- ✅ Existing API contracts unchanged
- ✅ Default behavior improved (most places first)
- ✅ Optional parameters for custom sorting

### Breaking Changes
- ❌ None - all changes are additive

### Performance Impact
- ✅ Minimal impact - uses existing aggregation pipeline
- ✅ Efficient sorting with MongoDB indexes
- ✅ Pagination support maintained

## Use Cases

### 1. Frontend Category Display
```javascript
// Show most popular categories first
const popularCategories = await getCategories({
  sortBy: 'placeCount',
  sortOrder: 'desc',
  limit: 10
});
```

### 2. Region Selection
```javascript
// Show regions with most places first
const regions = await getCategories({
  type: 'region',
  sortBy: 'placeCount',
  sortOrder: 'desc'
});
```

### 3. Admin Dashboard
```javascript
// Show categories by creation date
const recentCategories = await getCategories({
  sortBy: 'createdAt',
  sortOrder: 'desc',
  limit: 20
});
```

### 4. Search Results
```javascript
// Show categories alphabetically
const alphabeticalCategories = await getCategories({
  sortBy: 'name',
  sortOrder: 'asc'
});
```

## Future Enhancements

1. **Caching**: Implement caching for place counts to improve performance
2. **Real-time Updates**: WebSocket updates when place counts change
3. **Advanced Filtering**: Support for multiple type filters
4. **Search Integration**: Full-text search within categories
5. **Analytics**: Track most viewed/searched categories
