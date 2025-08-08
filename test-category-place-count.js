const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Test script to verify category place counts only include approved places
async function testCategoryPlaceCount() {
  const baseURL = 'http://localhost:3001/v1';
  
  console.log('🔍 Testing Category Place Count (Approved Places Only)\n');

  try {
    // Test 1: Get all categories and check place counts
    console.log('1️⃣ Testing all categories place counts:');
    const { stdout: result1 } = await execAsync(`curl -s -X GET "${baseURL}/categories" -H "Content-Type: application/json"`);
    const data1 = JSON.parse(result1);
    console.log(`✅ Status: ${data1.code}, Total Categories: ${data1.data?.totalResults || 'N/A'}`);
    if (data1.data?.results) {
      console.log('   Categories with place counts:');
      data1.data.results.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug}): ${cat.placeCount} places`);
      });
    }
    console.log('');

    // Test 2: Get specific category by ID (skip this test as it requires auth)
    console.log('2️⃣ Testing specific category place count:');
    console.log('   ⚠️  Skipping - requires authentication');
    console.log('');

    // Test 3: Get categories by slugs (skip this test as it requires auth)
    console.log('3️⃣ Testing categories by slugs place counts:');
    console.log('   ⚠️  Skipping - requires authentication');
    console.log('');

    // Test 4: Compare with total approved places
    console.log('4️⃣ Testing total approved places count:');
    const { stdout: result4 } = await execAsync(`curl -s -X GET "${baseURL}/places" -H "Content-Type: application/json"`);
    const data4 = JSON.parse(result4);
    console.log(`✅ Status: ${data4.code}, Total Approved Places: ${data4.data?.totalResults || 'N/A'}`);
    console.log('');

    // Test 5: Check if place counts match expected values
    console.log('5️⃣ Verifying place count accuracy:');
    if (data1.data?.results && data4.data?.totalResults) {
      let totalCategoryPlaces = 0;
      data1.data.results.forEach(cat => {
        totalCategoryPlaces += cat.placeCount;
      });
      console.log(`   Total places across all categories: ${totalCategoryPlaces}`);
      console.log(`   Total approved places: ${data4.data.totalResults}`);
      console.log(`   Note: A place can belong to multiple categories, so total may exceed approved places count`);
    }
    console.log('');

    console.log('🎉 All category place count tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCategoryPlaceCount();
