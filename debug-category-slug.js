const mongoose = require('mongoose');
const { Place, Category } = require('./src/models');

// Debug script to test category slug filtering
async function debugCategorySlug() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Step 1: Check if categories exist
    console.log('\n🔍 Step 1: Checking existing categories...');
    const existingCategories = await Category.find({}).select('name slug _id');
    console.log('Existing categories:', existingCategories);

    if (existingCategories.length === 0) {
      console.log('❌ No categories found. Creating test categories...');
      
      // Create test categories
      const testCategories = [
        {
          name: 'Coffee Shop',
          slug: 'coffee-shop',
          description: 'Places that serve coffee',
          type: 'service',
        },
        {
          name: 'Restaurant',
          slug: 'restaurant',
          description: 'Places that serve food',
          type: 'service',
        },
      ];

      for (const categoryData of testCategories) {
        const category = new Category(categoryData);
        await category.save();
        console.log(`✅ Created category: ${category.name} (${category.slug})`);
      }
    }

    // Step 2: Check if places exist
    console.log('\n🔍 Step 2: Checking existing places...');
    const existingPlaces = await Place.find({}).select('name categories approvalStatus').populate('categories', 'name slug');
    console.log('Existing places:', existingPlaces);

    if (existingPlaces.length === 0) {
      console.log('❌ No places found. Creating test places...');
      
      // Get categories for creating places
      const categories = await Category.find({});
      
      if (categories.length > 0) {
        const testPlaces = [
          {
            name: 'Test Coffee Place',
            description: 'A test coffee shop',
            categories: [categories[0]._id], // coffee-shop
            approvalStatus: 'approved',
            status: 'active',
          },
          {
            name: 'Test Restaurant Place',
            description: 'A test restaurant',
            categories: [categories[1]._id], // restaurant
            approvalStatus: 'approved',
            status: 'active',
          },
        ];

        for (const placeData of testPlaces) {
          const place = new Place(placeData);
          await place.save();
          console.log(`✅ Created place: ${place.name}`);
        }
      }
    }

    // Step 3: Test categoryService.getCategoryBySlugs directly
    console.log('\n🔍 Step 3: Testing categoryService.getCategoryBySlugs...');
    try {
      const categoryService = require('./src/services/category.service');
      
      // Test with single slug
      console.log('Testing with single slug: coffee-shop');
      const singleCategory = await categoryService.getCategoryBySlugs(['coffee-shop']);
      console.log('Single category result:', singleCategory);
      
      // Test with multiple slugs
      console.log('Testing with multiple slugs: coffee-shop, restaurant');
      const multipleCategories = await categoryService.getCategoryBySlugs(['coffee-shop', 'restaurant']);
      console.log('Multiple categories result:', multipleCategories);
      
    } catch (error) {
      console.error('❌ Error testing categoryService:', error.message);
    }

    // Step 4: Test placeService.queryPlaces with category filter
    console.log('\n🔍 Step 4: Testing placeService.queryPlaces...');
    try {
      const placeService = require('./src/services/place.service');
      
      // Test with single category slug
      console.log('Testing with single category slug: coffee-shop');
      const resultSingle = await placeService.queryPlaces(
        { category: 'coffee-shop' }, 
        { limit: 10, page: 1 }
      );
      console.log('Single category result:', {
        totalResults: resultSingle.totalResults,
        resultsCount: resultSingle.results.length,
        places: resultSingle.results.map(p => ({ name: p.name, categories: p.categories }))
      });
      
      // Test with multiple category slugs
      console.log('Testing with multiple category slugs: coffee-shop, restaurant');
      const resultMultiple = await placeService.queryPlaces(
        { category: ['coffee-shop', 'restaurant'] }, 
        { limit: 10, page: 1 }
      );
      console.log('Multiple categories result:', {
        totalResults: resultMultiple.totalResults,
        resultsCount: resultMultiple.results.length,
        places: resultMultiple.results.map(p => ({ name: p.name, categories: p.categories }))
      });
      
      // Test without category filter
      console.log('Testing without category filter');
      const resultNoFilter = await placeService.queryPlaces(
        {}, 
        { limit: 10, page: 1 }
      );
      console.log('No filter result:', {
        totalResults: resultNoFilter.totalResults,
        resultsCount: resultNoFilter.results.length
      });
      
    } catch (error) {
      console.error('❌ Error testing placeService:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Step 5: Test the actual API endpoint
    console.log('\n🔍 Step 5: Testing actual API endpoint...');
    try {
      const axios = require('axios');
      
      // Test single category
      console.log('Testing API with single category: coffee-shop');
      const apiResponse1 = await axios.get('http://localhost:3000/v1/places?category=coffee-shop');
      console.log('API response 1:', {
        status: apiResponse1.status,
        totalResults: apiResponse1.data.data.totalResults,
        resultsCount: apiResponse1.data.data.results.length
      });
      
      // Test multiple categories
      console.log('Testing API with multiple categories: coffee-shop,restaurant');
      const apiResponse2 = await axios.get('http://localhost:3000/v1/places?category=coffee-shop,restaurant');
      console.log('API response 2:', {
        status: apiResponse2.status,
        totalResults: apiResponse2.data.data.totalResults,
        resultsCount: apiResponse2.data.data.results.length
      });
      
    } catch (error) {
      console.error('❌ Error testing API endpoint:', error.message);
      if (error.response) {
        console.error('API Error response:', error.response.data);
      }
    }

    console.log('\n🎉 Debug completed!');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the debug
debugCategorySlug();
