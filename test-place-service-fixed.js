const mongoose = require('mongoose');
const { Place, Category } = require('./src/models');

// Test script to verify the fixed place service
async function testPlaceServiceFixed() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Check categoryService.getCategoryBySlugs
    console.log('\n🔍 Test 1: Check categoryService.getCategoryBySlugs');
    const categoryService = require('./src/services/category.service');
    
    const categories = await categoryService.getCategoryBySlugs(['coffee-shop', 'restaurant']);
    console.log('Categories from service:', categories.map(c => ({
      name: c.name,
      slug: c.slug,
      id: c.id,
      _id: c._id,
      hasId: !!c.id,
      hasUnderscoreId: !!c._id
    })));

    // Test 2: Test placeService.queryPlaces with single category
    console.log('\n🔍 Test 2: Test placeService.queryPlaces with single category');
    const placeService = require('./src/services/place.service');
    
    const resultSingle = await placeService.queryPlaces(
      { category: 'coffee-shop' }, 
      { limit: 10, page: 1 }
    );
    console.log('Single category result:', {
      totalResults: resultSingle.totalResults,
      resultsCount: resultSingle.results.length,
      places: resultSingle.results.map(p => ({ 
        name: p.name, 
        categories: p.categories.map(c => c.name) 
      }))
    });

    // Test 3: Test placeService.queryPlaces with multiple categories
    console.log('\n🔍 Test 3: Test placeService.queryPlaces with multiple categories');
    const resultMultiple = await placeService.queryPlaces(
      { category: ['coffee-shop', 'restaurant'] }, 
      { limit: 10, page: 1 }
    );
    console.log('Multiple categories result:', {
      totalResults: resultMultiple.totalResults,
      resultsCount: resultMultiple.results.length,
      places: resultMultiple.results.map(p => ({ 
        name: p.name, 
        categories: p.categories.map(c => c.name) 
      }))
    });

    // Test 4: Test placeService.queryPlaces without category filter
    console.log('\n🔍 Test 4: Test placeService.queryPlaces without category filter');
    const resultNoFilter = await placeService.queryPlaces(
      {}, 
      { limit: 10, page: 1 }
    );
    console.log('No filter result:', {
      totalResults: resultNoFilter.totalResults,
      resultsCount: resultNoFilter.results.length
    });

    // Test 5: Test with name filter combined
    console.log('\n🔍 Test 5: Test with name filter combined');
    const resultNameFilter = await placeService.queryPlaces(
      { 
        category: 'coffee-shop',
        name: 'Coffee'
      }, 
      { limit: 10, page: 1 }
    );
    console.log('Name + category filter result:', {
      totalResults: resultNameFilter.totalResults,
      resultsCount: resultNameFilter.results.length,
      places: resultNameFilter.results.map(p => ({ 
        name: p.name, 
        categories: p.categories.map(c => c.name) 
      }))
    });

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testPlaceServiceFixed();
