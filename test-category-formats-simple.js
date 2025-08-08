const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Simple test script to test different category parameter formats
async function testCategoryFormats() {
  const baseURL = 'http://localhost:3001/v1/places';
  
  console.log('🧪 Testing Category Parameter Formats\n');

  try {
    // Test 1: Single category slug
    console.log('1️⃣ Testing single category slug:');
    const { stdout: result1 } = await execAsync(`curl -s -X GET "${baseURL}?category=tay-ho" -H "Content-Type: application/json"`);
    const data1 = JSON.parse(result1);
    console.log(`✅ Status: ${data1.code}, Results: ${data1.data?.totalResults || 'N/A'}`);
    if (data1.data?.results) {
      console.log(`   Places: ${data1.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 2: Comma-separated categories
    console.log('2️⃣ Testing comma-separated categories:');
    const { stdout: result2 } = await execAsync(`curl -s -X GET "${baseURL}?category=tay-ho,cau-giay" -H "Content-Type: application/json"`);
    const data2 = JSON.parse(result2);
    console.log(`✅ Status: ${data2.code}, Results: ${data2.data?.totalResults || 'N/A'}`);
    if (data2.data?.results) {
      console.log(`   Places: ${data2.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 3: Multiple category parameters (URLSearchParams style)
    console.log('3️⃣ Testing multiple category parameters:');
    const { stdout: result3 } = await execAsync(`curl -s -X GET "${baseURL}?category=tay-ho&category=cau-giay" -H "Content-Type: application/json"`);
    const data3 = JSON.parse(result3);
    console.log(`✅ Status: ${data3.code}, Results: ${data3.data?.totalResults || 'N/A'}`);
    if (data3.data?.results) {
      console.log(`   Places: ${data3.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 4: Mixed format with spaces
    console.log('4️⃣ Testing mixed format with spaces:');
    const { stdout: result4 } = await execAsync(`curl -s -X GET "${baseURL}?category=tay-ho%2C%20cau-giay%20%2C%20ba-dinh" -H "Content-Type: application/json"`);
    const data4 = JSON.parse(result4);
    console.log(`✅ Status: ${data4.code}, Results: ${data4.data?.totalResults || 'N/A'}`);
    if (data4.data?.results) {
      console.log(`   Places: ${data4.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 5: Combined with other filters
    console.log('5️⃣ Testing combined with other filters:');
    const { stdout: result5 } = await execAsync(`curl -s -X GET "${baseURL}?category=tay-ho,cau-giay&limit=2" -H "Content-Type: application/json"`);
    const data5 = JSON.parse(result5);
    console.log(`✅ Status: ${data5.code}, Results: ${data5.data?.totalResults || 'N/A'}`);
    if (data5.data?.results) {
      console.log(`   Places: ${data5.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 6: Empty and invalid categories
    console.log('6️⃣ Testing empty and invalid categories:');
    const { stdout: result6 } = await execAsync(`curl -s -X GET "${baseURL}?category=,tay-ho,,invalid-slug," -H "Content-Type: application/json"`);
    const data6 = JSON.parse(result6);
    console.log(`✅ Status: ${data6.code}, Results: ${data6.data?.totalResults || 'N/A'}`);
    if (data6.data?.results) {
      console.log(`   Places: ${data6.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 7: No category filter
    console.log('7️⃣ Testing no category filter:');
    const { stdout: result7 } = await execAsync(`curl -s -X GET "${baseURL}" -H "Content-Type: application/json"`);
    const data7 = JSON.parse(result7);
    console.log(`✅ Status: ${data7.code}, Results: ${data7.data?.totalResults || 'N/A'}`);
    if (data7.data?.results) {
      console.log(`   Places: ${data7.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCategoryFormats();
