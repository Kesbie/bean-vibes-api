const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Test script to verify category sorting by place count
async function testCategorySorting() {
  const baseURL = 'http://localhost:3001/v1/categories';
  
  console.log('🔍 Testing Category Sorting (Most Places First)\n');

  try {
    // Test 1: Default sorting (placeCount desc)
    console.log('1️⃣ Testing default sorting (placeCount desc):');
    const { stdout: result1 } = await execAsync(`curl -s -X GET "${baseURL}" -H "Content-Type: application/json"`);
    const data1 = JSON.parse(result1);
    console.log(`✅ Status: ${data1.code}, Total Categories: ${data1.data?.totalResults || 'N/A'}`);
    if (data1.data?.results) {
      console.log('   Top 10 categories by place count:');
      data1.data.results.slice(0, 10).forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug}): ${cat.placeCount} places`);
      });
    }
    console.log('');

    // Test 2: Explicit placeCount desc sorting
    console.log('2️⃣ Testing explicit placeCount desc sorting:');
    const { stdout: result2 } = await execAsync(`curl -s -X GET "${baseURL}?sortBy=placeCount&sortOrder=desc" -H "Content-Type: application/json"`);
    const data2 = JSON.parse(result2);
    console.log(`✅ Status: ${data2.code}, Results: ${data2.data?.totalResults || 'N/A'}`);
    if (data2.data?.results) {
      console.log('   Top 5 categories by place count:');
      data2.data.results.slice(0, 5).forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug}): ${cat.placeCount} places`);
      });
    }
    console.log('');

    // Test 3: placeCount asc sorting (least places first)
    console.log('3️⃣ Testing placeCount asc sorting (least places first):');
    const { stdout: result3 } = await execAsync(`curl -s -X GET "${baseURL}?sortBy=placeCount&sortOrder=asc" -H "Content-Type: application/json"`);
    const data3 = JSON.parse(result3);
    console.log(`✅ Status: ${data3.code}, Results: ${data3.data?.totalResults || 'N/A'}`);
    if (data3.data?.results) {
      console.log('   Top 5 categories with least places:');
      data3.data.results.slice(0, 5).forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug}): ${cat.placeCount} places`);
      });
    }
    console.log('');

    // Test 4: Name sorting
    console.log('4️⃣ Testing name sorting:');
    const { stdout: result4 } = await execAsync(`curl -s -X GET "${baseURL}?sortBy=name&sortOrder=asc" -H "Content-Type: application/json"`);
    const data4 = JSON.parse(result4);
    console.log(`✅ Status: ${data4.code}, Results: ${data4.data?.totalResults || 'N/A'}`);
    if (data4.data?.results) {
      console.log('   First 5 categories by name:');
      data4.data.results.slice(0, 5).forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug}): ${cat.placeCount} places`);
      });
    }
    console.log('');

    // Test 5: Type filtering with default sorting
    console.log('5️⃣ Testing type filtering with default sorting:');
    const { stdout: result5 } = await execAsync(`curl -s -X GET "${baseURL}?type=region" -H "Content-Type: application/json"`);
    const data5 = JSON.parse(result5);
    console.log(`✅ Status: ${data5.code}, Results: ${data5.data?.totalResults || 'N/A'}`);
    if (data5.data?.results) {
      console.log('   Region categories by place count:');
      data5.data.results.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug}): ${cat.placeCount} places`);
      });
    }
    console.log('');

    // Test 6: Pagination with default sorting
    console.log('6️⃣ Testing pagination with default sorting:');
    const { stdout: result6 } = await execAsync(`curl -s -X GET "${baseURL}?limit=5&page=1" -H "Content-Type: application/json"`);
    const data6 = JSON.parse(result6);
    console.log(`✅ Status: ${data6.code}, Page: ${data6.data?.page}, Limit: ${data6.data?.limit}`);
    if (data6.data?.results) {
      console.log('   Page 1 (top 5 by place count):');
      data6.data.results.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug}): ${cat.placeCount} places`);
      });
    }
    console.log('');

    console.log('🎉 All category sorting tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCategorySorting();
