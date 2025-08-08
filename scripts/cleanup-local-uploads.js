const fs = require('fs');
const path = require('path');

/**
 * Clean up local upload directory since we're now using only Cloudinary
 */
async function cleanupLocalUploads() {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    console.log('🧹 Cleaning up local upload directory...');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      
      if (files.length === 0) {
        console.log('✅ Upload directory is already empty');
        return;
      }
      
      console.log(`📁 Found ${files.length} files in upload directory`);
      
      // Delete all files
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️  Deleted: ${file}`);
      }
      
      // Remove the directory itself
      fs.rmdirSync(uploadsDir);
      console.log('🗑️  Removed upload directory');
      
      console.log('✅ Local upload cleanup completed successfully!');
      console.log('📝 Note: All future uploads will be stored on Cloudinary only');
      
    } else {
      console.log('✅ Upload directory does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

// Run cleanup
cleanupLocalUploads(); 