const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');

// Import models
const District = require('../src/models/district.model');
const Ward = require('../src/models/ward.model');

const showStats = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Thống kê tổng quan
    const totalDistricts = await District.countDocuments();
    const totalWards = await Ward.countDocuments();
    
    logger.info('=== THỐNG KÊ DISTRICTS VÀ WARDS ===');
    logger.info(`Tổng số districts: ${totalDistricts}`);
    logger.info(`Tổng số wards: ${totalWards}`);

    if (totalDistricts > 0) {
      // Lấy danh sách districts
      const districts = await District.find({}).sort({ name: 1 });
      logger.info('\n=== DANH SÁCH DISTRICTS ===');
      districts.forEach((district, index) => {
        logger.info(`${index + 1}. ${district.name} (${district.slug})`);
      });

      // Thống kê wards theo district
      logger.info('\n=== THỐNG KÊ WARDS THEO DISTRICT ===');
      for (const district of districts) {
        const wardCount = await Ward.countDocuments({ district_id: district._id });
        logger.info(`${district.name}: ${wardCount} wards`);
      }

      // Lấy mẫu một số wards
      logger.info('\n=== MẪU WARDS ===');
      const sampleWards = await Ward.find({})
        .populate('district_id', 'name')
        .limit(10)
        .sort({ name: 1 });
      
      sampleWards.forEach((ward, index) => {
        logger.info(`${index + 1}. ${ward.name} (${ward.slug}) - ${ward.district_id.name}`);
      });

      if (totalWards > 10) {
        logger.info(`... và ${totalWards - 10} wards khác`);
      }
    } else {
      logger.info('Chưa có dữ liệu districts và wards trong database');
      logger.info('Chạy lệnh: npm run seed:districts-wards');
    }

  } catch (error) {
    logger.error('Lỗi khi lấy thống kê:', error);
  } finally {
    // Đóng kết nối database
    await mongoose.disconnect();
    logger.info('Đã đóng kết nối database');
    process.exit(0);
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  showStats();
}

module.exports = {
  showStats,
}; 