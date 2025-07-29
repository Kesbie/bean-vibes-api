const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { RestrictedWord } = require('../src/models');
const { RESTRICTED_WORD_TYPES } = require('../src/constants/restrictedWordTypes');

const sampleRestrictedWords = [
  // Banned words - không cho phép tạo place
  { word: 'địt', normalizedWord: 'dit', replacement: '***', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'đụ', normalizedWord: 'du', replacement: '***', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'lồn', normalizedWord: 'lon', replacement: '***', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'cặc', normalizedWord: 'cac', replacement: '***', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'đcm', normalizedWord: 'dcm', replacement: '***', type: RESTRICTED_WORD_TYPES.BAN },
  
  // Warning words - thay thế bằng dấu *
  { word: 'đéo', normalizedWord: 'deo', replacement: 'đ**', type: RESTRICTED_WORD_TYPES.WARN },
  { word: 'đm', normalizedWord: 'dm', replacement: 'đ*', type: RESTRICTED_WORD_TYPES.WARN },
  { word: 'clm', normalizedWord: 'clm', replacement: 'cl*', type: RESTRICTED_WORD_TYPES.WARN },
  { word: 'cl', normalizedWord: 'cl', replacement: 'cl*', type: RESTRICTED_WORD_TYPES.WARN },
  
  // Hide words - ẩn hoàn toàn
  { word: 'sex', normalizedWord: 'sex', replacement: '***', type: RESTRICTED_WORD_TYPES.HIDE },
  { word: 'porn', normalizedWord: 'porn', replacement: '***', type: RESTRICTED_WORD_TYPES.HIDE },
  { word: 'xxx', normalizedWord: 'xxx', replacement: '***', type: RESTRICTED_WORD_TYPES.HIDE },
];

const resetRestrictedWords = async () => {
  try {
    logger.info('Bắt đầu reset restricted words...');

    // Xóa tất cả restricted words hiện tại
    const deleteResult = await RestrictedWord.deleteMany({});
    logger.info(`Đã xóa ${deleteResult.deletedCount} restricted words cũ`);

    // Insert sample restricted words
    const insertedWords = await RestrictedWord.insertMany(sampleRestrictedWords);
    logger.info(`Đã tạo ${insertedWords.length} restricted words mới`);

    // Hiển thị danh sách words đã tạo
    logger.info('\n=== DANH SÁCH RESTRICTED WORDS ĐÃ TẠO ===');
    insertedWords.forEach((word, index) => {
      logger.info(`${index + 1}. ${word.word} (${word.type})`);
    });

    // Thống kê theo type
    logger.info('\n=== THỐNG KÊ THEO TYPE ===');
    const banCount = insertedWords.filter(w => w.type === RESTRICTED_WORD_TYPES.BAN).length;
    const warnCount = insertedWords.filter(w => w.type === RESTRICTED_WORD_TYPES.WARN).length;
    const hideCount = insertedWords.filter(w => w.type === RESTRICTED_WORD_TYPES.HIDE).length;
    
    logger.info(`BAN (cấm): ${banCount} words`);
    logger.info(`WARN (cảnh báo): ${warnCount} words`);
    logger.info(`HIDE (ẩn): ${hideCount} words`);

    return insertedWords;
  } catch (error) {
    logger.error('Lỗi khi reset restricted words:', error);
    throw error;
  }
};

const main = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Đã kết nối database thành công');

    // Reset restricted words
    await resetRestrictedWords();

    logger.info('Hoàn thành reset restricted words!');

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
  resetRestrictedWords,
  main,
}; 