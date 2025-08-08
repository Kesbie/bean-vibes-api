const mongoose = require('mongoose');
const { Category } = require('./src/models');

// Simple test script to check categoryService.getCategoryBySlugs
async function testCategoryService() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Direct Category.find
    console.log('\n🔍 Test 1: Direct Category.find');
    const directCategories = await Category.find({ slug: { $in: ['coffee-shop', 'restaurant'] } });
    console.log('Direct find result:', directCategories.map(c => ({
      name: c.name,
      slug: c.slug,
      _id: c._id,
      hasId: !!c._id
    })));

    // Test 2: categoryService.getCategoryBySlugs
    console.log('\n🔍 Test 2: categoryService.getCategoryBySlugs');
    const categoryService = require('./src/services/category.service');
    
    const serviceCategories = await categoryService.getCategoryBySlugs(['coffee-shop', 'restaurant']);
    console.log('Service result:', serviceCategories.map(c => ({
      name: c.name,
      slug: c.slug,
      _id: c._id,
      hasId: !!c._id,
      keys: Object.keys(c)
    })));

    // Test 3: Check if _id exists in the result
    console.log('\n🔍 Test 3: Check _id field');
    if (serviceCategories.length > 0) {
      const firstCategory = serviceCategories[0];
      console.log('First category keys:', Object.keys(firstCategory));
      console.log('First category _id:', firstCategory._id);
      console.log('First category id:', firstCategory.id);
    }

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testCategoryService();
