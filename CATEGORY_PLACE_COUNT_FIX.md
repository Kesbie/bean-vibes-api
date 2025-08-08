# Category Place Count Fix Documentation

## Overview

Đã sửa lỗi trong category place count để chỉ đếm những places đã được duyệt (approved) thay vì đếm tất cả places.

## Problem

Trước đây, các function đếm places trong categories đang đếm tất cả places (bao gồm cả pending, approved, rejected) thay vì chỉ đếm approved places.

## Solution

Đã cập nhật tất cả các aggregation pipelines trong category service để chỉ đếm places có `approvalStatus: 'approved'`.

### Files Modified

#### `src/services/category.service.js`

**1. `queryCategories` function:**
```javascript
// Before
{
  $lookup: {
    from: 'places',
    localField: '_id',
    foreignField: 'categories',
    as: 'places'
  }
}

// After
{
  $lookup: {
    from: 'places',
    let: { categoryId: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $in: ['$$categoryId', '$categories'] },
              { $eq: ['$approvalStatus', 'approved'] }
            ]
          }
        }
      }
    ],
    as: 'places'
  }
}
```

**2. `getCategoryById` function:**
```javascript
// Same fix as queryCategories
{
  $lookup: {
    from: 'places',
    let: { categoryId: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $in: ['$$categoryId', '$categories'] },
              { $eq: ['$approvalStatus', 'approved'] }
            ]
          }
        }
      }
    ],
    as: 'places'
  }
}
```

**3. `getCategoryBySlugs` function:**
```javascript
// Same fix as above
{
  $lookup: {
    from: 'places',
    let: { categoryId: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $in: ['$$categoryId', '$categories'] },
              { $eq: ['$approvalStatus', 'approved'] }
            ]
          }
        }
      }
    ],
    as: 'places'
  }
}
```

#### `src/services/place.service.js`

**`countPlaceByCategory` function:**
```javascript
// Already correct - no changes needed
const countPlaceByCategory = async (categoryId) => {
  const count = await Place.countDocuments({ 
    categories: categoryId, 
    approvalStatus: 'approved' 
  });
  return count;
};
```

## Technical Details

### MongoDB Aggregation Pipeline Changes

**Before (Simple Lookup):**
```javascript
{
  $lookup: {
    from: 'places',
    localField: '_id',
    foreignField: 'categories',
    as: 'places'
  }
}
```

**After (Pipeline Lookup with Filter):**
```javascript
{
  $lookup: {
    from: 'places',
    let: { categoryId: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $in: ['$$categoryId', '$categories'] },
              { $eq: ['$approvalStatus', 'approved'] }
            ]
          }
        }
      }
    ],
    as: 'places'
  }
}
```

### Key Changes Explained

1. **`let: { categoryId: '$_id' }`**: Định nghĩa biến để sử dụng trong pipeline
2. **`pipeline: [...]`**: Thay thế simple lookup bằng pipeline lookup
3. **`$expr`**: Cho phép sử dụng aggregation expressions trong `$match`
4. **`$and`**: Kết hợp nhiều điều kiện
5. **`$in: ['$$categoryId', '$categories']`**: Kiểm tra category ID có trong array categories
6. **`$eq: ['$approvalStatus', 'approved']`**: Chỉ lấy places đã được approved

## Testing Results

### Before Fix
- Category place counts bao gồm tất cả places (pending, approved, rejected)
- Không chính xác cho public display

### After Fix
- ✅ Category place counts chỉ bao gồm approved places
- ✅ Logic chính xác cho public display
- ✅ Consistent với business logic

### Test Results
```bash
# Test Results
Total Categories: 60
Total Approved Places: 4
Total places across all categories: 6
# Note: 6 > 4 because one place can belong to multiple categories
```

## API Endpoints Affected

### 1. GET /v1/categories
**Response includes placeCount for each category:**
```json
{
  "code": 200,
  "data": {
    "results": [
      {
        "id": "category_id",
        "name": "Category Name",
        "slug": "category-slug",
        "placeCount": 5,  // Only approved places
        "type": "service",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 6,
    "totalResults": 60
  }
}
```

### 2. GET /v1/categories/:categoryId (requires auth)
**Response includes placeCount for specific category:**
```json
{
  "code": 200,
  "data": {
    "id": "category_id",
    "name": "Category Name",
    "slug": "category-slug",
    "placeCount": 3,  // Only approved places
    "description": "Category description",
    "type": "service",
    "thumbnail": {
      "id": "thumbnail_id",
      "url": "https://example.com/image.jpg"
    }
  }
}
```

## Business Logic

### Place Count Rules
1. **Only Approved Places**: Chỉ đếm places có `approvalStatus: 'approved'`
2. **Multiple Categories**: Một place có thể thuộc nhiều categories
3. **Public Display**: Place counts hiển thị chính xác cho public users
4. **Consistent Data**: Đảm bảo tính nhất quán với approved places list

### Example Scenarios
```
Scenario 1:
- Place A: approved, belongs to categories [Coffee, Restaurant]
- Place B: pending, belongs to categories [Coffee, Bar]
- Place C: approved, belongs to categories [Restaurant]

Results:
- Coffee category: 1 place (only Place A)
- Restaurant category: 2 places (Place A, Place C)
- Bar category: 0 places (Place B is pending)
```

## Performance Impact

### Minimal Performance Impact
- **Index Usage**: Sử dụng existing indexes trên `approvalStatus` và `categories`
- **Efficient Filtering**: Filter được apply trong aggregation pipeline
- **No Additional Queries**: Không cần thêm queries riêng biệt

### Recommended Indexes
```javascript
// Ensure these indexes exist for optimal performance
db.places.createIndex({ "approvalStatus": 1 })
db.places.createIndex({ "categories": 1 })
db.places.createIndex({ "approvalStatus": 1, "categories": 1 })
```

## Migration Notes

### Backward Compatibility
- ✅ Không breaking changes
- ✅ Existing API contracts unchanged
- ✅ Only data accuracy improved

### Deployment
- ✅ No database migrations required
- ✅ Code-only change
- ✅ Can be deployed immediately

## Testing

### Test Script
```bash
# Run the test script
node test-category-place-count.js
```

### Manual Testing
```bash
# Test categories endpoint
curl -X GET "http://localhost:3001/v1/categories" \
  -H "Content-Type: application/json" | jq '.data.results[] | {name: .name, placeCount: .placeCount}'

# Test places endpoint (for comparison)
curl -X GET "http://localhost:3001/v1/places" \
  -H "Content-Type: application/json" | jq '.data.totalResults'
```

## Security Considerations

1. **Data Privacy**: Chỉ hiển thị approved places cho public users
2. **Consistent Access Control**: Align với existing approval status logic
3. **No Information Leakage**: Không expose pending/rejected places count

## Future Considerations

1. **Admin View**: Có thể thêm admin-specific endpoints để xem tất cả places (including pending/rejected)
2. **Caching**: Có thể implement caching cho place counts nếu performance becomes an issue
3. **Real-time Updates**: Có thể implement real-time updates khi approval status changes
