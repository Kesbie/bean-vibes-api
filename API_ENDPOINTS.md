# API Endpoints Documentation

## Overview
Tài liệu này mô tả tất cả các API endpoints đã được tạo cho các model trong hệ thống Bean Vibes.

## Base URL
```
http://localhost:3000/v1
```

## Authentication
Hầu hết các endpoints yêu cầu authentication. Sử dụng Bearer token trong header:
```
Authorization: Bearer <your-token>
```

## 1. Comment Endpoints

### Create Comment
- **POST** `/comments`
- **Auth**: Required
- **Body**: `{ review: ObjectId, content: string }`

### Get Comments
- **GET** `/comments`
- **Query**: `review`, `user`, `sortBy`, `limit`, `page`

### Get Comment by ID
- **GET** `/comments/:commentId`

### Update Comment
- **PATCH** `/comments/:commentId`
- **Auth**: Required
- **Body**: `{ content: string }`

### Delete Comment
- **DELETE** `/comments/:commentId`
- **Auth**: Required

### Get Comments by Review
- **GET** `/comments/review/:reviewId`
- **Query**: `sortBy`, `limit`, `page`

### Get Comments by User
- **GET** `/comments/user/:userId`
- **Query**: `sortBy`, `limit`, `page`

## 2. Place Endpoints

### Create Place
- **POST** `/places`
- **Auth**: Required
- **Body**: `{ name: string, description: string, photos: string[], address: string, status: string, wifi: object, time: object, price: object, socials: string[], categories: ObjectId[] }`

### Get Places
- **GET** `/places`
- **Query**: `status`, `isVerified`, `approvalStatus`, `categories`, `sortBy`, `limit`, `page`

### Get Place by ID
- **GET** `/places/:placeId`

### Update Place
- **PATCH** `/places/:placeId`
- **Auth**: Required
- **Body**: `{ name, description, photos, address, status, wifi, time, price, socials, categories }`

### Delete Place
- **DELETE** `/places/:placeId`
- **Auth**: Required

### Search Places
- **GET** `/places/search`
- **Query**: `q` (search term), `sortBy`, `limit`, `page`

### Get Verified Places
- **GET** `/places/verified`
- **Query**: `sortBy`, `limit`, `page`

### Get Places by Category
- **GET** `/places/category/:categoryId`
- **Query**: `sortBy`, `limit`, `page`

### Update Place Approval Status
- **PATCH** `/places/:placeId/approval-status`
- **Auth**: Required (managePlaces role)
- **Body**: `{ status: 'pending' | 'approved' | 'rejected' }`

### Update Place Rating
- **PATCH** `/places/:placeId/rating`
- **Auth**: Required
- **Body**: `{ averageRating: number, totalRatings: number }`

## 3. Report Endpoints

### Create Report
- **POST** `/reports`
- **Auth**: Required
- **Body**: `{ reportable: ObjectId, reportableModel: 'Review' | 'Comment', review: ObjectId, comment: ObjectId, title: string, reason: string }`

### Get Reports
- **GET** `/reports`
- **Auth**: Required (getReports role)
- **Query**: `status`, `reportableModel`, `user`, `sortBy`, `limit`, `page`

### Get Report by ID
- **GET** `/reports/:reportId`
- **Auth**: Required (getReports role)

### Update Report
- **PATCH** `/reports/:reportId`
- **Auth**: Required (manageReports role)
- **Body**: `{ title, reason, status }`

### Delete Report
- **DELETE** `/reports/:reportId`
- **Auth**: Required (manageReports role)

### Get Pending Reports
- **GET** `/reports/pending`
- **Auth**: Required (getReports role)
- **Query**: `sortBy`, `limit`, `page`

### Get Reports by Status
- **GET** `/reports/status/:status`
- **Auth**: Required (getReports role)
- **Query**: `sortBy`, `limit`, `page`

### Get Reports by User
- **GET** `/reports/user/:userId`
- **Auth**: Required (getReports role)
- **Query**: `sortBy`, `limit`, `page`

### Get Reports by Reportable
- **GET** `/reports/reportable/:reportableModel/:reportableId`
- **Auth**: Required (getReports role)
- **Query**: `sortBy`, `limit`, `page`

### Update Report Status
- **PATCH** `/reports/:reportId/status`
- **Auth**: Required (manageReports role)
- **Body**: `{ status: 'pending' | 'approved' | 'rejected' }`

## 4. Review Endpoints

### Create Review
- **POST** `/reviews`
- **Auth**: Required
- **Body**: `{ place: ObjectId, title: string, content: string, slug: string, photos: number, isAnonymous: boolean }`

### Get Reviews
- **GET** `/reviews`
- **Query**: `place`, `user`, `isAnonymous`, `sortBy`, `limit`, `page`

### Get Review by ID
- **GET** `/reviews/:reviewId`

### Update Review
- **PATCH** `/reviews/:reviewId`
- **Auth**: Required
- **Body**: `{ title, content, slug, photos, isAnonymous }`

