const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { ratingService } = require('../src/services');
const Place = require('../src/models/places.model');

/**
 * Update average ratings for all places
 */
const updateAllPlaceRatings = async () => {
  try {
    logger.info('Bắt đầu cập nhật ratings cho tất cả places...');

    // Get all places
    const places = await Place.find({});
    logger.info(`Tìm thấy ${places.length} places cần cập nhật`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const place of places) {
      try {
        logger.info(`Đang cập nhật ratings cho place: ${place.name} (${place._id})`);
        const result = await ratingService.calculateAndUpdateAverageRating(place._id);
        logger.info(`Đã cập nhật place ${place.name}: averageRating=${result.averageRating}, totalRatings=${result.totalRatings}`);
        updatedCount++;
      } catch (error) {
        logger.error(`Lỗi khi cập nhật place ${place.name}:`, error.message);
        errorCount++;
      }
    }

    logger.info(`\n=== KẾT QUẢ CẬP NHẬT ===`);
    logger.info(`- Cập nhật thành công: ${updatedCount} places`);
    logger.info(`- Lỗi: ${errorCount} places`);
    logger.info(`- Tổng số xử lý: ${places.length} places`);

  } catch (error) {
    logger.error('Lỗi script:', error);
    throw error;
  }
};

const main = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Update all place ratings
    await updateAllPlaceRatings();

    logger.info('Hoàn thành cập nhật ratings!');

  } catch (error) {
    logger.error('Lỗi trong quá trình cập nhật:', error);
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
  updateAllPlaceRatings,
  main,
}; 