const http = require('http');

const API_BASE_URL = 'http://localhost:8000/v1';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: `/v1${path}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test categories public endpoint
    console.log('📋 Testing GET /categories/public...');
    const categoriesResponse = await makeRequest('/categories/public');
    console.log('✅ Categories Response:', {
      status: categoriesResponse.status,
      count: categoriesResponse.data?.data?.results?.length || 0,
      message: categoriesResponse.data?.message
    });

    // Test places public endpoint
    console.log('\n🏪 Testing GET /places/public...');
    const placesResponse = await makeRequest('/places/public');
    console.log('✅ Places Response:', {
      status: placesResponse.status,
      count: placesResponse.data?.data?.results?.length || 0,
      message: placesResponse.data?.message
    });

    // Test places search endpoint
    console.log('\n🔍 Testing GET /places/public/search?q=cafe...');
    const searchResponse = await makeRequest('/places/public/search?q=cafe');
    console.log('✅ Search Response:', {
      status: searchResponse.status,
      count: searchResponse.data?.data?.results?.length || 0,
      message: searchResponse.data?.message
    });

    console.log('\n🎉 API testing completed!');
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run the test
testAPI(); 