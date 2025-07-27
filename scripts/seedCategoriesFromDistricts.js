const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const Category = require('../src/models/category.model');
const District = require('../src/models/district.model');
const { categoryType } = require('../src/config/categoryType');

const createCategoriesFromDistricts = async () => {
  try {
    logger.info('Bắt đầu tạo categories từ districts...');

    // Lấy tất cả districts từ database
    const districts = await District.find({}).sort({ name: 1 });
    
    if (districts.length === 0) {
      logger.warn('Không có districts nào trong database. Vui lòng chạy script seed districts trước.');
      logger.info('Chạy lệnh: npm run seed:districts-wards');
      return;
    }

    logger.info(`Tìm thấy ${districts.length} districts`);

    // Tạo categories từ districts
    const categoryData = districts.map((district) => ({
      name: district.name,
      description: `Các quán cà phê tại ${district.name} - Khám phá những địa điểm cà phê tuyệt vời trong khu vực này`,
      type: categoryType.REGION,
      thumbnail: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop', // Default thumbnail
    }));

    // Kiểm tra xem đã có categories nào với type REGION chưa
    const existingRegionCategories = await Category.find({ type: categoryType.REGION });
    
    if (existingRegionCategories.length > 0) {
      logger.info(`Đã có ${existingRegionCategories.length} categories với type REGION. Bỏ qua tạo mới.`);
      logger.info('Nếu muốn tạo lại, hãy xóa categories cũ trước hoặc sử dụng script reset.');
      return existingRegionCategories;
    }

    // Tạo categories
    const createdCategories = await Category.insertMany(categoryData);
    logger.info(`Đã tạo thành công ${createdCategories.length} categories từ districts`);

    // Hiển thị danh sách categories đã tạo
    logger.info('\n=== DANH SÁCH CATEGORIES ĐÃ TẠO ===');
    createdCategories.forEach((category, index) => {
      logger.info(`${index + 1}. ${category.name} (${category.slug})`);
    });

    return createdCategories;
  } catch (error) {
    logger.error('Lỗi khi tạo categories từ districts:', error);
    throw error;
  }
};

const resetAndCreateCategoriesFromDistricts = async () => {
  try {
    logger.info('Bắt đầu reset và tạo lại categories từ districts...');

    // Xóa tất cả categories có type REGION
    const deleteResult = await Category.deleteMany({ type: categoryType.REGION });
    logger.info(`Đã xóa ${deleteResult.deletedCount} categories cũ với type REGION`);

    // Tạo lại categories
    const createdCategories = await createCategoriesFromDistricts();
    
    return createdCategories;
  } catch (error) {
    logger.error('Lỗi khi reset và tạo categories:', error);
    throw error;
  }
};

const seedCategoriesFromDistricts = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Tạo categories từ districts
    await createCategoriesFromDistricts();

    // Thống kê
    const totalCategories = await Category.countDocuments();
    const regionCategories = await Category.countDocuments({ type: categoryType.REGION });
    logger.info(`\n=== THỐNG KÊ ===`);
    logger.info(`Tổng số categories: ${totalCategories}`);
    logger.info(`Categories type REGION: ${regionCategories}`);

  } catch (error) {
    logger.error('Lỗi trong quá trình seed categories từ districts:', error);
  } finally {
    // Đóng kết nối database
    await mongoose.disconnect();
    logger.info('Đã đóng kết nối database');
    process.exit(0);
  }
};

const resetAndSeedCategoriesFromDistricts = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Reset và tạo lại categories
    await resetAndCreateCategoriesFromDistricts();

    // Thống kê
    const totalCategories = await Category.countDocuments();
    const regionCategories = await Category.countDocuments({ type: categoryType.REGION });
    logger.info(`\n=== THỐNG KÊ ===`);
    logger.info(`Tổng số categories: ${totalCategories}`);
    logger.info(`Categories type REGION: ${regionCategories}`);

  } catch (error) {
    logger.error('Lỗi trong quá trình reset và seed categories:', error);
  } finally {
    // Đóng kết nối database
    await mongoose.disconnect();
    logger.info('Đã đóng kết nối database');
    process.exit(0);
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  // Kiểm tra argument để quyết định có reset hay không
  const shouldReset = process.argv.includes('--reset') || process.argv.includes('-r');
  
  if (shouldReset) {
    resetAndSeedCategoriesFromDistricts();
  } else {
    seedCategoriesFromDistricts();
  }
}

module.exports = {
  seedCategoriesFromDistricts,
  resetAndSeedCategoriesFromDistricts,
  createCategoriesFromDistricts,
  resetAndCreateCategoriesFromDistricts,
}; 