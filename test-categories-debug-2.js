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

async function debugCategories() {
  console.log('🔍 Debugging Categories Routes...\n');

  try {
    // Test different paths
    const tests = [
      { path: '/categories/public', description: 'Categories public endpoint' },
      { path: '/categories/public?limit=5', description: 'Categories public with query params' },
      { path: '/categories', description: 'Categories authenticated endpoint' },
      { path: '/places/public', description: 'Places public endpoint (for comparison)' },
      { path: '/places', description: 'Places authenticated endpoint (for comparison)' },
    ];

    for (const test of tests) {
      console.log(`\n📋 Testing: ${test.description}`);
      console.log(`Path: ${test.path}`);
      const response = await makeRequest(test.path);
      console.log(`Status: ${response.status}`);
      console.log(`Message: ${response.data?.message || 'No message'}`);
      if (response.status === 200) {
        console.log(`Data count: ${response.data?.data?.results?.length || 0}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugCategories(); 