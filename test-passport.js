const http = require('http');

function makeRequest(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: `/v1${path}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
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

async function testPassport() {
  console.log('🧪 Testing Passport Middleware...\n');

  try {
    // Test without Authorization header
    console.log('📋 Testing GET /categories/public (no auth)...');
    const categoriesResponse1 = await makeRequest('/categories/public');
    console.log('Categories Status (no auth):', categoriesResponse1.status);
    console.log('Categories Message:', categoriesResponse1.data?.message);

    // Test with empty Authorization header
    console.log('\n📋 Testing GET /categories/public (empty auth)...');
    const categoriesResponse2 = await makeRequest('/categories/public', {
      'Authorization': ''
    });
    console.log('Categories Status (empty auth):', categoriesResponse2.status);
    console.log('Categories Message:', categoriesResponse2.data?.message);

    // Test with invalid Authorization header
    console.log('\n📋 Testing GET /categories/public (invalid auth)...');
    const categoriesResponse3 = await makeRequest('/categories/public', {
      'Authorization': 'Bearer invalid-token'
    });
    console.log('Categories Status (invalid auth):', categoriesResponse3.status);
    console.log('Categories Message:', categoriesResponse3.data?.message);

    // Test places for comparison
    console.log('\n🏪 Testing GET /places/public (no auth)...');
    const placesResponse = await makeRequest('/places/public');
    console.log('Places Status (no auth):', placesResponse.status);
    console.log('Places Count:', placesResponse.data?.results?.length || 0);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPassport(); 