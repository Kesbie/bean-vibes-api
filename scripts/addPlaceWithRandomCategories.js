const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const Place = require('../src/models/places.model');
const Category = require('../src/models/category.model');

// Sample cafe data for Hanoi
const cafeData = [
  { name: 'Cà Phê Trung Nguyên - Hoàn Kiếm', district: 'Hoàn Kiếm', street: '45 Tràng Tiền', ward: 'Phường Hàng Bài', coords: [105.8542, 21.0285], price: [25000, 60000] },
  { name: 'Highlands Coffee - Ba Đình', district: 'Ba Đình', street: '54 Liễu Giai', ward: 'Phường Ngọc Khánh', coords: [105.8122, 21.0369], price: [35000, 80000] },
  { name: 'The Coffee House - Đống Đa', district: 'Đống Đa', street: '123 Tây Sơn', ward: 'Phường Ngã Tư Sở', coords: [105.8234, 21.0123], price: [30000, 70000] },
  { name: 'Cộng Cà Phê - Hai Bà Trưng', district: 'Hai Bà Trưng', street: '67 Trần Hưng Đạo', ward: 'Phường Trần Hưng Đạo', coords: [105.8456, 21.0156], price: [28000, 65000] },
  { name: 'Phúc Long Coffee - Cầu Giấy', district: 'Cầu Giấy', street: '89 Xuân Thủy', ward: 'Phường Dịch Vọng', coords: [105.7890, 21.0345], price: [32000, 75000] },
  { name: 'Gong Cha - Tây Hồ', district: 'Tây Hồ', street: '156 Xuân Diệu', ward: 'Phường Quảng An', coords: [105.8234, 21.0678], price: [30000, 80000] },
  { name: 'Cà Phê Sài Gòn - Long Biên', district: 'Long Biên', street: '234 Nguyễn Văn Cừ', ward: 'Phường Ngọc Lâm', coords: [105.8765, 21.0234], price: [25000, 55000] },
  { name: 'Trà Sữa TocoToco - Hoàng Mai', district: 'Hoàng Mai', street: '456 Minh Khai', ward: 'Phường Mai Động', coords: [105.8345, 20.9876], price: [28000, 70000] },
  { name: 'Cà Phê Vợt - Thanh Xuân', district: 'Thanh Xuân', street: '789 Nguyễn Trãi', ward: 'Phường Thanh Xuân Trung', coords: [105.8123, 21.0012], price: [22000, 50000] },
  { name: 'Cà Phê Bệt - Hà Đông', district: 'Hà Đông', street: '321 Quang Trung', ward: 'Phường Quang Trung', coords: [105.7654, 20.9765], price: [20000, 45000] },
  { name: 'Cà Phê Giảng - Ba Đình', district: 'Ba Đình', street: '39 Nguyễn Hữu Huân', ward: 'Phường Lý Thái Tổ', coords: [105.8234, 21.0345], price: [40000, 90000] },
  { name: 'Cà Phê Dinh - Hoàn Kiếm', district: 'Hoàn Kiếm', street: '13 Đinh Tiên Hoàng', ward: 'Phường Hàng Trống', coords: [105.8456, 21.0234], price: [35000, 75000] },
  { name: 'Cà Phê Lâm - Đống Đa', district: 'Đống Đa', street: '91 Nguyễn Hữu Huân', ward: 'Phường Láng Hạ', coords: [105.8123, 21.0123], price: [30000, 65000] },
  { name: 'Cà Phê Ngon - Hai Bà Trưng', district: 'Hai Bà Trưng', street: '67 Trần Hưng Đạo', ward: 'Phường Trần Hưng Đạo', coords: [105.8345, 21.0156], price: [32000, 70000] },
  { name: 'Cà Phê Sài Gòn - Cầu Giấy', district: 'Cầu Giấy', street: '123 Xuân Thủy', ward: 'Phường Dịch Vọng', coords: [105.7890, 21.0345], price: [28000, 60000] },
  { name: 'Cà Phê Vợt - Tây Hồ', district: 'Tây Hồ', street: '456 Xuân Diệu', ward: 'Phường Quảng An', coords: [105.8234, 21.0678], price: [25000, 55000] },
  { name: 'Cà Phê Bệt - Long Biên', district: 'Long Biên', street: '789 Nguyễn Văn Cừ', ward: 'Phường Ngọc Lâm', coords: [105.8765, 21.0234], price: [22000, 50000] },
  { name: 'Cà Phê Giảng - Hoàng Mai', district: 'Hoàng Mai', street: '234 Minh Khai', ward: 'Phường Mai Động', coords: [105.8345, 20.9876], price: [30000, 65000] },
  { name: 'Cà Phê Dinh - Thanh Xuân', district: 'Thanh Xuân', street: '567 Nguyễn Trãi', ward: 'Phường Thanh Xuân Trung', coords: [105.8123, 21.0012], price: [28000, 60000] },
  { name: 'Cà Phê Lâm - Hà Đông', district: 'Hà Đông', street: '890 Quang Trung', ward: 'Phường Quang Trung', coords: [105.7654, 20.9765], price: [25000, 55000] },
  { name: 'Cà Phê Ngon - Ba Đình', district: 'Ba Đình', street: '123 Nguyễn Hữu Huân', ward: 'Phường Lý Thái Tổ', coords: [105.8234, 21.0345], price: [35000, 75000] },
  { name: 'Cà Phê Sài Gòn - Hoàn Kiếm', district: 'Hoàn Kiếm', street: '456 Đinh Tiên Hoàng', ward: 'Phường Hàng Trống', coords: [105.8456, 21.0234], price: [30000, 65000] },
  { name: 'Cà Phê Vợt - Đống Đa', district: 'Đống Đa', street: '789 Nguyễn Hữu Huân', ward: 'Phường Láng Hạ', coords: [105.8123, 21.0123], price: [28000, 60000] },
  { name: 'Cà Phê Bệt - Hai Bà Trưng', district: 'Hai Bà Trưng', street: '234 Trần Hưng Đạo', ward: 'Phường Trần Hưng Đạo', coords: [105.8345, 21.0156], price: [25000, 55000] },
  { name: 'Cà Phê Giảng - Cầu Giấy', district: 'Cầu Giấy', street: '567 Xuân Thủy', ward: 'Phường Dịch Vọng', coords: [105.7890, 21.0345], price: [32000, 70000] },
  { name: 'Cà Phê Dinh - Tây Hồ', district: 'Tây Hồ', street: '890 Xuân Diệu', ward: 'Phường Quảng An', coords: [105.8234, 21.0678], price: [30000, 65000] },
  { name: 'Cà Phê Lâm - Long Biên', district: 'Long Biên', street: '123 Nguyễn Văn Cừ', ward: 'Phường Ngọc Lâm', coords: [105.8765, 21.0234], price: [28000, 60000] },
  { name: 'Cà Phê Ngon - Hoàng Mai', district: 'Hoàng Mai', street: '456 Minh Khai', ward: 'Phường Mai Động', coords: [105.8345, 20.9876], price: [35000, 75000] },
  { name: 'Cà Phê Sài Gòn - Thanh Xuân', district: 'Thanh Xuân', street: '789 Nguyễn Trãi', ward: 'Phường Thanh Xuân Trung', coords: [105.8123, 21.0012], price: [30000, 65000] },
  { name: 'Cà Phê Vợt - Hà Đông', district: 'Hà Đông', street: '234 Quang Trung', ward: 'Phường Quang Trung', coords: [105.7654, 20.9765], price: [25000, 55000] },
  { name: 'Cà Phê Bệt - Ba Đình', district: 'Ba Đình', street: '567 Nguyễn Hữu Huân', ward: 'Phường Lý Thái Tổ', coords: [105.8234, 21.0345], price: [32000, 70000] },
  { name: 'Cà Phê Giảng - Hoàn Kiếm', district: 'Hoàn Kiếm', street: '890 Đinh Tiên Hoàng', ward: 'Phường Hàng Trống', coords: [105.8456, 21.0234], price: [30000, 65000] },
  { name: 'Cà Phê Dinh - Đống Đa', district: 'Đống Đa', street: '123 Nguyễn Hữu Huân', ward: 'Phường Láng Hạ', coords: [105.8123, 21.0123], price: [28000, 60000] },
  { name: 'Cà Phê Lâm - Hai Bà Trưng', district: 'Hai Bà Trưng', street: '456 Trần Hưng Đạo', ward: 'Phường Trần Hưng Đạo', coords: [105.8345, 21.0156], price: [25000, 55000] },
  { name: 'Cà Phê Ngon - Cầu Giấy', district: 'Cầu Giấy', street: '789 Xuân Thủy', ward: 'Phường Dịch Vọng', coords: [105.7890, 21.0345], price: [35000, 75000] },
  { name: 'Cà Phê Sài Gòn - Tây Hồ', district: 'Tây Hồ', street: '234 Xuân Diệu', ward: 'Phường Quảng An', coords: [105.8234, 21.0678], price: [30000, 65000] },
  { name: 'Cà Phê Vợt - Long Biên', district: 'Long Biên', street: '567 Nguyễn Văn Cừ', ward: 'Phường Ngọc Lâm', coords: [105.8765, 21.0234], price: [28000, 60000] },
  { name: 'Cà Phê Bệt - Hoàng Mai', district: 'Hoàng Mai', street: '890 Minh Khai', ward: 'Phường Mai Động', coords: [105.8345, 20.9876], price: [32000, 70000] },
  { name: 'Cà Phê Giảng - Thanh Xuân', district: 'Thanh Xuân', street: '123 Nguyễn Trãi', ward: 'Phường Thanh Xuân Trung', coords: [105.8123, 21.0012], price: [30000, 65000] },
  { name: 'Cà Phê Dinh - Hà Đông', district: 'Hà Đông', street: '456 Quang Trung', ward: 'Phường Quang Trung', coords: [105.7654, 20.9765], price: [25000, 55000] }
];

