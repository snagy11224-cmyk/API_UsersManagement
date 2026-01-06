#!/usr/bin/env node

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  name: 'testuser',
  password: 'password123'
};

let authToken = '';

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Main test workflow
async function runTests() {
  try {
    console.log('='.repeat(60));
    console.log('API Testing Workflow');
    console.log('='.repeat(60));

    // 1. Register a new user
    console.log('\n1️⃣  REGISTER NEW USER');
    console.log('-'.repeat(60));
    let response = await makeRequest('POST', '/auth/register', TEST_USER);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.body);
    
    if (response.status !== 201) {
      console.log('❌ Registration failed!');
      process.exit(1);
    }
    console.log('✅ Registration successful!');

    // 2. Login to get token
    console.log('\n2️⃣  LOGIN & GET TOKEN');
    console.log('-'.repeat(60));
    response = await makeRequest('POST', '/auth/login', TEST_USER);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.body);

    if (response.status !== 200 || !response.body.token) {
      console.log('❌ Login failed!');
      process.exit(1);
    }

    authToken = response.body.token;
    console.log('✅ Login successful!');
    console.log(`Token: ${authToken.substring(0, 20)}...`);

    // 3. Try to get all users (should work with token)
    console.log('\n3️⃣  GET ALL USERS (with token)');
    console.log('-'.repeat(60));
    response = await makeRequest('GET', '/users', null, authToken);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.body);

    if (response.status === 200) {
      console.log('✅ Successfully retrieved users!');
    } else if (response.status === 401) {
      console.log('❌ Token not recognized (401)');
    } else if (response.status === 403) {
      console.log('❌ No permission (403) - need admin role');
    }

    // 4. Try without token (should fail)
    console.log('\n4️⃣  GET ALL USERS (WITHOUT token) - should fail');
    console.log('-'.repeat(60));
    response = await makeRequest('GET', '/users', null, null);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.body);

    if (response.status === 401) {
      console.log('✅ Correctly rejected request without token!');
    } else {
      console.log('❌ Should have rejected this request!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60));
    console.log('\n📝 Next steps:');
    console.log('1. Go to http://localhost:3000/api-docs');
    console.log('2. Click "Authorize" button');
    console.log(`3. Paste this token: ${authToken}`);
    console.log('4. Try "Try it out" on any endpoint');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
