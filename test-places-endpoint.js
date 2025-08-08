const axios = require('axios');

const BASE_URL = 'http://localhost:3000/v1';

async function testPlacesEndpoint() {
  console.log('Testing /places endpoint...\n');

  try {
    // Test 1: Without authentication (should return only approved places)
    console.log('1. Testing without authentication:');
    const response1 = await axios.get(`${BASE_URL}/places`);
    console.log('Status:', response1.status);
    console.log('Data length:', response1.data.data.length);
    console.log('All places approved:', response1.data.data.every(place => place.approvalStatus === 'approved'));
    console.log('');

    // Test 2: With user authentication (should return only approved places)
    console.log('2. Testing with user authentication:');
    // You would need to get a user token here
    // const userToken = 'your-user-token';
    // const response2 = await axios.get(`${BASE_URL}/places`, {
    //   headers: { Authorization: `Bearer ${userToken}` }
    // });
    console.log('(Skipped - need user token)');
    console.log('');

    // Test 3: With admin authentication (should return all places)
    console.log('3. Testing with admin authentication:');
    // You would need to get an admin token here
    // const adminToken = 'your-admin-token';
    // const response3 = await axios.get(`${BASE_URL}/places`, {
    //   headers: { Authorization: `Bearer ${adminToken}` }
    // });
    console.log('(Skipped - need admin token)');
    console.log('');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testPlacesEndpoint(); 