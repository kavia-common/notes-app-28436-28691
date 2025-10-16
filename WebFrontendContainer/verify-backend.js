#!/usr/bin/env node

/**
 * Simple script to verify backend connectivity and API endpoints.
 * Run with: node verify-backend.js
 */

const axios = require('axios');

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

console.log('\n=== Backend API Verification ===');
console.log('Target URL:', baseURL);
console.log('');

async function checkHealth() {
  try {
    console.log('1. Checking health endpoint...');
    const response = await axios.get(`${baseURL.replace('/api/v1', '')}/health`, { timeout: 5000 });
    console.log('   ✓ Health check passed:', response.status);
    return true;
  } catch (err) {
    console.log('   ✗ Health check failed:', err.message);
    return false;
  }
}

async function checkAuth() {
  try {
    console.log('2. Checking auth endpoints (expecting 400/422 for invalid payload)...');
    const response = await axios.post(`${baseURL}/auth/login`, {}, { 
      timeout: 5000,
      validateStatus: () => true 
    });
    if (response.status === 400 || response.status === 422) {
      console.log('   ✓ Auth endpoint accessible:', response.status);
      return true;
    }
    console.log('   ? Unexpected status:', response.status);
    return true;
  } catch (err) {
    console.log('   ✗ Auth endpoint failed:', err.message);
    return false;
  }
}

async function checkNotes() {
  try {
    console.log('3. Checking notes endpoint (expecting 401 unauthorized)...');
    const response = await axios.get(`${baseURL}/notes`, { 
      timeout: 5000,
      validateStatus: () => true 
    });
    if (response.status === 401) {
      console.log('   ✓ Notes endpoint accessible (auth required):', response.status);
      return true;
    }
    console.log('   ? Unexpected status:', response.status);
    return true;
  } catch (err) {
    console.log('   ✗ Notes endpoint failed:', err.message);
    return false;
  }
}

async function main() {
  const health = await checkHealth();
  const auth = await checkAuth();
  const notes = await checkNotes();
  
  console.log('\n=== Summary ===');
  if (health && auth && notes) {
    console.log('✓ All checks passed! Backend is accessible and responding.');
    console.log('You can now start the frontend with: npm start');
    process.exit(0);
  } else {
    console.log('✗ Some checks failed. Please ensure:');
    console.log('  1. Backend is running on', baseURL);
    console.log('  2. CORS is configured to allow', 'http://localhost:3000');
    console.log('  3. All API routes are properly registered');
    process.exit(1);
  }
}

main();
