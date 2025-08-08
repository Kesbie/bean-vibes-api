const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Test script to verify name filtering functionality
async function testNameFiltering() {
  const baseURL = 'http://localhost:3001/v1/places';
  
  console.log('🔍 Testing Name Filtering Functionality\n');

  try {
    // Test 1: Search for "house"
    console.log('1️⃣ Testing name filter: "house"');
    const { stdout: result1 } = await execAsync(`curl -s -X GET "${baseURL}?name=house" -H "Content-Type: application/json"`);
    const data1 = JSON.parse(result1);
    console.log(`✅ Status: ${data1.code}, Results: ${data1.data?.totalResults || 'N/A'}`);
    if (data1.data?.results) {
      console.log(`   Places: ${data1.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 2: Search for "coffee"
    console.log('2️⃣ Testing name filter: "coffee"');
    const { stdout: result2 } = await execAsync(`curl -s -X GET "${baseURL}?name=coffee" -H "Content-Type: application/json"`);
    const data2 = JSON.parse(result2);
    console.log(`✅ Status: ${data2.code}, Results: ${data2.data?.totalResults || 'N/A'}`);
    if (data2.data?.results) {
      console.log(`   Places: ${data2.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 3: Search for "cafe"
    console.log('3️⃣ Testing name filter: "cafe"');
    const { stdout: result3 } = await execAsync(`curl -s -X GET "${baseURL}?name=cafe" -H "Content-Type: application/json"`);
    const data3 = JSON.parse(result3);
    console.log(`✅ Status: ${data3.code}, Results: ${data3.data?.totalResults || 'N/A'}`);
    if (data3.data?.results) {
      console.log(`   Places: ${data3.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 4: Search for "space"
    console.log('4️⃣ Testing name filter: "space"');
    const { stdout: result4 } = await execAsync(`curl -s -X GET "${baseURL}?name=space" -H "Content-Type: application/json"`);
    const data4 = JSON.parse(result4);
    console.log(`✅ Status: ${data4.code}, Results: ${data4.data?.totalResults || 'N/A'}`);
    if (data4.data?.results) {
      console.log(`   Places: ${data4.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 5: Search for "mobius"
    console.log('5️⃣ Testing name filter: "mobius"');
    const { stdout: result5 } = await execAsync(`curl -s -X GET "${baseURL}?name=mobius" -H "Content-Type: application/json"`);
    const data5 = JSON.parse(result5);
    console.log(`✅ Status: ${data5.code}, Results: ${data5.data?.totalResults || 'N/A'}`);
    if (data5.data?.results) {
      console.log(`   Places: ${data5.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 6: Search for "laika"
    console.log('6️⃣ Testing name filter: "laika"');
    const { stdout: result6 } = await execAsync(`curl -s -X GET "${baseURL}?name=laika" -H "Content-Type: application/json"`);
    const data6 = JSON.parse(result6);
    console.log(`✅ Status: ${data6.code}, Results: ${data6.data?.totalResults || 'N/A'}`);
    if (data6.data?.results) {
      console.log(`   Places: ${data6.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 7: Search for non-existent name
    console.log('7️⃣ Testing name filter: "nonexistent"');
    const { stdout: result7 } = await execAsync(`curl -s -X GET "${baseURL}?name=nonexistent" -H "Content-Type: application/json"`);
    const data7 = JSON.parse(result7);
    console.log(`✅ Status: ${data7.code}, Results: ${data7.data?.totalResults || 'N/A'}`);
    if (data7.data?.results) {
      console.log(`   Places: ${data7.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 8: Combined name and category filter
    console.log('8️⃣ Testing combined name and category filter: "cafe" + "tay-ho"');
    const { stdout: result8 } = await execAsync(`curl -s -X GET "${baseURL}?name=cafe&category=tay-ho" -H "Content-Type: application/json"`);
    const data8 = JSON.parse(result8);
    console.log(`✅ Status: ${data8.code}, Results: ${data8.data?.totalResults || 'N/A'}`);
    if (data8.data?.results) {
      console.log(`   Places: ${data8.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 9: Combined name and category filter with multiple categories
    console.log('9️⃣ Testing combined name and multiple categories: "cafe" + "tay-ho,cau-giay"');
    const { stdout: result9 } = await execAsync(`curl -s -X GET "${baseURL}?name=cafe&category=tay-ho,cau-giay" -H "Content-Type: application/json"`);
    const data9 = JSON.parse(result9);
    console.log(`✅ Status: ${data9.code}, Results: ${data9.data?.totalResults || 'N/A'}`);
    if (data9.data?.results) {
      console.log(`   Places: ${data9.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    // Test 10: Case insensitive search
    console.log('🔟 Testing case insensitive search: "CAFE"');
    const { stdout: result10 } = await execAsync(`curl -s -X GET "${baseURL}?name=CAFE" -H "Content-Type: application/json"`);
    const data10 = JSON.parse(result10);
    console.log(`✅ Status: ${data10.code}, Results: ${data10.data?.totalResults || 'N/A'}`);
    if (data10.data?.results) {
      console.log(`   Places: ${data10.data.results.map(p => p.name).join(', ')}`);
    }
    console.log('');

    console.log('🎉 All name filtering tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testNameFiltering();
