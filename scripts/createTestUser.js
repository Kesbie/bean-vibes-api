const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const User = require('../src/models/user.model');

const createTestUser = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Tạo user test mới
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      isEmailVerified: true,
      isActive: true,
      isBanned: false,
      bannedReason: '',
      favorites: []
    };

    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      logger.info('Test user already exists, updating password...');
      existingUser.password = testUser.password;
      await existingUser.save();
      logger.info('Test user password updated successfully');
    } else {
      logger.info('Creating new test user...');
      const user = await User.create(testUser);
      logger.info(`Test user created successfully: ${user.email}`);
    }

    // Log thông tin user
    const user = await User.findOne({ email: testUser.email });
    console.log('\n=== TEST USER INFO ===');
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${testUser.password}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.isActive ? 'ACTIVE' : 'INACTIVE'}`);

  } catch (error) {
    logger.error('Error creating test user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Chạy script
if (require.main === module) {
  createTestUser();
}

module.exports = createTestUser; 