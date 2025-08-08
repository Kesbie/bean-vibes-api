const axios = require('axios');

// Test script to verify multiple category parameter formats
async function testMultipleCategoryFormats() {
  const baseURL = 'http://localhost:3001/v1/places';
  
  console.log('🧪 Testing Multiple Category Parameter Formats\n');

  try {
    // Test 1: Single category slug
    console.log('1️⃣ Testing single category slug:');
    const response1 = await axios.get(`${baseURL}?category=tay-ho`);
    console.log(`✅ Status: ${response1.status}, Results: ${response1.data.data.totalResults}`);
    console.log(`   Places: ${response1.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 2: Comma-separated categories
    console.log('2️⃣ Testing comma-separated categories:');
    const response2 = await axios.get(`${baseURL}?category=tay-ho,cau-giay`);
    console.log(`✅ Status: ${response2.status}, Results: ${response2.data.data.totalResults}`);
    console.log(`   Places: ${response2.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 3: Multiple category parameters (URLSearchParams)
    console.log('3️⃣ Testing multiple category parameters:');
    const params3 = new URLSearchParams();
    params3.append('category', 'tay-ho');
    params3.append('category', 'cau-giay');
    const response3 = await axios.get(`${baseURL}?${params3.toString()}`);
    console.log(`✅ Status: ${response3.status}, Results: ${response3.data.data.totalResults}`);
    console.log(`   Places: ${response3.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 4: Using 'categories' parameter (alternative name)
    console.log('4️⃣ Testing categories parameter (alternative name):');
    const response4 = await axios.get(`${baseURL}?categories=tay-ho,cau-giay`);
    console.log(`✅ Status: ${response4.status}, Results: ${response4.data.data.totalResults}`);
    console.log(`   Places: ${response4.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 5: Multiple categories parameters (alternative name)
    console.log('5️⃣ Testing multiple categories parameters:');
    const params5 = new URLSearchParams();
    params5.append('categories', 'tay-ho');
    params5.append('categories', 'cau-giay');
    const response5 = await axios.get(`${baseURL}?${params5.toString()}`);
    console.log(`✅ Status: ${response5.status}, Results: ${response5.data.data.totalResults}`);
    console.log(`   Places: ${response5.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 6: Mixed format with spaces
    console.log('6️⃣ Testing mixed format with spaces:');
    const response6 = await axios.get(`${baseURL}?category=tay-ho, cau-giay , ba-dinh`);
    console.log(`✅ Status: ${response6.status}, Results: ${response6.data.data.totalResults}`);
    console.log(`   Places: ${response6.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 7: Combined with other filters
    console.log('7️⃣ Testing combined with other filters:');
    const response7 = await axios.get(`${baseURL}?category=tay-ho,cau-giay&limit=2&sortBy=name:asc`);
    console.log(`✅ Status: ${response7.status}, Results: ${response7.data.data.totalResults}`);
    console.log(`   Places: ${response7.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 8: Empty and invalid categories
    console.log('8️⃣ Testing empty and invalid categories:');
    const response8 = await axios.get(`${baseURL}?category=,tay-ho,,invalid-slug,`);
    console.log(`✅ Status: ${response8.status}, Results: ${response8.data.data.totalResults}`);
    console.log(`   Places: ${response8.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 9: No category filter
    console.log('9️⃣ Testing no category filter:');
    const response9 = await axios.get(`${baseURL}`);
    console.log(`✅ Status: ${response9.status}, Results: ${response9.data.data.totalResults}`);
    console.log(`   Places: ${response9.data.data.results.map(p => p.name).join(', ')}\n`);

    // Test 10: Both category and categories parameters (should work with category)
    console.log('🔟 Testing both category and categories parameters:');
    const response10 = await axios.get(`${baseURL}?category=tay-ho&categories=cau-giay`);
    console.log(`✅ Status: ${response10.status}, Results: ${response10.data.data.totalResults}`);
    console.log(`   Places: ${response10.data.data.results.map(p => p.name).join(', ')}\n`);

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testMultipleCategoryFormats();
