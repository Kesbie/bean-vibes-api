const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { viewTrackingService } = require('../src/services');

const updateHotScores = async () => {
  try {
    logger.info('Bắt đầu cập nhật hot scores cho tất cả places...');
    
    // Update hot scores
    await viewTrackingService.updateAllHotScores();
    logger.info('Hot scores đã được cập nhật thành công!');

  } catch (error) {
    logger.error('Lỗi khi cập nhật hot scores:', error);
    throw error;
  }
};

const main = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Update hot scores
    await updateHotScores();

    logger.info('Hoàn thành cập nhật hot scores!');

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
  updateHotScores,
  main,
}; 