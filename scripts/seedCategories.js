const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const categoryService = require('../src/services/category.service');
const { categoryType } = require('../src/config/categoryType');

const categoryData = [
  // SERVICE categories - Dịch vụ
  {
    name: 'Bàn ngoài trời',
    description: 'Dịch vụ mang đi, phù hợp cho những người bận rộn',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  },
  {
    name: 'Bánh ngọt',
    description: 'Dịch vụ thưởng thức tại chỗ với không gian thoải mái',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Chiếu bóng đá',
    description: 'Dịch vụ giao hàng tận nơi qua các ứng dụng',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
  },
  {
    name: 'Chỗ chơi cho trẻ em',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
  },
  {
    name: 'Chỗ đậu ôtô',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Giao hàng',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Giữ xe máy',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Khu vực hút thuốc',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Mang đồ ăn ngoài',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Mang thú cưng',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Máy lạnh & điều hòa',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Nhạc sống',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Thanh toán bằng thẻ',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Wi-Fi miễn phí',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },

  // STYLE categories - Phong cách
  {
    name: 'Cafe Acoustic',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe Bình Dân',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe Cổ Điển',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe Lounge',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe Ngoài Trời',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: ' Cafe Sang Trọng',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe Tone Màu',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe Trên Cao',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe View Đẹp',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Cafe Vườn',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'PUB',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },

  // PURPOSE categories - Mục đích
  {
    name: 'Sống ảo',
    description: 'Không gian yên tĩnh phù hợp cho việc học tập, làm việc',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Hẹn hò',
    description: 'Không gian lãng mạn phù hợp cho các cặp đôi',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Làm việc',
    description: 'Không gian thoải mái cho việc gặp gỡ bạn bè, đối tác',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Đọc sách',
    description: 'Không gian yên bình để thư giãn, đọc sách',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
  },
  {
    name: 'Chill',
    description: 'Không gian thoải mái để thư giãn, nghe nhạc',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },

  // REGION categories - Khu vực

  {
    name: 'Quận Ba Đình',
    description: 'Quận Ba Đình',
    slug: 'ba-dinh',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/ba-dinh-1647433057947.jpeg',
  },
  {
    name: 'Quận Hoàn Kiếm',
    description: 'Quận Hoàn Kiếm',
    slug: 'hoan-kiem',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/hoan-kiem-1647433057947.jpeg',
  },
  {
    name: 'Quận Tây Hồ',
    description: 'Quận Tây Hồ',
    slug: 'tay-ho',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/tay-ho-1647433156043.jpeg?w=960',
  },
  {
    name: 'Quận Long Biên',
    description: 'Quận Long Biên',
    slug: 'long-bien',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/long-bien-1647433057947.jpeg',
  },
  {
    name: 'Quận Cầu Giấy',
    description: 'Quận Cầu Giấy',
    slug: 'cau-giay',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/cau-giay-1647433057947.jpeg',
  },
  {
    name: 'Quận Đống Đa',
    description: 'Quận Đống Đa',
    slug: 'dong-da',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/dong-da-1647433142184.jpeg',
  },
  {
    name: 'Quận Hai Bà Trưng',
    description: 'Quận Hai Bà Trưng',
    slug: 'hai-ba-trung',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/hai-ba-trung-1647433057947.jpeg',
  },
  {
    name: 'Quận Hoàng Mai',
    description: 'Quận Hoàng Mai',
    slug: 'hoang-mai',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/hoang-mai-1647433057947.jpeg',
  },
  {
    name: 'Quận Thanh Xuân',
    description: 'Quận Thanh Xuân',
    slug: 'thanh-xuan',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/thanh-xuan-1647433057947.jpeg',
  },
  {
    name: 'Huyện Sóc Sơn',
    description: 'Huyện Sóc Sơn',
    slug: 'soc-son',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/soc-son-1647433057947.jpeg',
  },
  {
    name: 'Huyện Đông Anh',
    description: 'Huyện Đông Anh',
    slug: 'dong-anh',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/dong-anh-1647433057947.jpeg',
  },
  {
    name: 'Huyện Gia Lâm',
    description: 'Huyện Gia Lâm',
    slug: 'gia-lam',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/gia-lam-1647433057947.jpeg',
  },
  {
    name: 'Quận Nam Từ Liêm',
    description: 'Quận Nam Từ Liêm',
    slug: 'nam-tu-liem',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/nam-tu-liem-1647433057947.jpeg',
  },
  {
    name: 'Huyện Thanh Trì',
    description: 'Huyện Thanh Trì',
    slug: 'thanh-tri',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/thanh-tri-1647433057947.jpeg',
  },
  {
    name: 'Quận Bắc Từ Liêm',
    description: 'Quận Bắc Từ Liêm',
    slug: 'bac-tu-liem',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/bac-tu-liem-1647433057947.jpeg',
  },
  {
    name: 'Huyện Mê Linh',
    description: 'Huyện Mê Linh',
    slug: 'me-linh',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/me-linh-1647433057947.jpeg',
  },
  {
    name: 'Quận Hà Đông',
    description: 'Quận Hà Đông',
    slug: 'ha-dong',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/ha-dong-1647433057947.jpeg',
  },
  {
    name: 'Thị xã Sơn Tây',
    description: 'Thị xã Sơn Tây',
    slug: 'son-tay',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/son-tay-1647433057947.jpeg',
  },
  {
    name: 'Huyện Ba Vì',
    description: 'Huyện Ba Vì',
    slug: 'ba-vi',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/ba-vi-1647433057947.jpeg',
  },
  {
    name: 'Huyện Phúc Thọ',
    description: 'Huyện Phúc Thọ',
    slug: 'phuc-tho',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/phuc-tho-1647433057947.jpeg',
  },
  {
    name: 'Huyện Đan Phượng',
    description: 'Huyện Đan Phượng',
    slug: 'dan-phuong',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/dan-phuong-1647433057947.jpeg',
  },
  {
    name: 'Huyện Hoài Đức',
    description: 'Huyện Hoài Đức',
    slug: 'hoai-duc',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/hoai-duc-1647433057947.jpeg',
  },
  {
    name: 'Huyện Quốc Oai',
    description: 'Huyện Quốc Oai',
    slug: 'quoc-oai',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/quoc-oai-1647433057947.jpeg',
  },
  {
    name: 'Huyện Thạch Thất',
    description: 'Huyện Thạch Thất',
    slug: 'thach-that',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/thach-that-1647433057947.jpeg',
  },
  {
    name: 'Huyện Chương Mỹ',
    description: 'Huyện Chương Mỹ',
    slug: 'chuong-my',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/chuong-my-1647433057947.jpeg',
  },
  {
    name: 'Huyện Thanh Oai',
    description: 'Huyện Thanh Oai',
    slug: 'thanh-oai',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/thanh-oai-1647433057947.jpeg',
  },
  {
    name: 'Huyện Thường Tín',
    description: 'Huyện Thường Tín',
    slug: 'thuong-tin',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/thuong-tin-1647433057947.jpeg',
  },
  {
    name: 'Huyện Phú Xuyên',
    description: 'Huyện Phú Xuyên',
    slug: 'phu-xuyen',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/phu-xuyen-1647433057947.jpeg',
  },
  {
    name: 'Huyện Ứng Hòa',
    description: 'Huyện Ứng Hòa',
    slug: 'ung-hoa',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/ung-hoa-1647433057947.jpeg',
  },
  {
    name: 'Huyện Mỹ Đức',
    description: 'Huyện Mỹ Đức',
    slug: 'my-duc',
    type: categoryType.REGION,
    thumbnail: 'https://toidicafe.vn/static/images/region/my-duc-1647433057947.jpeg',
  },
];

const seedCategories = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Xóa tất cả categories hiện có bằng service
    const deleteResult = await categoryService.deleteAllCategories();
    logger.info(`Deleted ${deleteResult.deletedCount} existing categories`);

    // Thêm dữ liệu mới bằng service
    const createdCategories = [];
    for (const category of categoryData) {
      try {
        const result = await categoryService.createCategory(category);
        createdCategories.push(result);
        logger.info(`Created category: ${category.name}`);
      } catch (error) {
        logger.error(`Failed to create category ${categoryData.name}:`, error.message);
      }
    }

    logger.info(`Successfully seeded ${createdCategories.length} categories`);

    // Log thống kê theo từng loại
    const stats = {};
    Object.values(categoryType).forEach((type) => {
      const count = createdCategories.filter((cat) => cat.type === type).length;
      stats[type] = count;
    });

    logger.info('Category seeding statistics:', stats);

    // Hiển thị danh sách categories đã tạo
    console.log('\n=== DANH SÁCH CATEGORIES ĐÃ TẠO ===');
    createdCategories.forEach((category) => {
      console.log(`- ${category.name} (${category.type}) - Slug: ${category.slug}`);
    });
  } catch (error) {
    logger.error('Error seeding categories:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Chạy script
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
