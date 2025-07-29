# Database Seeding Scripts

Các script để seed dữ liệu mẫu vào database.

## Các lệnh có sẵn

### 1. Script riêng lẻ

```bash
# Seed categories
npm run seed:categories

# Seed places  
npm run seed:places

# Seed users
npm run seed:users

# Seed restricted words (từ thư mục scripts)
npm run seed:restricted-words

# Seed restricted words (từ thư mục src/scripts)
npm run seed:restricted-words:src

# Seed districts và wards
npm run seed:districts-wards

# Reset và seed lại districts và wards
npm run reset:districts-wards

# Xem thống kê districts và wards
npm run stats:districts-wards

# Tạo categories từ districts (type REGION)
npm run seed:categories-from-districts

# Reset và tạo lại categories từ districts
npm run reset:categories-from-districts

# Xem thống kê categories
npm run stats:categories

# Reset restricted words
npm run reset:restricted-words

# Reset weekly stats
npm run reset:weekly-stats

# Update hot scores
npm run update:hot-scores

# Update place ratings
npm run update:place-ratings

# Xóa trường lastViewedAt khỏi database
npm run remove:last-viewed-at
```

### 2. Script global

```bash
# Chạy script seeding cụ thể
npm run seed categories
npm run seed places
npm run seed users
npm run seed restricted-words

# Chạy tất cả scripts seeding theo thứ tự
npm run seed all
```

### 3. Reset database

```bash
# Reset database và chạy tất cả seeding (cần xác nhận)
npm run reset-db -- --confirm
# hoặc
npm run reset-db -- -y
```

## Cấu trúc thư mục

```
scripts/
├── seed.js                    # Script global để quản lý seeding
├── reset-db.js               # Script reset database
├── seedCategories.js         # Seed categories
├── seedPlaces.js            # Seed places
├── seedUsers.js             # Seed users
├── seedRestrictedWords.js   # Seed restricted words
├── seedDistrictsAndWards.js # Seed districts và wards
├── resetAndSeedDistrictsWards.js # Reset và seed districts/wards
├── statsDistrictsWards.js   # Xem thống kê districts và wards
├── seedCategoriesFromDistricts.js # Tạo categories từ districts
├── statsCategories.js       # Xem thống kê categories
├── resetRestrictedWords.js  # Reset restricted words
├── resetWeeklyStats.js      # Reset weekly stats
├── updateHotScores.js       # Update hot scores
├── updateAllPlaceRatings.js # Update place ratings
├── removeLastViewedAt.js    # Xóa trường lastViewedAt
└── README.md                # File hướng dẫn này

src/scripts/
└── seedRestrictedWords.js   # Script restricted words (phiên bản src)
```

## Lưu ý

- Tất cả scripts đều chạy với `NODE_ENV=development`
- Script `reset-db` sẽ yêu cầu xác nhận để tránh xóa dữ liệu nhầm
- Script `seed all` sẽ chạy theo thứ tự: categories → places → users → restricted-words
- Script districts và wards sẽ import dữ liệu từ file JSON có sẵn (chỉ Hà Nội)
- Script categories từ districts sẽ tạo categories với type REGION dựa trên districts có sẵn
- Script reset restricted words sẽ xóa và tạo lại danh sách từ cấm
- Script update sẽ cập nhật dữ liệu thống kê và ratings
- Mỗi script sẽ tự động kết nối và ngắt kết nối database

## Troubleshooting

Nếu gặp lỗi, hãy kiểm tra:

1. Database connection string trong config
2. Quyền truy cập database
3. Các model dependencies
4. Node.js version (yêu cầu >= 18.0.0) 