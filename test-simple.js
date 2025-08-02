const http = require('http');

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
            data: jsonData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
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

async function testSimple() {
  console.log('🧪 Simple API Test...\n');

  try {
    // Test categories public endpoint
    console.log('📋 Testing GET /categories/public...');
    const categoriesResponse = await makeRequest('/categories/public');
    console.log('Categories Status:', categoriesResponse.status);
    console.log('Categories Data:', JSON.stringify(categoriesResponse.data, null, 2));

    // Test places public endpoint
    console.log('\n🏪 Testing GET /places/public...');
    const placesResponse = await makeRequest('/places/public');
    console.log('Places Status:', placesResponse.status);
    console.log('Places Data:', JSON.stringify(placesResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSimple(); 