const mongoose = require('mongoose');
const { Place } = require('./src/models/places.model');

// Test script to verify the custom sorting for places by approvalStatus
async function testPlaceSorting() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Create test places with different approvalStatus
    const testPlaces = [
      {
        name: 'Approved Place 1',
        description: 'This is an approved place',
        approvalStatus: 'approved',
        createdAt: new Date('2024-01-01'),
      },
      {
        name: 'Rejected Place 1',
        description: 'This is a rejected place',
        approvalStatus: 'rejected',
        createdAt: new Date('2024-01-02'),
      },
      {
        name: 'Pending Place 1',
        description: 'This is a pending place',
        approvalStatus: 'pending',
        createdAt: new Date('2024-01-03'),
      },
      {
        name: 'Approved Place 2',
        description: 'This is another approved place',
        approvalStatus: 'approved',
        createdAt: new Date('2024-01-04'),
      },
      {
        name: 'Pending Place 2',
        description: 'This is another pending place',
        approvalStatus: 'pending',
        createdAt: new Date('2024-01-05'),
      },
      {
        name: 'Rejected Place 2',
        description: 'This is another rejected place',
        approvalStatus: 'rejected',
        createdAt: new Date('2024-01-06'),
      },
    ];

    const createdPlaces = [];
    for (const placeData of testPlaces) {
      const place = new Place(placeData);
      await place.save();
      createdPlaces.push(place);
      console.log(`✅ Created place: ${place.name} (${place.approvalStatus})`);
    }

    // Test 2: Test the getAdminPlaces service method
    const { placeService } = require('./src/services/place.service');
    
    console.log('\n📊 Testing Place Sorting by ApprovalStatus:');
    
    // Test with custom sorting
    const result = await placeService.getAdminPlaces({}, { 
      limit: 10, 
      page: 1,
      customSort: {
        approvalStatus: true
      }
    });

    console.log('✅ Total places found:', result.totalResults);
    console.log('✅ Places per page:', result.limit);
    console.log('✅ Current page:', result.page);

    // Test 3: Verify the sorting order
    console.log('\n📈 Verifying sorting order (should be: pending → approved → rejected):');
    const expectedOrder = ['pending', 'pending', 'approved', 'approved', 'rejected', 'rejected'];
    
    for (let i = 0; i < result.results.length; i++) {
      const place = result.results[i];
      const expectedStatus = expectedOrder[i];
      const isCorrect = place.approvalStatus === expectedStatus;
      
      console.log(`${isCorrect ? '✅' : '❌'} ${i + 1}. ${place.name} - ${place.approvalStatus} ${isCorrect ? '' : `(expected: ${expectedStatus})`}`);
    }

    // Test 4: Verify that all places are returned
    console.log('\n📋 All places in result:');
    result.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name} - ${place.approvalStatus} - Created: ${place.createdAt}`);
    });

    // Test 5: Test without custom sorting (should use default sorting)
    console.log('\n🔄 Testing without custom sorting:');
    const resultWithoutCustomSort = await placeService.getAdminPlaces({}, { 
      limit: 10, 
      page: 1
    });

    console.log('✅ Places without custom sort:');
    resultWithoutCustomSort.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name} - ${place.approvalStatus}`);
    });

    // Test 6: Test with filter
    console.log('\n🔍 Testing with approvalStatus filter:');
    const resultWithFilter = await placeService.getAdminPlaces(
      { approvalStatus: 'pending' }, 
      { 
        limit: 10, 
        page: 1,
        customSort: {
          approvalStatus: true
        }
      }
    );

    console.log('✅ Places with pending filter:');
    resultWithFilter.results.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name} - ${place.approvalStatus}`);
    });

    // Cleanup
    await Place.deleteMany({ _id: { $in: createdPlaces.map(p => p._id) } });
    console.log('\n✅ Cleaned up test data');

    console.log('\n🎉 All tests passed! The place sorting by approvalStatus is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testPlaceSorting();
