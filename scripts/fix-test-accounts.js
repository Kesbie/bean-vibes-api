const mongoose = require('mongoose');
const config = require('../src/config/config');
const { userService } = require('../src/services');
const logger = require('../src/config/logger');

const testAccounts = [
  {
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'admin1234',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'User Test',
    email: 'user@test.com', 
    password: 'user1234',
    role: 'user',
    isEmailVerified: true
  }
];

const fixTestAccounts = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Xóa các user cũ
    for (const account of testAccounts) {
      const existingUser = await userService.getUserByEmail(account.email);
      if (existingUser) {
        await userService.deleteUserById(existingUser.id);
        logger.info(`Deleted existing user: ${account.email}`);
      }
    }

    // Tạo lại test accounts
    for (const account of testAccounts) {
      const userData = {
        name: account.name,
        email: account.email,
        password: account.password, // User model sẽ hash
        role: account.role,
        isEmailVerified: account.isEmailVerified
      };

      const user = await userService.createUser(userData);
      logger.info(`Created ${account.role} account: ${account.email}`);
      logger.info(`Password: ${account.password}`);
    }

    logger.info('Test accounts fixed successfully!');
    logger.info('Admin account: admin@test.com / admin1234');
    logger.info('User account: user@test.com / user1234');
    
  } catch (error) {
    logger.error('Error fixing test accounts:', error);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

fixTestAccounts(); 