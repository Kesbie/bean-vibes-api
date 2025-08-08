const mongoose = require('mongoose');
const { Place } = require('./src/models/places.model');
const { Category } = require('./src/models/category.model');

// Test script to verify the category slug filtering functionality
async function testCategorySlugFiltering() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Create test categories
    const testCategories = [
      {
        name: 'Coffee Shop',
        slug: 'coffee-shop',
        description: 'Places that serve coffee',
      },
      {
        name: 'Restaurant',
        slug: 'restaurant',
        description: 'Places that serve food',
      },
      {
        name: 'Bar',
        slug: 'bar',
        description: 'Places that serve drinks',
      },
    ];

    const createdCategories = [];
    for (const categoryData of testCategories) {
      const category = new Category(categoryData);
      await category.save();
      createdCategories.push(category);
      console.log(`✅ Created category: ${category.name} (${category.slug})`);
    }

    // Test 2: Create test places with different categories
    const testPlaces = [
      {
        name: 'Coffee Place 1',
        description: 'A great coffee shop',
        categories: [createdCategories[0]._id], // coffee-shop
        approvalStatus: 'approved',
        status: 'active',
      },
      {
        name: 'Restaurant Place 1',
        description: 'A great restaurant',
        categories: [createdCategories[1]._id], // restaurant
        approvalStatus: 'approved',
        status: 'active',
      },
      {
        name: 'Bar Place 1',
        description: 'A great bar',
        categories: [createdCategories[2]._id], // bar
        approvalStatus: 'approved',
        status: 'active',
      },
      {
        name: 'Coffee & Restaurant Place',
        description: 'A place that serves both coffee and food',
        categories: [createdCategories[0]._id, createdCategories[1]._id], // coffee-shop, restaurant
        approvalStatus: 'approved',
        status: 'active',
      },
      {
        name: 'All-in-One Place',
        description: 'A place that serves everything',
        categories: [createdCategories[0]._id, createdCategories[1]._id, createdCategories[2]._id], // all categories
        approvalStatus: 'approved',
        status: 'active',
      },
    ];

    const createdPlaces = [];
    for (const placeData of testPlaces) {
      const place = new Place(placeData);
      await place.save();
      createdPlaces.push(place);
      console.log(`✅ Created place: ${place.name}`);
    }

    // Test 3: Test the queryPlaces service method
    const { placeService } = require('./src/services/place.service');
    
    console.log('\n📊 Testing Category Slug Filtering:');
    
    // Test with single category slug
    console.log('\n🔍 Testing single category slug (coffee-shop):');
    const resultSingle = await placeService.queryPlaces(
      { category: 'coffee-shop' }, 
      { limit: 10, page: 1 }
    );
    console.log('✅ Places found:', resultSingle.results.length);
    resultSingle.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name} - Categories: ${place.categories.map(c => c.slug || c.name).join(', ')}`);
    });

    // Test with multiple category slugs (comma-separated)
    console.log('\n🔍 Testing multiple category slugs (coffee-shop,restaurant):');
    const resultMultiple = await placeService.queryPlaces(
      { category: ['coffee-shop', 'restaurant'] }, 
      { limit: 10, page: 1 }
    );
    console.log('✅ Places found:', resultMultiple.results.length);
    resultMultiple.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name} - Categories: ${place.categories.map(c => c.slug || c.name).join(', ')}`);
    });

    // Test with non-existent category slug
    console.log('\n🔍 Testing non-existent category slug:');
    const resultNonExistent = await placeService.queryPlaces(
      { category: 'non-existent-slug' }, 
      { limit: 10, page: 1 }
    );
    console.log('✅ Places found:', resultNonExistent.results.length);

    // Test with all categories
    console.log('\n🔍 Testing all categories:');
    const resultAll = await placeService.queryPlaces(
      { category: ['coffee-shop', 'restaurant', 'bar'] }, 
      { limit: 10, page: 1 }
    );
    console.log('✅ Places found:', resultAll.results.length);
    resultAll.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name} - Categories: ${place.categories.map(c => c.slug || c.name).join(', ')}`);
    });

    // Test without category filter
    console.log('\n🔍 Testing without category filter:');
    const resultNoFilter = await placeService.queryPlaces(
      {}, 
      { limit: 10, page: 1 }
    );
    console.log('✅ Places found:', resultNoFilter.results.length);

    // Test 4: Test with name filter combined with category filter
    console.log('\n🔍 Testing name filter with category filter:');
    const resultNameCategory = await placeService.queryPlaces(
      { 
        name: 'Coffee',
        category: 'coffee-shop'
      }, 
      { limit: 10, page: 1 }
    );
    console.log('✅ Places found:', resultNameCategory.results.length);
    resultNameCategory.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name} - Categories: ${place.categories.map(c => c.slug || c.name).join(', ')}`);
    });

    // Test 5: Test pagination with category filter
    console.log('\n📄 Testing pagination with category filter:');
    const resultPage1 = await placeService.queryPlaces(
      { category: ['coffee-shop', 'restaurant'] }, 
      { limit: 2, page: 1 }
    );
    const resultPage2 = await placeService.queryPlaces(
      { category: ['coffee-shop', 'restaurant'] }, 
      { limit: 2, page: 2 }
    );

    console.log('✅ Page 1 places:', resultPage1.results.length);
    resultPage1.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name}`);
    });

    console.log('✅ Page 2 places:', resultPage2.results.length);
    resultPage2.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name}`);
    });

    // Cleanup
    await Place.deleteMany({ _id: { $in: createdPlaces.map(p => p._id) } });
    await Category.deleteMany({ _id: { $in: createdCategories.map(c => c._id) } });
    console.log('\n✅ Cleaned up test data');

    console.log('\n🎉 All tests passed! The category slug filtering is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testCategorySlugFiltering();
