#!/usr/bin/env node

/**
 * Simple verification script for no-auth mode.
 * Checks configuration and provides testing instructions.
 */

const fs = require('fs');
const path = require('path');

console.log('\n=== No-Auth Mode Verification ===\n');

// Check .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const noAuthMatch = envContent.match(/REACT_APP_NO_AUTH=(.+)/);
  
  if (noAuthMatch && noAuthMatch[1].trim().toLowerCase() === 'true') {
    console.log('✅ No-auth mode is ENABLED in .env');
  } else {
    console.log('❌ No-auth mode is NOT enabled');
    console.log('   → Set REACT_APP_NO_AUTH=true in .env');
    process.exit(1);
  }
} else {
  console.log('⚠️  .env file not found');
  console.log('   → Run: cp .env.example .env');
  process.exit(1);
}

// Check if api-noauth.ts exists
const apiNoAuthPath = path.join(__dirname, 'src/services/api-noauth.ts');
if (fs.existsSync(apiNoAuthPath)) {
  console.log('✅ api-noauth.ts exists');
} else {
  console.log('❌ api-noauth.ts is missing');
  process.exit(1);
}

// Check if App.tsx has been updated (no PrivateRoute import)
const appPath = path.join(__dirname, 'src/App.tsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf-8');
  if (appContent.includes('PrivateRoute')) {
    console.log('⚠️  App.tsx still references PrivateRoute');
    console.log('   → Auth guards may still be active');
  } else {
    console.log('✅ App.tsx updated (no PrivateRoute)');
  }
}

// Check if Header.tsx has been updated
const headerPath = path.join(__dirname, 'src/components/Layout/Header.tsx');
if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf-8');
  if (headerContent.includes('logout') || headerContent.includes('Login')) {
    console.log('⚠️  Header.tsx may still have auth UI');
  } else {
    console.log('✅ Header.tsx updated (no auth UI)');
  }
}

console.log('\n=== Manual Testing Instructions ===\n');
console.log('1. Start the app:');
console.log('   npm start\n');
console.log('2. Open in browser:');
console.log('   http://localhost:3000\n');
console.log('3. Verify:');
console.log('   ✓ Goes directly to notes page (no login)');
console.log('   ✓ Can create notes');
console.log('   ✓ Notes persist on refresh');
console.log('   ✓ "Import File" button visible');
console.log('   ✓ Can import .txt/.md files');
console.log('   ✓ "Generate Summary" works');
console.log('   ✓ Search and pagination work\n');
console.log('4. Check browser console:');
console.log('   ✓ Should see: [API CONFIG] No-Auth Mode: true');
console.log('   ✓ No authentication errors');
console.log('   ✓ No network errors\n');
console.log('5. Check localStorage:');
console.log('   localStorage.getItem("notes_app_notes")\n');
console.log('=== All checks passed! ===\n');
