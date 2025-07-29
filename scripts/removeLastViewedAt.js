const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const Place = require('../src/models/places.model');

const removeLastViewedAt = async () => {
  try {
    logger.info('Bắt đầu xóa trường lastViewedAt khỏi tất cả place documents...');

    // Xóa trường lastViewedAt khỏi tất cả documents
    const result = await Place.updateMany(
      { lastViewedAt: { $exists: true } },
      { $unset: { lastViewedAt: 1 } }
    );

    logger.info(`Đã xóa trường lastViewedAt khỏi ${result.modifiedCount} place documents`);

    // Kiểm tra xem còn documents nào có trường lastViewedAt không
    const remainingDocs = await Place.countDocuments({ lastViewedAt: { $exists: true } });
    
    if (remainingDocs === 0) {
      logger.info('✅ Hoàn thành: Tất cả place documents đã được cập nhật');
    } else {
      logger.warn(`⚠️  Còn ${remainingDocs} documents có trường lastViewedAt`);
    }

    // Thống kê tổng quan
    const totalPlaces = await Place.countDocuments();
    logger.info(`\n=== THỐNG KÊ ===`);
    logger.info(`Tổng số places: ${totalPlaces}`);
    logger.info(`Places đã cập nhật: ${result.modifiedCount}`);

    return result;
  } catch (error) {
    logger.error('Lỗi khi xóa trường lastViewedAt:', error);
    throw error;
  }
};

const main = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Xóa trường lastViewedAt
    await removeLastViewedAt();

    logger.info('Hoàn thành xóa trường lastViewedAt!');

  } catch (error) {
    logger.error('Lỗi trong quá trình xử lý:', error);
  } finally {
    // Đóng kết nối database
    await mongoose.disconnect();
    logger.info('Đã đóng kết nối database');
    process.exit(0);
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  main();
}

module.exports = {
  removeLastViewedAt,
  main,
}; 