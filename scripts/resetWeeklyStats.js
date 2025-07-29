const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { viewTrackingService } = require('../src/services');

const resetWeeklyStats = async () => {
  try {
    logger.info('Bắt đầu reset weekly stats...');
    
    // Reset weekly stats
    await viewTrackingService.resetWeeklyStats();
    logger.info('Weekly stats đã được reset thành công!');

  } catch (error) {
    logger.error('Lỗi khi reset weekly stats:', error);
    throw error;
  }
};

const main = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Reset weekly stats
    await resetWeeklyStats();

    logger.info('Hoàn thành reset weekly stats!');

  } catch (error) {
    logger.error('Lỗi trong quá trình reset:', error);
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
  resetWeeklyStats,
  main,
}; 