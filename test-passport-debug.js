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

async function debugPassport() {
  console.log('🔍 Debugging Passport Middleware...\n');

  try {
    // Test with different headers
    const tests = [
      { path: '/categories/public', headers: {} },
      { path: '/categories/public', headers: { 'Authorization': '' } },
      { path: '/categories/public', headers: { 'Authorization': 'Bearer ' } },
      { path: '/categories/public', headers: { 'Authorization': 'Bearer invalid' } },
      { path: '/places/public', headers: {} },
      { path: '/places/public', headers: { 'Authorization': '' } },
    ];

    for (const test of tests) {
      console.log(`\n📋 Testing ${test.path} with headers:`, test.headers);
      const response = await makeRequest(test.path, test.headers);
      console.log(`Status: ${response.status}`);
      console.log(`Message: ${response.data?.message || 'No message'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugPassport(); 