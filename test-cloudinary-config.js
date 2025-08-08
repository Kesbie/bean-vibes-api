require('dotenv').config();
const { cloudinary } = require('./src/config/cloudinary');

async function testCloudinaryConfig() {
  try {
    console.log('🔍 Testing Cloudinary configuration...');
    
    // Check environment variables
    console.log('\n📋 Environment Variables:');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
    
    // Test API connection
    console.log('\n🔗 Testing API connection...');
    const pingResult = await cloudinary.api.ping();
    console.log('✅ API Ping successful:', pingResult);
    
    // Test upload with a simple image
    console.log('\n📤 Testing upload...');
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'test',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      const { Readable } = require('stream');
      const stream = Readable.from(testImageBuffer);
      stream.pipe(uploadStream);
    });
    
    console.log('✅ Upload successful:', {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      format: uploadResult.format
    });
    
    // Clean up test file
    console.log('\n🧹 Cleaning up test file...');
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('✅ Test file deleted');
    
    console.log('\n🎉 All tests passed! Cloudinary configuration is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('1. Check your Cloudinary credentials in .env file');
    console.error('2. Verify your Cloudinary account is active');
    console.error('3. Check your internet connection');
    console.error('4. Ensure your API key has upload permissions');
    
    process.exit(1);
  }
}

testCloudinaryConfig(); 