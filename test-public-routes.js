const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/v1';

async function testPublicRoutes() {
  console.log('🧪 Testing Public Routes...\n');

  try {
    // Test categories public endpoint
    console.log('📋 Testing GET /categories/public...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories/public`);
    console.log('✅ Categories Response:', {
      status: categoriesResponse.status,
      data: categoriesResponse.data,
      count: categoriesResponse.data?.data?.results?.length || 0
    });

    // Test places public endpoint
    console.log('\n🏪 Testing GET /places/public...');
    const placesResponse = await axios.get(`${API_BASE_URL}/places/public`);
    console.log('✅ Places Response:', {
      status: placesResponse.status,
      data: placesResponse.data,
      count: placesResponse.data?.data?.results?.length || 0
    });

    // Test places search endpoint
    console.log('\n🔍 Testing GET /places/public/search...');
    const searchResponse = await axios.get(`${API_BASE_URL}/places/public/search?q=cafe`);
    console.log('✅ Search Response:', {
      status: searchResponse.status,
      data: searchResponse.data,
      count: searchResponse.data?.data?.results?.length || 0
    });

    console.log('\n🎉 All public routes are working correctly!');
  } catch (error) {
    console.error('❌ Error testing public routes:', error.response?.data || error.message);
  }
}

// Run the test
testPublicRoutes(); 