const mongoose = require('mongoose');
const config = require('../src/config/config');
const { userService } = require('../src/services');
const logger = require('../src/config/logger');

const testAccounts = [
  {
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'User Test',
    email: 'user@test.com', 
    password: 'user123',
    role: 'user',
    isEmailVerified: true
  }
];

const createTestAccounts = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    for (const account of testAccounts) {
      const existingUser = await userService.getUserByEmail(account.email);
      
      if (existingUser) {
        logger.info(`User ${account.email} already exists, skipping...`);
        continue;
      }

      const userData = {
        name: account.name,
        email: account.email,
        password: account.password, // Không hash ở đây, User model sẽ hash
        role: account.role,
        isEmailVerified: account.isEmailVerified
      };

      const user = await userService.createUser(userData);
      logger.info(`Created ${account.role} account: ${account.email}`);
      logger.info(`Password: ${account.password}`);
    }

    logger.info('Test accounts creation completed!');
    logger.info('Admin account: admin@test.com / admin123');
    logger.info('User account: user@test.com / user123');
    
  } catch (error) {
    logger.error('Error creating test accounts:', error);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

createTestAccounts(); 