### Delete Review
- **DELETE** `/reviews/:reviewId`
- **Auth**: Required

### Search Reviews
- **GET** `/reviews/search`
- **Query**: `q` (search term), `sortBy`, `limit`, `page`

### Get Anonymous Reviews
- **GET** `/reviews/anonymous`
- **Query**: `sortBy`, `limit`, `page`

### Get Reviews by Place
- **GET** `/reviews/place/:placeId`
- **Query**: `sortBy`, `limit`, `page`

### Get Reviews by User
- **GET** `/reviews/user/:userId`
- **Query**: `sortBy`, `limit`, `page`

### Add Reaction to Review
- **POST** `/reviews/:reviewId/reactions`
- **Auth**: Required
- **Body**: `{ reactionId: ObjectId }`

### Remove Reaction from Review
- **DELETE** `/reviews/:reviewId/reactions`
- **Auth**: Required
- **Body**: `{ reactionId: ObjectId }`

### Add Comment to Review
- **POST** `/reviews/:reviewId/comments`
- **Auth**: Required
- **Body**: `{ content: string }`

## 5. Reaction Endpoints

### Create Reaction
- **POST** `/reactions`
- **Auth**: Required
- **Body**: `{ review: ObjectId, comment: ObjectId, type: 'like' | 'dislike' }`

### Get Reactions
- **GET** `/reactions`
- **Query**: `review`, `comment`, `user`, `type`, `sortBy`, `limit`, `page`

### Get Reaction by ID
- **GET** `/reactions/:reactionId`

### Update Reaction
- **PATCH** `/reactions/:reactionId`
- **Auth**: Required
- **Body**: `{ type: 'like' | 'dislike' }`

### Delete Reaction
- **DELETE** `/reactions/:reactionId`
- **Auth**: Required

### Toggle Reaction
- **POST** `/reactions/toggle`
- **Auth**: Required
- **Body**: `{ reviewId: ObjectId, commentId: ObjectId, type: 'like' | 'dislike' }`

### Get Reaction Count
- **GET** `/reactions/count`
- **Query**: `reviewId`, `commentId`, `type`

### Get Reactions by User
- **GET** `/reactions/user/:userId`
- **Query**: `sortBy`, `limit`, `page`

### Get Reactions by Review
- **GET** `/reactions/review/:reviewId`
- **Query**: `sortBy`, `limit`, `page`

### Get Reactions by Comment
- **GET** `/reactions/comment/:commentId`
- **Query**: `sortBy`, `limit`, `page`

### Get Reactions by Type
- **GET** `/reactions/type/:type`
- **Query**: `sortBy`, `limit`, `page`

## 6. Ward Endpoints

### Create Ward
- **POST** `/wards`
- **Auth**: Required (manageWards role)
- **Body**: `{ name: string, slug: string, district_id: ObjectId }`

### Get Wards
- **GET** `/wards`
- **Query**: `district_id`, `sortBy`, `limit`, `page`

### Get Ward by ID
- **GET** `/wards/:wardId`

### Update Ward
- **PATCH** `/wards/:wardId`
- **Auth**: Required (manageWards role)
- **Body**: `{ name, slug, district_id }`

### Delete Ward
- **DELETE** `/wards/:wardId`
- **Auth**: Required (manageWards role)

### Search Wards
- **GET** `/wards/search`
- **Query**: `q` (search term), `sortBy`, `limit`, `page`

### Get Wards by District
- **GET** `/wards/district/:districtId`
- **Query**: `sortBy`, `limit`, `page`

### Get Ward by Slug
- **GET** `/wards/slug/:slug`

## 7. District Endpoints

### Create District
- **POST** `/districts`
- **Auth**: Required (manageDistricts role)
- **Body**: `{ name: string, slug: string }`

### Get Districts
- **GET** `/districts`
- **Query**: `name`, `sortBy`, `limit`, `page`

### Get All Districts
- **GET** `/districts/all`
- **Query**: `sortBy`, `limit`, `page`

### Get District by ID
- **GET** `/districts/:districtId`

### Update District
- **PATCH** `/districts/:districtId`
- **Auth**: Required (manageDistricts role)
- **Body**: `{ name, slug }`

### Delete District
- **DELETE** `/districts/:districtId`
- **Auth**: Required (manageDistricts role)

### Search Districts
- **GET** `/districts/search`
- **Query**: `q` (search term), `sortBy`, `limit`, `page`

### Get District by Slug
- **GET** `/districts/slug/:slug`

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message",
  "code": 400
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": {
    "results": [],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalResults": 50
  }
}
```

## Common Query Parameters

- `sortBy`: Field to sort by (e.g., `createdAt:desc`, `name:asc`)
- `limit`: Number of results per page (default: 10)
- `page`: Page number (default: 1)

## Authentication Roles

- `managePlaces`: Can manage place approval status
- `manageReports`: Can manage reports
- `manageWards`: Can manage wards
- `manageDistricts`: Can manage districts
- `getReports`: Can view reports 