#!/usr/bin/env node

/**
 * Configuration verification script for preview environment.
 * Checks that all required settings are in place for frontend-backend communication.
 */

const fs = require('fs');
const path = require('path');

console.log('\n=== Frontend Configuration Verification ===\n');

let hasErrors = false;

// Check 1: .env file exists
console.log('1. Checking .env file...');
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('   ❌ .env file not found');
  console.log('   → Run: cp .env.example .env');
  hasErrors = true;
} else {
  console.log('   ✓ .env file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Check 2: API Base URL
  console.log('\n2. Checking REACT_APP_API_BASE_URL...');
  const apiUrlMatch = envContent.match(/REACT_APP_API_BASE_URL=(.+)/);
  if (!apiUrlMatch) {
    console.log('   ❌ REACT_APP_API_BASE_URL not set');
    console.log('   → Add: REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1');
    hasErrors = true;
  } else {
    const apiUrl = apiUrlMatch[1].trim();
    console.log(`   ✓ REACT_APP_API_BASE_URL set to: ${apiUrl}`);
    
    if (!apiUrl.includes('/api/v1')) {
      console.log('   ⚠ WARNING: URL should include /api/v1 path');
      hasErrors = true;
    }
    
    if (apiUrl.includes('localhost') && !apiUrl.includes('3001')) {
      console.log('   ⚠ WARNING: Backend should be on port 3001');
    }
  }
  
  // Check 3: Debug mode
  console.log('\n3. Checking REACT_APP_API_DEBUG...');
  const debugMatch = envContent.match(/REACT_APP_API_DEBUG=(.+)/);
  if (!debugMatch || debugMatch[1].trim().toLowerCase() !== 'true') {
    console.log('   ⚠ Debug logging not enabled (optional but recommended)');
    console.log('   → Add: REACT_APP_API_DEBUG=true');
  } else {
    console.log('   ✓ Debug logging enabled');
  }
  
  // Check 4: Host configuration
  console.log('\n4. Checking HOST configuration...');
  const hostMatch = envContent.match(/HOST=(.+)/);
  if (!hostMatch || hostMatch[1].trim() !== '0.0.0.0') {
    console.log('   ⚠ HOST not set to 0.0.0.0 (required for preview)');
    console.log('   → Add: HOST=0.0.0.0');
  } else {
    console.log('   ✓ HOST set to 0.0.0.0');
  }
  
  // Check 5: Host check disabled
  console.log('\n5. Checking DANGEROUSLY_DISABLE_HOST_CHECK...');
  const hostCheckMatch = envContent.match(/DANGEROUSLY_DISABLE_HOST_CHECK=(.+)/);
  if (!hostCheckMatch || hostCheckMatch[1].trim().toLowerCase() !== 'true') {
    console.log('   ⚠ Host check not disabled (required for preview)');
    console.log('   → Add: DANGEROUSLY_DISABLE_HOST_CHECK=true');
  } else {
    console.log('   ✓ Host check disabled');
  }
}

// Check 6: package.json proxy
console.log('\n6. Checking package.json proxy...');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = fs.readFileSync(packagePath, 'utf-8');
  const packageJson = JSON.parse(packageContent);
  
  if (packageJson.proxy) {
    console.log(`   ✓ Proxy configured: ${packageJson.proxy}`);
    console.log('   ℹ Note: With REACT_APP_API_BASE_URL set, proxy is not used');
  } else {
    console.log('   ℹ No proxy configured (OK if using absolute URLs)');
  }
} else {
  console.log('   ❌ package.json not found');
  hasErrors = true;
}

// Check 7: Required files
console.log('\n7. Checking required files...');
const requiredFiles = [
  'src/services/api.ts',
  'src/services/auth.tsx',
  'src/pages/Register.tsx',
  'src/pages/Login.tsx',
  'src/components/BackendHealthCheck.tsx'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ Missing: ${file}`);
    allFilesExist = false;
    hasErrors = true;
  }
}

if (allFilesExist) {
  console.log('   ✓ All required files present');
}

// Summary
console.log('\n=== Summary ===');
if (hasErrors) {
  console.log('❌ Configuration has issues that need to be fixed');
  console.log('\nRecommended actions:');
  console.log('1. Fix the issues listed above');
  console.log('2. Restart the dev server: npm start');
  console.log('3. Check browser console for any errors');
  console.log('\nFor detailed help, see: PREVIEW-CONFIG-GUIDE.md');
  process.exit(1);
} else {
  console.log('✅ Configuration looks good!');
  console.log('\nNext steps:');
  console.log('1. Ensure backend is running on port 3001');
  console.log('2. Start frontend: npm start');
  console.log('3. Open: https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000');
  console.log('4. Test registration to verify connectivity');
  console.log('\nIf backend is not available, you\'ll see a clear error message with troubleshooting steps.');
  process.exit(0);
}
