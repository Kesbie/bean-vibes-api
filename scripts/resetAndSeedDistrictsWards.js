const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const districts = require('../src/data/districts.json');
const wards = require('../src/data/wards.json');

// Import models
const District = require('../src/models/district.model');
const Ward = require('../src/models/ward.model');

// Lọc districts của Hà Nội (parent_code = '01')
const hanoiDistricts = districts.filter((district) => district.parent_code === '01');
const hanoiDistrictsData = hanoiDistricts.map((district) => ({
  name: district.name_with_type,
  slug: district.slug,
}));

// Lấy codes của districts Hà Nội để lọc wards
const hanoiDistrictCodes = hanoiDistricts.map((district) => district.code);
const hanoiWards = wards.filter((ward) => hanoiDistrictCodes.includes(ward.parent_code));

const resetAndImportDistricts = async () => {
  try {
    logger.info('Bắt đầu reset và import districts...');
    
    // Xóa tất cả districts hiện tại
    await District.deleteMany({});
    logger.info('Đã xóa tất cả districts cũ');

    // Import districts mới
    const importedDistricts = await District.insertMany(hanoiDistrictsData);
    logger.info(`Đã import thành công ${importedDistricts.length} districts`);
    return importedDistricts;
  } catch (error) {
    logger.error('Lỗi khi reset và import districts:', error);
    throw error;
  }
};

const resetAndImportWards = async (districtsData) => {
  try {
    logger.info('Bắt đầu reset và import wards...');
    
    // Xóa tất cả wards hiện tại
    await Ward.deleteMany({});
    logger.info('Đã xóa tất cả wards cũ');

    // Lấy tất cả districts từ database
    const districts = await District.find({});

    // Tạo mapping giữa district code và district ID
    const districtCodes = districtsData.map((district) => {
      const districtId = districts.find((d) => d.name === district.name_with_type);
      return {
        code: district.code,
        district_id: districtId._id,
      };
    });

    // Tạo wards với district_id
    const wardWithDistrictIds = districtCodes.reduce((acc, cur) => {
      const wards = hanoiWards
        .filter((ward) => ward.parent_code === cur.code)
        .map((ward) => {
          return {
            name: ward.name_with_type,
            slug: ward.slug,
            district_id: cur.district_id,
          };
        });
      return [...acc, ...wards];
    }, []);

    const importedWards = await Ward.insertMany(wardWithDistrictIds);
    logger.info(`Đã import thành công ${importedWards.length} wards`);
    return importedWards;
  } catch (error) {
    logger.error('Lỗi khi reset và import wards:', error);
    throw error;
  }
};

const resetAndSeedDistrictsWards = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Reset và import districts trước
    const importedDistricts = await resetAndImportDistricts();
    
    // Sau đó reset và import wards
    await resetAndImportWards(hanoiDistricts);

    logger.info('Hoàn thành reset và import districts và wards!');
    
    // Thống kê
    const totalDistricts = await District.countDocuments();
    const totalWards = await Ward.countDocuments();
    logger.info(`Tổng số districts: ${totalDistricts}`);
    logger.info(`Tổng số wards: ${totalWards}`);

  } catch (error) {
    logger.error('Lỗi trong quá trình reset và seed:', error);
  } finally {
    // Đóng kết nối database
    await mongoose.disconnect();
    logger.info('Đã đóng kết nối database');
    process.exit(0);
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  resetAndSeedDistrictsWards();
}

module.exports = {
  resetAndSeedDistrictsWards,
  resetAndImportDistricts,
  resetAndImportWards,
}; 