const http = require('http');

function makeRequest(path, method = 'GET', headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: `/v1${path}`,
      method: method,
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

async function debugCategories() {
  console.log('🔍 Debugging Categories Route...\n');

  try {
    // Test different paths
    const paths = [
      '/categories/public',
      '/categories/public?limit=5',
      '/categories/public?type=service',
      '/categories',
      '/categories/public/1'
    ];

    for (const path of paths) {
      console.log(`\n📋 Testing ${path}...`);
      const response = await makeRequest(path);
      console.log(`Status: ${response.status}`);
      console.log(`Message: ${response.data?.message || 'No message'}`);
      console.log(`Data: ${JSON.stringify(response.data, null, 2)}`);
    }

    // Test places for comparison
    console.log('\n🏪 Testing /places/public for comparison...');
    const placesResponse = await makeRequest('/places/public');
    console.log(`Places Status: ${placesResponse.status}`);
    console.log(`Places Count: ${placesResponse.data?.results?.length || 0}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugCategories(); 