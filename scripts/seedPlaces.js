const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { placeService, categoryService } = require('../src/services');
const { categoryType } = require('../src/config/categoryType');

/**
 * Seed Places Script - Updated Version
 * 
 * Changes made:
 * 1. Uses existing placeService.createPlace() instead of direct model insertion
 * 2. Uses existing categoryService.queryCategories() to get non-region categories only
 * 3. Filters categories to exclude REGION type (only SERVICE, STYLE, PURPOSE)
 * 4. Maintains all existing place data and category mapping logic
 * 5. Better error handling for individual place creation
 */

const placeData = [
  {
    name: 'The Coffee House - Tràng Tiền',
    slug: 'the-coffee-house-trang-tien',
    description:
      'Chuỗi cà phê nổi tiếng với không gian hiện đại, view hồ Hoàn Kiếm tuyệt đẹp. Menu đa dạng từ cà phê truyền thống đến các món signature.',
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '39 Tràng Tiền, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
      location: {
        coordinates: [105.8542, 21.0285], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'TheCoffeeHouse_TrangTien',
      password: 'coffee2024',
    },
    time: {
      open: '07:00',
      close: '23:00',
    },
    price: {
      min: 30000,
      max: 70000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/thecoffeehouse',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/thecoffeehouse',
      },
    ],
    approvalStatus: 'pending',
    averageRating: 4.2,
    totalRatings: 156,
    viewCount: 1250,
    hotScore: 8.5,
    weeklyViews: 89,
    weeklyHotScore: 7.2,
  },
  {
    name: 'Highlands Coffee - Lotte Center',
    slug: 'highlands-coffee-lotte-center',
    description:
      'Cà phê Highlands với view toàn cảnh thành phố từ tầng cao Lotte Center. Không gian sang trọng, phù hợp cho các cuộc họp quan trọng.',
    photos: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: 'Lotte Center, 54 Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Hà Nội',
      location: {
        coordinates: [105.8122, 21.0369], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'Highlands_Lotte',
      password: 'highlands123',
    },
    time: {
      open: '08:00',
      close: '22:00',
    },
    price: {
      min: 35000,
      max: 80000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/highlandscoffee',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/highlandscoffee',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.0,
    totalRatings: 98,
    viewCount: 890,
    hotScore: 7.8,
    weeklyViews: 67,
    weeklyHotScore: 6.5,
  },
  {
    name: 'Cộng Cà Phê - Đinh Tiên Hoàng',
    slug: 'cong-ca-phe-dinh-tien-hoang',
    description:
      'Cà phê theo phong cách retro với không khí hoài niệm. Menu đặc trưng với cà phê sữa đá, bạc xỉu và các món ăn vặt truyền thống.',
    photos: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '27 Đinh Tiên Hoàng, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
      location: {
        coordinates: [105.8514, 21.0294], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'CongCaPhe_DinhTienHoang',
      password: 'congcaphe2024',
    },
    time: {
      open: '07:30',
      close: '23:30',
    },
    price: {
      min: 20000,
      max: 50000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/congcaphe',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/congcaphe',
      },
    ],
    isVerified: true,
    approvalStatus: 'pending',
    averageRating: 4.5,
    totalRatings: 234,
    viewCount: 2100,
    hotScore: 9.2,
    weeklyViews: 145,
    weeklyHotScore: 8.8,
  },
  {
    name: 'Phúc Long Coffee & Tea - Aeon Mall',
    slug: 'phuc-long-coffee-tea-aeon-mall',
    description:
      'Chuỗi cà phê Phúc Long với không gian rộng rãi, phù hợp cho gia đình và nhóm bạn. Nổi tiếng với trà sữa và các món ăn Á.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: 'Aeon Mall, 27 Cổ Linh, Phường Long Biên, Quận Long Biên, Hà Nội',
      location: {
        coordinates: [105.8867, 21.0478], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'PhucLong_AeonMall',
      password: 'phuclong123',
    },
    time: {
      open: '09:00',
      close: '22:00',
    },
    price: {
      min: 25000,
      max: 60000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/phuclongcoffee',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/phuclongcoffee',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.1,
    totalRatings: 87,
    viewCount: 756,
    hotScore: 7.1,
    weeklyViews: 52,
    weeklyHotScore: 6.2,
  },
  {
    name: 'Gong Cha - Royal City',
    slug: 'gong-cha-royal-city',
    description:
      'Chuỗi trà sữa Gong Cha với không gian hiện đại, phù hợp cho giới trẻ. Menu đa dạng với các loại trà sữa và topping phong phú.',
    photos: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: 'Royal City, 72A Nguyễn Trãi, Phường Thanh Xuân Nam, Quận Thanh Xuân, Hà Nội',
      location: {
        coordinates: [105.8165, 21.0015], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'GongCha_RoyalCity',
      password: 'gongcha2024',
    },
    time: {
      open: '10:00',
      close: '22:00',
    },
    price: {
      min: 20000,
      max: 50000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/gongcha',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/gongcha',
      },
    ],
    isVerified: true,
    approvalStatus: 'rejected',
    averageRating: 4.3,
    totalRatings: 123,
    viewCount: 987,
    hotScore: 8.1,
    weeklyViews: 78,
    weeklyHotScore: 7.5,
  },
  {
    name: 'Starbucks - Vincom Center',
    slug: 'starbucks-vincom-center',
    description:
      'Starbucks với không gian sang trọng, phù hợp cho công việc và gặp gỡ. Menu quốc tế với các loại cà phê đặc biệt.',
    photos: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: 'Vincom Center, 191 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội',
      location: {
        coordinates: [105.8435, 21.0089], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'Starbucks_Vincom',
      password: 'starbucks123',
    },
    time: {
      open: '07:00',
      close: '23:00',
    },
    price: {
      min: 50000,
      max: 100000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/starbucks',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/starbucks',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.4,
    totalRatings: 189,
    viewCount: 1650,
    hotScore: 8.8,
    weeklyViews: 112,
    weeklyHotScore: 8.1,
  },
  {
    name: 'Cà Phê Trung Nguyên - Times City',
    slug: 'ca-phe-trung-nguyen-times-city',
    description:
      'Cà phê Trung Nguyên với không gian truyền thống, phù hợp cho việc thưởng thức cà phê đích thực. Menu đặc trưng với các loại cà phê Việt Nam.',
    photos: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: 'Times City, 458 Minh Khai, Phường Vĩnh Tuy, Quận Hai Bà Trưng, Hà Nội',
      location: {
        coordinates: [105.8645, 20.9989], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'TrungNguyen_TimesCity',
      password: 'trungnguyen2024',
    },
    time: {
      open: '08:00',
      close: '22:30',
    },
    price: {
      min: 25000,
      max: 60000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/trungnguyencoffee',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/trungnguyencoffee',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.0,
    totalRatings: 76,
    viewCount: 654,
    hotScore: 6.9,
    weeklyViews: 45,
    weeklyHotScore: 6.1,
  },
  {
    name: 'Cà Phê Sài Gòn - Đống Đa',
    slug: 'ca-phe-sai-gon-dong-da',
    description:
      'Cà phê Sài Gòn với không gian ấm cúng, phù hợp cho việc thư giãn và đọc sách. Menu đặc trưng với cà phê sữa đá và các món ăn vặt.',
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '45 Tôn Đức Thắng, Phường Hàng Bột, Quận Đống Đa, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8345, 21.0189], // [longitude, latitude]
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheSaiGon_DongDa',
      password: 'saigon2024',
    },
    time: {
      open: '07:00',
      close: '23:00',
    },
    price: {
      min: 20000,
      max: 45000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphesaigon',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/caphesaigon',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.6,
    totalRatings: 198,
    viewCount: 1780,
    hotScore: 9.0,
    weeklyViews: 134,
    weeklyHotScore: 8.5,
  },
  // 20 địa điểm mới ở Hà Nội
  {
    name: 'Cà Phê Giảng - Nguyễn Hữu Huân',
    slug: 'ca-phe-giang-nguyen-huu-huan',
    description:
      'Cà phê trứng nổi tiếng Hà Nội với công thức gia truyền. Không gian ấm cúng, phù hợp cho việc thưởng thức cà phê truyền thống.',
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '39 Nguyễn Hữu Huân, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8512, 21.0298],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheGiang_HangBac',
      password: 'giang2024',
    },
    time: {
      open: '07:00',
      close: '22:00',
    },
    price: {
      min: 15000,
      max: 35000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphegiang',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.7,
    totalRatings: 342,
    viewCount: 2890,
    hotScore: 9.5,
    weeklyViews: 201,
    weeklyHotScore: 9.2,
  },
  {
    name: 'Cà Phê Duy Trí - Hàng Gai',
    slug: 'ca-phe-duy-tri-hang-gai',
    description: 'Cà phê phin truyền thống với không gian cổ kính. Nổi tiếng với cà phê đen và cà phê sữa đá đậm đà.',
    photos: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '13 Hàng Gai, Phường Hàng Gai, Quận Hoàn Kiếm, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8489, 21.0312],
      },
    },
    status: 'active',
    wifi: {
      name: 'DuyTri_HangGai',
      password: 'duytri123',
    },
    time: {
      open: '06:30',
      close: '23:00',
    },
    price: {
      min: 12000,
      max: 25000,
    },
    socials: [],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.3,
    totalRatings: 189,
    viewCount: 1567,
    hotScore: 8.1,
    weeklyViews: 98,
    weeklyHotScore: 7.8,
  },
  {
    name: 'Cà Phê Lâm - Nguyễn Hữu Huân',
    slug: 'ca-phe-lam-nguyen-huu-huan',
    description: 'Cà phê Lâm với không gian retro độc đáo. Nổi tiếng với cà phê đen và không khí hoài niệm.',
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '91 Nguyễn Hữu Huân, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8518, 21.0295],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheLam_HangBac',
      password: 'lam2024',
    },
    time: {
      open: '07:00',
      close: '22:30',
    },
    price: {
      min: 15000,
      max: 30000,
    },
    socials: [],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.4,
    totalRatings: 267,
    viewCount: 2234,
    hotScore: 8.7,
    weeklyViews: 156,
    weeklyHotScore: 8.3,
  },
  {
    name: 'Cà Phê Nâu - Tạ Hiện',
    slug: 'ca-phe-nau-ta-hien',
    description: 'Cà phê nâu với không gian nhỏ xinh, phù hợp cho việc thư giãn. Menu đơn giản nhưng chất lượng.',
    photos: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    ],
    address: {
      street: '12 Tạ Hiện',
      ward: 'Phường Hàng Buồm',
      district: 'Hoàn Kiếm',
      fullAddress: '12 Tạ Hiện, Phường Hàng Buồm, Quận Hoàn Kiếm, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8498, 21.0301],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheNau_TaHien',
      password: 'nau2024',
    },
    time: {
      open: '08:00',
      close: '23:00',
    },
    price: {
      min: 20000,
      max: 40000,
    },
    socials: [
      {
        type: 'instagram',
        url: 'https://instagram.com/caphenau',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.2,
    totalRatings: 134,
    viewCount: 987,
    hotScore: 7.5,
    weeklyViews: 67,
    weeklyHotScore: 7.1,
  },
  {
    name: 'Cà Phê Thứ 7 - Hàng Bông',
    slug: 'ca-phe-thu-7-hang-bong',
    description: 'Cà phê với không gian sân thượng view đẹp. Phù hợp cho các buổi tối cuối tuần.',
    photos: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
    ],
    address: {
      street: '25 Hàng Bông',
      ward: 'Phường Hàng Gai',
      district: 'Hoàn Kiếm',
      fullAddress: '25 Hàng Bông, Phường Hàng Gai, Quận Hoàn Kiếm, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8475, 21.0321],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheThu7_HangBong',
      password: 'thu72024',
    },
    time: {
      open: '09:00',
      close: '23:00',
    },
    price: {
      min: 25000,
      max: 55000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphethu7',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/caphethu7',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.1,
    totalRatings: 89,
    viewCount: 654,
    hotScore: 6.8,
    weeklyViews: 45,
    weeklyHotScore: 6.2,
  },
  {
    name: 'Cà Phê Sách - Đinh Lễ',
    slug: 'ca-phe-sach-dinh-le',
    description: 'Cà phê kết hợp với thư viện sách. Không gian yên tĩnh, phù hợp cho việc đọc sách và làm việc.',
    photos: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    ],
    address: {
      street: '8 Đinh Lễ',
      ward: 'Phường Tràng Tiền',
      district: 'Hoàn Kiếm',
      fullAddress: '8 Đinh Lễ, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8521, 21.0278],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheSach_DinhLe',
      password: 'sach2024',
    },
    time: {
      open: '08:00',
      close: '22:00',
    },
    price: {
      min: 30000,
      max: 65000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphesach',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.5,
    totalRatings: 178,
    viewCount: 1456,
    hotScore: 8.3,
    weeklyViews: 112,
    weeklyHotScore: 7.9,
  },
  {
    name: 'Cà Phê Vườn - Tây Hồ',
    slug: 'ca-phe-vuon-tay-ho',
    description: 'Cà phê với không gian vườn xanh mát. View hồ Tây tuyệt đẹp, phù hợp cho các buổi sáng và chiều.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    address: {
      street: '45 Xuân La',
      ward: 'Phường Xuân La',
      district: 'Tây Hồ',
      fullAddress: '45 Xuân La, Phường Xuân La, Quận Tây Hồ, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8123, 21.0689],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheVuon_TayHo',
      password: 'vuon2024',
    },
    time: {
      open: '07:00',
      close: '22:00',
    },
    price: {
      min: 35000,
      max: 75000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphevuon',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/caphevuon',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.6,
    totalRatings: 234,
    viewCount: 1987,
    hotScore: 9.1,
    weeklyViews: 167,
    weeklyHotScore: 8.7,
  },
  {
    name: 'Cà Phê Mây - Ba Đình',
    slug: 'ca-phe-may-ba-dinh',
    description: 'Cà phê với không gian hiện đại, view thành phố từ tầng cao. Phù hợp cho các cuộc họp và gặp gỡ.',
    photos: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '12 Nguyễn Chí Thanh, Phường Ngọc Khánh, Quận Ba Đình, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8145, 21.0356],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheMay_BaDinh',
      password: 'may2024',
    },
    time: {
      open: '08:00',
      close: '23:00',
    },
    price: {
      min: 40000,
      max: 85000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphemay',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/caphemay',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.3,
    totalRatings: 156,
    viewCount: 1234,
    hotScore: 7.9,
    weeklyViews: 89,
    weeklyHotScore: 7.4,
  },
  {
    name: 'Cà Phê Đá - Cầu Giấy',
    slug: 'ca-phe-da-cau-giay',
    description: 'Cà phê đá với không gian mát mẻ, phù hợp cho mùa hè. Menu đa dạng với các loại cà phê đá.',
    photos: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '78 Xuân Thủy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.7823, 21.0367],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheDa_CauGiay',
      password: 'da2024',
    },
    time: {
      open: '07:30',
      close: '22:30',
    },
    price: {
      min: 20000,
      max: 45000,
    },
    socials: [
      {
        type: 'instagram',
        url: 'https://instagram.com/capheda',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.0,
    totalRatings: 98,
    viewCount: 756,
    hotScore: 6.5,
    weeklyViews: 52,
    weeklyHotScore: 6.1,
  },
  {
    name: 'Cà Phê Sương - Đống Đa',
    slug: 'ca-phe-suong-dong-da',
    description: 'Cà phê sương với không gian ấm cúng, phù hợp cho các buổi sáng sớm. Nổi tiếng với cà phê sữa đá.',
    photos: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '34 Tôn Đức Thắng, Phường Hàng Bột, Quận Đống Đa, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8356, 21.0198],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheSuong_DongDa',
      password: 'suong2024',
    },
    time: {
      open: '06:00',
      close: '22:00',
    },
    price: {
      min: 15000,
      max: 35000,
    },
    socials: [],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.4,
    totalRatings: 189,
    viewCount: 1456,
    hotScore: 8.2,
    weeklyViews: 112,
    weeklyHotScore: 7.8,
  },
  {
    name: 'Cà Phê Hoa - Hai Bà Trưng',
    slug: 'ca-phe-hoa-hai-ba-trung',
    description: 'Cà phê với không gian trang trí hoa đẹp mắt. Phù hợp cho các buổi hẹn lãng mạn.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '156 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8445, 21.0098],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheHoa_HaiBaTrung',
      password: 'hoa2024',
    },
    time: {
      open: '08:00',
      close: '23:00',
    },
    price: {
      min: 30000,
      max: 65000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphehoa',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/caphehoa',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.2,
    totalRatings: 134,
    viewCount: 987,
    hotScore: 7.3,
    weeklyViews: 67,
    weeklyHotScore: 6.9,
  },
  {
    name: 'Cà Phê Nắng - Thanh Xuân',
    slug: 'ca-phe-nang-thanh-xuan',
    description: 'Cà phê với không gian nhiều ánh sáng tự nhiên. Phù hợp cho việc làm việc và học tập.',
    photos: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '89 Nguyễn Trãi, Phường Thanh Xuân Nam, Quận Thanh Xuân, Hà Nội',
      coordinates: {
        type: 'Point',
        coordinates: [105.8178, 21.0023],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheNang_ThanhXuan',
      password: 'nang2024',
    },
    time: {
      open: '07:00',
      close: '22:00',
    },
    price: {
      min: 25000,
      max: 55000,
    },
    socials: [
      {
        type: 'instagram',
        url: 'https://instagram.com/caphenang',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.1,
    totalRatings: 98,
    viewCount: 756,
    hotScore: 6.8,
    weeklyViews: 52,
    weeklyHotScore: 6.4,
  },
  {
    name: 'Cà Phê Mưa - Long Biên',
    slug: 'ca-phe-mua-long-bien',
    description: 'Cà phê với không gian ấm cúng, phù hợp cho những ngày mưa. Menu đa dạng với các món ấm.',
    photos: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '45 Nguyễn Văn Cừ, Phường Long Biên, Quận Long Biên, Hà Nội',
      location: {
        coordinates: [105.8765, 21.0489],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheMua_LongBien',
      password: 'mua2024',
    },
    time: {
      open: '08:00',
      close: '22:30',
    },
    price: {
      min: 20000,
      max: 45000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphemua',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.0,
    totalRatings: 87,
    viewCount: 654,
    hotScore: 6.2,
    weeklyViews: 45,
    weeklyHotScore: 5.9,
  },
  {
    name: 'Cà Phê Gió - Hoàng Mai',
    slug: 'ca-phe-gio-hoang-mai',
    description: 'Cà phê với không gian thoáng mát, nhiều gió. Phù hợp cho các buổi chiều mát.',
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '67 Linh Đường, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội',
      location: {
        coordinates: [105.8234, 20.9876],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheGio_HoangMai',
      password: 'gio2024',
    },
    time: {
      open: '07:30',
      close: '22:00',
    },
    price: {
      min: 18000,
      max: 40000,
    },
    socials: [
      {
        type: 'instagram',
        url: 'https://instagram.com/caphegio',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.3,
    totalRatings: 123,
    viewCount: 876,
    hotScore: 7.1,
    weeklyViews: 67,
    weeklyHotScore: 6.7,
  },
  {
    name: 'Cà Phê Lá - Hà Đông',
    slug: 'ca-phe-la-ha-dong',
    description: 'Cà phê với không gian xanh mát, nhiều cây lá. Phù hợp cho việc thư giãn và tận hưởng thiên nhiên.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '23 Quang Trung, Phường Quang Trung, Quận Hà Đông, Hà Nội',
      location: {
        coordinates: [105.7789, 20.9678],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheLa_HaDong',
      password: 'la2024',
    },
    time: {
      open: '08:00',
      close: '22:00',
    },
    price: {
      min: 22000,
      max: 48000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphela',
      },
      {
        type: 'instagram',
        url: 'https://instagram.com/caphela',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.2,
    totalRatings: 156,
    viewCount: 1123,
    hotScore: 7.8,
    weeklyViews: 89,
    weeklyHotScore: 7.4,
  },
  {
    name: 'Cà Phê Đá - Nam Từ Liêm',
    slug: 'ca-phe-da-nam-tu-liem',
    description: 'Cà phê đá với không gian hiện đại, phù hợp cho giới trẻ. Menu đa dạng với các loại cà phê đá.',
    photos: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '89 Phạm Văn Bạch, Phường Yên Hòa, Quận Nam Từ Liêm, Hà Nội',
      location: {
        coordinates: [105.7898, 21.0123],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheDa_NamTuLiem',
      password: 'da2024',
    },
    time: {
      open: '08:30',
      close: '22:30',
    },
    price: {
      min: 25000,
      max: 55000,
    },
    socials: [
      {
        type: 'instagram',
        url: 'https://instagram.com/capheda',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.1,
    totalRatings: 98,
    viewCount: 756,
    hotScore: 6.9,
    weeklyViews: 54,
    weeklyHotScore: 6.5,
  },
  {
    name: 'Cà Phê Sương - Bắc Từ Liêm',
    slug: 'ca-phe-suong-bac-tu-liem',
    description: 'Cà Phê Sương với không gian ấm cúng, phù hợp cho các buổi sáng sớm. Nổi tiếng với cà phê sữa đá.',
    photos: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '34 Phú Diễn, Phường Phú Diễn, Quận Bắc Từ Liêm, Hà Nội',
      location: {
        coordinates: [105.7654, 21.0789],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheSuong_BacTuLiem',
      password: 'suong2024',
    },
    time: {
      open: '07:00',
      close: '22:00',
    },
    price: {
      min: 20000,
      max: 45000,
    },
    socials: [],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.0,
    totalRatings: 87,
    viewCount: 654,
    hotScore: 6.3,
    weeklyViews: 45,
    weeklyHotScore: 6.0,
  },
  {
    name: 'Cà Phê Hoa - Sóc Sơn',
    slug: 'ca-phe-hoa-soc-son',
    description: 'Cà phê với không gian trang trí hoa đẹp mắt. Phù hợp cho các buổi hẹn lãng mạn.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '12 Trung Giã, Thị trấn Sóc Sơn, Huyện Sóc Sơn, Hà Nội',
      location: {
        coordinates: [105.7234, 21.2567],
      },
    },
    status: 'active',
    wifi: {
      name: 'CaPheHoa_SocSon',
      password: 'hoa2024',
    },
    time: {
      open: '08:00',
      close: '21:00',
    },
    price: {
      min: 15000,
      max: 35000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphehoa',
      },
    ],
    isVerified: true,
    approvalStatus: 'approved',
    averageRating: 4.2,
    totalRatings: 67,
    viewCount: 456,
    hotScore: 5.8,
    weeklyViews: 34,
    weeklyHotScore: 5.5,
  },
  // 3 địa điểm đang chờ duyệt
  {
    name: 'Cà Phê Mới - Hoàn Kiếm',
    slug: 'ca-phe-moi-hoan-kiem',
    description: 'Cà phê mới mở với không gian hiện đại, phù hợp cho giới trẻ. Menu đa dạng với các loại cà phê mới.',
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '15 Hàng Gai, Phường Hàng Gai, Quận Hoàn Kiếm, Hà Nội',
      location: {
        coordinates: [105.8485, 21.0315],
      },
    },
    status: 'inactive',
    wifi: {
      name: 'CaPheMoi_HoanKiem',
      password: 'moi2024',
    },
    time: {
      open: '08:00',
      close: '22:00',
    },
    price: {
      min: 25000,
      max: 55000,
    },
    socials: [
      {
        type: 'instagram',
        url: 'https://instagram.com/caphemoi',
      },
    ],
    isVerified: false,
    approvalStatus: 'pending',
    averageRating: 0,
    totalRatings: 0,
    viewCount: 0,
    hotScore: 0,
    weeklyViews: 0,
    weeklyHotScore: 0,
  },
  {
    name: 'Cà Phê Test - Ba Đình',
    slug: 'ca-phe-test-ba-dinh',
    description: 'Cà phê test với không gian thử nghiệm. Phù hợp cho việc thử nghiệm các loại cà phê mới.',
    photos: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '78 Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Hà Nội',
      location: {
        coordinates: [105.8134, 21.0378],
      },
    },
    status: 'inactive',
    wifi: {
      name: 'CaPheTest_BaDinh',
      password: 'test2024',
    },
    time: {
      open: '09:00',
      close: '21:00',
    },
    price: {
      min: 20000,
      max: 45000,
    },
    socials: [],
    isVerified: false,
    approvalStatus: 'pending',
    averageRating: 0,
    totalRatings: 0,
    viewCount: 0,
    hotScore: 0,
    weeklyViews: 0,
    weeklyHotScore: 0,
  },
  {
    name: 'Cà Phê Demo - Cầu Giấy',
    slug: 'ca-phe-demo-cau-giay',
    description: 'Cà phê demo với không gian trình diễn. Phù hợp cho việc giới thiệu các sản phẩm mới.',
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    ],
    address: {
      fullAddress: '45 Xuân Thủy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
      location: {
        coordinates: [105.7834, 21.0378],
      },
    },
    status: 'inactive',
    wifi: {
      name: 'CaPheDemo_CauGiay',
      password: 'demo2024',
    },
    time: {
      open: '08:30',
      close: '21:30',
    },
    price: {
      min: 30000,
      max: 65000,
    },
    socials: [
      {
        type: 'facebook',
        url: 'https://facebook.com/caphedemo',
      },
    ],
    isVerified: false,
    approvalStatus: 'pending',
    averageRating: 0,
    totalRatings: 0,
    viewCount: 0,
    hotScore: 0,
    weeklyViews: 0,
    weeklyHotScore: 0,
  },
  // 1 địa điểm bị từ chối
  {
    name: 'Cà Phê Spam - Đống Đa',
    slug: 'ca-phe-spam-dong-da',
    description: 'Cà phê spam với thông tin không chính xác. Địa chỉ và thông tin liên hệ không hợp lệ.',
    photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop'],
    address: {
      fullAddress: '123 Đường Không Tồn Tại, Phường Không Có, Quận Đống Đa, Hà Nội',
      location: {
        coordinates: [105.8345, 21.0189],
      },
    },
    status: 'inactive',
    wifi: {
      name: 'CaPheSpam_DongDa',
      password: 'spam2024',
    },
    time: {
      open: '00:00',
      close: '24:00',
    },
    price: {
      min: 0,
      max: 0,
    },
    socials: [],
    isVerified: false,
    approvalStatus: 'rejected',
    rejectionReason:
      'Thông tin địa chỉ không chính xác, số điện thoại không hợp lệ, và thông tin mô tả không đầy đủ. Địa điểm này có vẻ như là spam hoặc thông tin giả mạo.',
    averageRating: 0,
    totalRatings: 0,
    viewCount: 0,
    hotScore: 0,
    weeklyViews: 0,
    weeklyHotScore: 0,
  },
];

const seedPlaces = async () => {
  try {
    // Kết nối database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Lấy danh sách categories không phải region để gán ngẫu nhiên
    const categories = await categoryService.queryCategories(
      { type: { $ne: categoryType.REGION } },
      { limit: 100 }
    );
    
    if (categories.results.length === 0) {
      logger.warn('No non-region categories found. Please run seed:categories first.');
      return;
    }

    // Xóa dữ liệu cũ (tùy chọn)
    // Note: Using service would require admin privileges, so we'll use direct model access for cleanup
    const Place = require('../src/models/places.model');
    await Place.deleteMany({});
    logger.info('Cleared existing places');

    // Mapping logic để gán category phù hợp cho từng place
    const getCategoriesForPlace = (place) => {
      const selectedCategories = [];

      // SERVICE: Dựa vào đặc điểm của place
      if (place.name.includes('Starbucks') || place.name.includes('Highlands') || place.name.includes('The Coffee House')) {
        // Chuỗi lớn thường có đầy đủ dịch vụ
        const takeaway = categories.results.find((cat) => cat.type === 'service' && cat.name === 'Takeaway');
        const dineIn = categories.results.find((cat) => cat.type === 'service' && cat.name === 'Dine-in');
        const delivery = categories.results.find((cat) => cat.type === 'service' && cat.name === 'Delivery');
        if (takeaway) selectedCategories.push(takeaway);
        if (dineIn) selectedCategories.push(dineIn);
        if (delivery) selectedCategories.push(delivery);
      } else if (place.name.includes('Cộng Cà Phê') || place.name.includes('Phúc Long')) {
        // Chuỗi vừa
        const takeaway = categories.results.find((cat) => cat.type === 'service' && cat.name === 'Takeaway');
        const dineIn = categories.results.find((cat) => cat.type === 'service' && cat.name === 'Dine-in');
        if (takeaway) selectedCategories.push(takeaway);
        if (dineIn) selectedCategories.push(dineIn);
      } else {
        // Quán nhỏ
        const dineIn = categories.results.find((cat) => cat.type === 'service' && cat.name === 'Dine-in');
        if (dineIn) selectedCategories.push(dineIn);
      }

      // STYLE: Dựa vào mô tả và tên
      if (place.description.includes('hiện đại') || place.name.includes('Starbucks') || place.name.includes('Highlands')) {
        const modern = categories.results.find((cat) => cat.type === 'style' && cat.name === 'Hiện đại');
        if (modern) selectedCategories.push(modern);
      } else if (
        place.description.includes('retro') ||
        place.description.includes('hoài niệm') ||
        place.name.includes('Cộng Cà Phê')
      ) {
        const vintage = categories.results.find((cat) => cat.type === 'style' && cat.name === 'Vintage');
        if (vintage) selectedCategories.push(vintage);
      } else if (
        place.description.includes('vườn') ||
        place.description.includes('xanh') ||
        place.description.includes('thiên nhiên')
      ) {
        const nature = categories.results.find((cat) => cat.type === 'style' && cat.name === 'Thiên nhiên');
        if (nature) selectedCategories.push(nature);
      } else if (place.description.includes('công nghiệp') || place.description.includes('industrial')) {
        const industrial = categories.results.find((cat) => cat.type === 'style' && cat.name === 'Công nghiệp');
        if (industrial) selectedCategories.push(industrial);
      } else {
        // Mặc định
        const modern = categories.results.find((cat) => cat.type === 'style' && cat.name === 'Hiện đại');
        if (modern) selectedCategories.push(modern);
      }

      // PURPOSE: Dựa vào mô tả và đặc điểm
      if (place.description.includes('làm việc') || place.description.includes('học tập') || place.name.includes('Sách')) {
        const work = categories.results.find((cat) => cat.type === 'purpose' && cat.name === 'Làm việc');
        if (work) selectedCategories.push(work);
      } else if (
        place.description.includes('hẹn hò') ||
        place.description.includes('lãng mạn') ||
        place.description.includes('hoa')
      ) {
        const dating = categories.results.find((cat) => cat.type === 'purpose' && cat.name === 'Hẹn hò');
        if (dating) selectedCategories.push(dating);
      } else if (
        place.description.includes('gặp gỡ') ||
        place.description.includes('nhóm bạn') ||
        place.description.includes('đối tác')
      ) {
        const meeting = categories.results.find((cat) => cat.type === 'purpose' && cat.name === 'Gặp gỡ');
        if (meeting) selectedCategories.push(meeting);
      } else if (
        place.description.includes('thư giãn') ||
        place.description.includes('đọc sách') ||
        place.description.includes('yên tĩnh')
      ) {
        const relax = categories.results.find((cat) => cat.type === 'purpose' && cat.name === 'Thư giãn');
        if (relax) selectedCategories.push(relax);
      } else {
        // Mặc định
        const meeting = categories.results.find((cat) => cat.type === 'purpose' && cat.name === 'Gặp gỡ');
        if (meeting) selectedCategories.push(meeting);
      }

      // Lọc bỏ các category undefined và chỉ lấy _id
      return selectedCategories.filter((cat) => cat).map((cat) => cat._id);
    };

    // Thêm categories cho mỗi place
    const placesWithCategories = placeData.map((place) => {
      const selectedCategories = getCategoriesForPlace(place);

      return {
        ...place,
        categories: selectedCategories,
      };
    });

    // Thêm dữ liệu mới sử dụng place service
    const places = [];
    for (const placeData of placesWithCategories) {
      try {
        const place = await placeService.createPlace(placeData);
        places.push(place);
        logger.info(`Created place: ${place.name}`);
      } catch (error) {
        logger.error(`Failed to create place ${placeData.name}:`, error.message);
      }
    }
    logger.info(`Successfully seeded ${places.length} places`);

    // Log thống kê
    const totalViews = places.reduce((sum, place) => sum + place.viewCount, 0);
    const avgRating = places.reduce((sum, place) => sum + place.averageRating, 0) / places.length;

    logger.info('Place seeding statistics:', {
      totalPlaces: places.length,
      totalViews,
      averageRating: avgRating.toFixed(2),
      priceRange: `${Math.min(...places.map((p) => p.price))}-${Math.max(...places.map((p) => p.price))}`,
    });

    // Hiển thị danh sách places đã tạo với categories
    console.log('\n=== DANH SÁCH PLACES ĐÃ TẠO ===');
    places.forEach((place) => {
      const placeCategories = place.categories.map((catId) => {
        const category = categories.results.find((cat) => cat._id.toString() === catId.toString());
        return category ? `${category.name} (${category.type})` : 'Unknown';
      });
      console.log(`- ${place.name} (${place.address.district}) - Rating: ${place.averageRating}/5`);
      console.log(`  Categories: ${placeCategories.join(', ')}`);
    });
  } catch (error) {
    logger.error('Error seeding places:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Chạy script
if (require.main === module) {
  seedPlaces();
}

module.exports = seedPlaces;
