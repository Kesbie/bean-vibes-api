require('dotenv').config();

console.log('🔍 Cloudinary Configuration Debug');
console.log('================================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ NOT SET');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set (length: ' + process.env.CLOUDINARY_API_KEY.length + ')' : '❌ NOT SET');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set (length: ' + process.env.CLOUDINARY_API_SECRET.length + ')' : '❌ NOT SET');

// Check if .env file exists
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('\n📁 .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasCloudinaryVars = envContent.includes('CLOUDINARY_');
  console.log('Contains Cloudinary variables:', hasCloudinaryVars ? '✅ Yes' : '❌ No');
} else {
  console.log('\n❌ .env file not found');
}

// Try to load Cloudinary config
console.log('\n🔧 Testing Cloudinary configuration...');
try {
  const { cloudinary } = require('./src/config/cloudinary');
  console.log('✅ Cloudinary config loaded successfully');
  
  // Test API ping
  cloudinary.api.ping()
    .then(result => {
      console.log('✅ API Ping successful:', result);
    })
    .catch(error => {
      console.log('❌ API Ping failed:', error.message);
      console.log('Error details:', error);
    });
    
} catch (error) {
  console.log('❌ Failed to load Cloudinary config:', error.message);
}

console.log('\n🔧 Common issues and solutions:');
console.log('1. Missing .env file - Create .env file in project root');
console.log('2. Wrong credentials - Check Cloudinary dashboard for correct values');
console.log('3. Account inactive - Verify Cloudinary account is active');
console.log('4. API key permissions - Ensure API key has upload permissions');
console.log('5. Network issues - Check internet connection');

console.log('\n📝 Example .env file content:');
console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
console.log('CLOUDINARY_API_KEY=your_api_key');
console.log('CLOUDINARY_API_SECRET=your_api_secret'); 