const addPlacesWithRandomCategories = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    const categories = await Category.find({});
    if (categories.length === 0) {
      logger.warn('No categories found. Please run seed:categories first.');
      return;
    }

    logger.info(`Found ${categories.length} categories available`);

    // Xóa tất cả places cũ
    await Place.deleteMany({});
    logger.info('Cleared existing places');

    const addedPlaces = [];

    for (const cafe of cafeData) {
      // Chọn ngẫu nhiên 2-4 categories
      const numCategories = Math.floor(Math.random() * 3) + 2;
      const selectedCategories = [];
      const availableCategories = [...categories];
      
      for (let i = 0; i < numCategories && availableCategories.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableCategories.length);
        const randomCategory = availableCategories.splice(randomIndex, 1)[0];
        selectedCategories.push(randomCategory._id);
      }

      const placeData = {
        name: cafe.name,
        slug: cafe.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        description: `Cà phê ${cafe.name} với không gian ấm cúng, phù hợp cho những cuộc trò chuyện thân mật.`,
        photos: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop'
        ],
        address: {
          street: cafe.street,
          ward: cafe.ward,
          district: cafe.district,
          fullAddress: `${cafe.street}, ${cafe.ward}, Quận ${cafe.district}, Hà Nội`,
          coordinates: {
            type: 'Point',
            coordinates: cafe.coords
          }
        },
        status: 'active',
        wifi: {
          name: `${cafe.name.replace(/\s+/g, '_')}_WiFi`,
          password: 'cafe2024'
        },
        time: {
          open: '07:00',
          close: '23:00'
        },
        price: {
          min: cafe.price[0],
          max: cafe.price[1]
        },
        socials: [
          {
            type: 'facebook',
            url: 'https://facebook.com/cafehanoi'
          },
          {
            type: 'instagram',
            url: 'https://instagram.com/cafehanoi'
          }
        ],
        isVerified: true,
        approvalStatus: 'approved',
        categories: selectedCategories
      };

      const newPlace = new Place(placeData);
      const savedPlace = await newPlace.save();
      
      const assignedCategories = await Category.find({
        _id: { $in: selectedCategories }
      });

      addedPlaces.push({
        place: savedPlace,
        categories: assignedCategories
      });

      logger.info(`Added place: ${savedPlace.name}`);
    }

    console.log('\n=== KẾT QUẢ THÊM PLACES ===');
    console.log(`✅ Đã thêm thành công ${addedPlaces.length} quán cafe tại Hà Nội`);
    
    // Thống kê theo quận
    const districtStats = {};
    addedPlaces.forEach(({ place }) => {
      const district = place.address.district;
      districtStats[district] = (districtStats[district] || 0) + 1;
    });

    console.log('\n📊 Thống kê theo quận:');
    Object.entries(districtStats).forEach(([district, count]) => {
      console.log(`   ${district}: ${count} quán`);
    });

    logger.info(`Successfully added ${addedPlaces.length} places with random categories`);

  } catch (error) {
    logger.error('Error adding places:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

if (require.main === module) {
  addPlacesWithRandomCategories();
}

module.exports = addPlacesWithRandomCategories; 