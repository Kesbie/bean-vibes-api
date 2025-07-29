const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const Category = require('../src/models/category.model');
const { categoryType } = require('../src/config/categoryType');
const slugify = require('slugify');

const categoryData = [
  // SERVICE categories - Dịch vụ
  {
    name: 'Takeaway',
    description: 'Dịch vụ mang đi, phù hợp cho những người bận rộn',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  },
  {
    name: 'Dine-in',
    description: 'Dịch vụ thưởng thức tại chỗ với không gian thoải mái',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Delivery',
    description: 'Dịch vụ giao hàng tận nơi qua các ứng dụng',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
  },
  {
    name: 'Catering',
    description: 'Dịch vụ cung cấp cà phê cho sự kiện, hội nghị',
    type: categoryType.SERVICE,
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
  },

  // STYLE categories - Phong cách
  {
    name: 'Hiện đại',
    description: 'Phong cách thiết kế hiện đại, minimalist',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  },
  {
    name: 'Vintage',
    description: 'Phong cách retro, cổ điển với không khí hoài niệm',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
  },
  {
    name: 'Công nghiệp',
    description: 'Phong cách industrial với gạch trần, ống nước',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    name: 'Thiên nhiên',
    description: 'Phong cách gần gũi thiên nhiên với cây xanh, ánh sáng tự nhiên',
    type: categoryType.STYLE,
    thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
  },

  // PURPOSE categories - Mục đích
  {
    name: 'Làm việc',
    description: 'Không gian yên tĩnh phù hợp cho việc học tập, làm việc',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  },
  {
    name: 'Hẹn hò',
    description: 'Không gian lãng mạn phù hợp cho các cặp đôi',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
  },
  {
    name: 'Gặp gỡ',
    description: 'Không gian thoải mái cho việc gặp gỡ bạn bè, đối tác',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop',
  },
  {
    name: 'Thư giãn',
    description: 'Không gian yên bình để thư giãn, đọc sách',
    type: categoryType.PURPOSE,
    thumbnail: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
  },
];

const seedCategories = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Xóa dữ liệu cũ (tùy chọn)
    await Category.deleteMany({});
    logger.info('Cleared existing categories');

    // Tạo slug cho từng category trước khi insert
    const categoriesWithSlugs = categoryData.map((category, index) => {
      const baseSlug = slugify(category.name, { lower: true });
      const slug = `${baseSlug}-${index + 1}`; // Thêm index để đảm bảo unique
      return {
        ...category,
        slug
      };
    });

    // Thêm dữ liệu mới
    const categories = await Category.insertMany(categoriesWithSlugs);
    logger.info(`Successfully seeded ${categories.length} categories`);

    // Log thống kê theo từng loại
    const stats = {};
    Object.values(categoryType).forEach(type => {
      const count = categories.filter(cat => cat.type === type).length;
      stats[type] = count;
    });

    logger.info('Category seeding statistics:', stats);

    // Hiển thị danh sách categories đã tạo
    console.log('\n=== DANH SÁCH CATEGORIES ĐÃ TẠO ===');
    categories.forEach(category => {
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