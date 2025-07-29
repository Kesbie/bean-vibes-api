const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const Category = require('../src/models/category.model');
const { categoryType } = require('../src/config/categoryType');

const showCategoryStats = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Thống kê tổng quan
    const totalCategories = await Category.countDocuments();
    
    logger.info('=== THỐNG KÊ CATEGORIES ===');
    logger.info(`Tổng số categories: ${totalCategories}`);

    if (totalCategories > 0) {
      // Thống kê theo type
      logger.info('\n=== THỐNG KÊ THEO TYPE ===');
      
      for (const type of Object.values(categoryType)) {
        const count = await Category.countDocuments({ type });
        const typeName = Object.keys(categoryType).find(key => categoryType[key] === type);
        logger.info(`${typeName} (${type}): ${count} categories`);
      }

      // Hiển thị categories theo từng type
      logger.info('\n=== DANH SÁCH CATEGORIES THEO TYPE ===');
      
      for (const type of Object.values(categoryType)) {
        const categories = await Category.find({ type }).sort({ name: 1 });
        const typeName = Object.keys(categoryType).find(key => categoryType[key] === type);
        
        if (categories.length > 0) {
          logger.info(`\n--- ${typeName.toUpperCase()} (${categories.length}) ---`);
          categories.forEach((category, index) => {
            logger.info(`${index + 1}. ${category.name} (${category.slug})`);
          });
        } else {
          logger.info(`\n--- ${typeName.toUpperCase()} (0) ---`);
          logger.info('Chưa có categories nào');
        }
      }

      // Thống kê chi tiết cho REGION categories
      const regionCategories = await Category.find({ type: categoryType.REGION }).sort({ name: 1 });
      if (regionCategories.length > 0) {
        logger.info('\n=== CHI TIẾT REGION CATEGORIES ===');
        regionCategories.forEach((category, index) => {
          logger.info(`${index + 1}. ${category.name}`);
          logger.info(`   Slug: ${category.slug}`);
          logger.info(`   Description: ${category.description}`);
          logger.info(`   Created: ${category.createdAt.toLocaleDateString('vi-VN')}`);
          logger.info('');
        });
      }

    } else {
      logger.info('Chưa có categories nào trong database');
      logger.info('Chạy lệnh: npm run seed:categories');
    }

  } catch (error) {
    logger.error('Lỗi khi lấy thống kê categories:', error);
  } finally {
    // Đóng kết nối database
    await mongoose.disconnect();
    logger.info('Đã đóng kết nối database');
    process.exit(0);
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  showCategoryStats();
}

module.exports = {
  showCategoryStats,
}; 