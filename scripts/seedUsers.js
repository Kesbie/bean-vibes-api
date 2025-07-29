const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const User = require('../src/models/user.model');

const userData = [
  {
    name: 'Công đức vô lượng',
    email: 'anhbax@gmail.com',
    password: 'L0nmemay',
    role: 'superAdmin',
    isEmailVerified: true,
    isActive: true,
    isBanned: false,
    bannedReason: '',
    favorites: []
  },
  {
    name: 'Cơm nước gì chưa',
    email: 'congducvoulung@gmail.com',
    password: 'L0nmemay',
    role: 'moderator',
    isEmailVerified: true, // Chưa xác thực email
    isActive: false, // Chưa active vì chưa xác thực email
    isBanned: false,
    bannedReason: '',
    favorites: []
  },
  {
    name: 'Lê Văn Cường',
    email: 'levancuong@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
    isActive: true,
    isBanned: true, // Bị ban
    bannedReason: 'Vi phạm quy định cộng đồng: Đăng nội dung spam và quảng cáo không được phép',
    favorites: []
  },
  {
    name: 'Phạm Thị Dung',
    email: 'phamthidung@example.com',
    password: 'password123',
    role: 'moderator', // Moderator
    isEmailVerified: true,
    isActive: true,
    isBanned: false,
    bannedReason: '',
    favorites: []
  },
  {
    name: 'Hoàng Văn Em',
    email: 'hoangvanem@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
    isActive: true,
    isBanned: false,
    bannedReason: '',
    favorites: []
  }
];

const seedUsers = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Kiểm tra xem users đã tồn tại chưa
    const existingEmails = await User.find({ 
      email: { $in: userData.map(user => user.email) } 
    }).select('email');
    
    if (existingEmails.length > 0) {
      logger.warn('Some users already exist:', existingEmails.map(u => u.email));
      
      // Lọc ra users chưa tồn tại
      const existingEmailSet = new Set(existingEmails.map(u => u.email));
      const newUsers = userData.filter(user => !existingEmailSet.has(user.email));
      
      if (newUsers.length === 0) {
        logger.info('All users already exist. No new users to add.');
        return;
      }
      
      logger.info(`Adding ${newUsers.length} new users...`);
      
      // Thêm users mới
      const users = await User.insertMany(newUsers);
      logger.info(`Successfully seeded ${users.length} new users`);
      
      // Log thống kê
      console.log('\n=== THỐNG KÊ USERS MỚI ===');
      users.forEach(user => {
        const status = user.isBanned ? 'BANNED' : 
                      !user.isEmailVerified ? 'UNVERIFIED' : 
                      !user.isActive ? 'INACTIVE' : 'ACTIVE';
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Status: ${status}`);
        if (user.isBanned && user.bannedReason) {
          console.log(`  Lý do ban: ${user.bannedReason}`);
        }
      });
      
    } else {
      // Thêm tất cả users mới
      const users = await User.insertMany(userData);
      logger.info(`Successfully seeded ${users.length} users`);
      
      // Log thống kê
      console.log('\n=== THỐNG KÊ USERS ĐÃ TẠO ===');
      users.forEach(user => {
        const status = user.isBanned ? 'BANNED' : 
                      !user.isEmailVerified ? 'UNVERIFIED' : 
                      !user.isActive ? 'INACTIVE' : 'ACTIVE';
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Status: ${status}`);
        if (user.isBanned && user.bannedReason) {
          console.log(`  Lý do ban: ${user.bannedReason}`);
        }
      });
    }

    // Thống kê tổng quan
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const moderatorUsers = await User.countDocuments({ role: 'moderator' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const superAdminUsers = await User.countDocuments({ role: 'superAdmin' });
    
    console.log('\n=== THỐNG KÊ TỔNG QUAN ===');
    console.log(`Tổng số users: ${totalUsers}`);
    console.log(`Users active: ${activeUsers}`);
    console.log(`Users đã xác thực email: ${verifiedUsers}`);
    console.log(`Users bị ban: ${bannedUsers}`);
    console.log(`Moderators: ${moderatorUsers}`);
    console.log(`Admins: ${adminUsers}`);
    console.log(`Super Admins: ${superAdminUsers}`);

  } catch (error) {
    logger.error('Error seeding users:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Chạy script
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers; 