const mongoose = require('mongoose');
const { Place, Category } = require('./src/models');

// Detailed debug script to test category filtering logic
async function debugCategoryFilter() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get existing data
    const categories = await Category.find({}).select('name slug _id');
    const places = await Place.find({}).select('name categories approvalStatus').populate('categories', 'name slug _id');
    
    console.log('\n📊 Current Data:');
    console.log('Categories:', categories.map(c => ({ name: c.name, slug: c.slug, id: c._id })));
    console.log('Places:', places.map(p => ({ 
      name: p.name, 
      categories: p.categories.map(c => ({ name: c.name, slug: c.slug, id: c._id })),
      approvalStatus: p.approvalStatus 
    })));

    // Test 1: Direct MongoDB query with ObjectIds
    console.log('\n🔍 Test 1: Direct MongoDB query with ObjectIds');
    const categoryIds = categories.map(c => c._id);
    console.log('Category IDs:', categoryIds);
    
    const directQuery = await Place.find({ 
      categories: { $in: categoryIds },
      approvalStatus: 'approved'
    }).populate('categories', 'name slug');
    
    console.log('Direct query result:', directQuery.map(p => ({ 
      name: p.name, 
      categories: p.categories.map(c => c.name) 
    })));

    // Test 2: Test categoryService.getCategoryBySlugs
    console.log('\n🔍 Test 2: Test categoryService.getCategoryBySlugs');
    const categoryService = require('./src/services/category.service');
    
    const slugs = ['coffee-shop', 'restaurant'];
    const foundCategories = await categoryService.getCategoryBySlugs(slugs);
    console.log('Found categories:', foundCategories.map(c => ({ 
      name: c.name, 
      slug: c.slug, 
      id: c._id 
    })));

    // Test 3: Test the exact filter that placeService creates
    console.log('\n🔍 Test 3: Test the exact filter that placeService creates');
    const categoryIdsFromService = foundCategories.map(c => c._id);
    console.log('Category IDs from service:', categoryIdsFromService);
    
    const filterTest = await Place.find({ 
      categories: { $in: categoryIdsFromService },
      approvalStatus: 'approved'
    }).populate('categories', 'name slug');
    
    console.log('Filter test result:', filterTest.map(p => ({ 
      name: p.name, 
      categories: p.categories.map(c => c.name) 
    })));

    // Test 4: Test placeService.queryPlaces step by step
    console.log('\n🔍 Test 4: Test placeService.queryPlaces step by step');
    const placeService = require('./src/services/place.service');
    
    // Simulate the exact logic from placeService
    const filter = { category: ['coffee-shop', 'restaurant'] };
    const options = { limit: 10, page: 1 };
    
    console.log('Original filter:', filter);
    
    // Step 1: Convert slugs to ObjectIds
    if (filter.category) {
      const categorySlugs = Array.isArray(filter.category) ? filter.category : [filter.category];
      console.log('Category slugs:', categorySlugs);
      
      const categories = await categoryService.getCategoryBySlugs(categorySlugs);
      console.log('Categories found:', categories.map(c => ({ name: c.name, slug: c.slug, id: c._id })));
      
      delete filter.category;
      filter.categories = { $in: categories.map((category) => category._id) };
      console.log('Updated filter:', filter);
    }
    
    // Step 2: Add approvalStatus filter (from controller)
    filter.approvalStatus = 'approved';
    console.log('Final filter:', filter);
    
    // Step 3: Test the query
    const result = await Place.paginate(filter, { ...options, populate: [{ path: 'categories' }] });
    console.log('Query result:', {
      totalResults: result.totalResults,
      resultsCount: result.results.length,
      places: result.results.map(p => ({ 
        name: p.name, 
        categories: p.categories.map(c => c.name) 
      }))
    });

    // Test 5: Compare ObjectId types
    console.log('\n🔍 Test 5: Compare ObjectId types');
    const placeCategories = places[0].categories[0]._id;
    const serviceCategories = foundCategories[0]._id;
    
    console.log('Place category ID type:', typeof placeCategories);
    console.log('Place category ID:', placeCategories);
    console.log('Service category ID type:', typeof serviceCategories);
    console.log('Service category ID:', serviceCategories);
    console.log('Are they equal?', placeCategories.equals(serviceCategories));
    console.log('Are they string equal?', placeCategories.toString() === serviceCategories.toString());

    // Test 6: Test with string comparison
    console.log('\n🔍 Test 6: Test with string comparison');
    const stringFilter = {
      categories: { 
        $in: categoryIdsFromService.map(id => id.toString()) 
      },
      approvalStatus: 'approved'
    };
    console.log('String filter:', stringFilter);
    
    const stringResult = await Place.find(stringFilter).populate('categories', 'name slug');
    console.log('String filter result:', stringResult.map(p => ({ 
      name: p.name, 
      categories: p.categories.map(c => c.name) 
    })));

    console.log('\n🎉 Debug completed!');

  } catch (error) {
    console.error('❌ Debug failed:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the debug
debugCategoryFilter();
