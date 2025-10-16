#!/usr/bin/env node

/**
 * Verification script for no-auth mode fixes
 * Tests import and note creation functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying No-Auth Mode Fixes...\n');

let errors = [];
let warnings = [];

// 1. Check environment variable is set
console.log('1️⃣ Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('REACT_APP_NO_AUTH=true')) {
    console.log('   ✅ REACT_APP_NO_AUTH is set to true in .env');
  } else {
    errors.push('.env file does not have REACT_APP_NO_AUTH=true');
  }
} else {
  errors.push('.env file not found');
}

// 2. Check api.ts uses correct environment detection
console.log('\n2️⃣ Checking api.ts implementation...');
const apiPath = path.join(__dirname, 'src', 'services', 'api.ts');
if (fs.existsSync(apiPath)) {
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  
  // Check for correct env detection
  if (apiContent.includes("process.env.REACT_APP_NO_AUTH === 'true'")) {
    console.log('   ✅ api.ts uses correct environment detection');
  } else {
    errors.push('api.ts does not use correct process.env.REACT_APP_NO_AUTH detection');
  }
  
  // Check importNoteFromFile routes to no-auth API
  if (apiContent.includes('importNoteFromFile') && 
      apiContent.includes('noAuthApi.importNoteFromFile')) {
    console.log('   ✅ importNoteFromFile routes to no-auth API');
  } else {
    errors.push('importNoteFromFile does not properly route to no-auth API');
  }
  
  // Check createNote routes to no-auth API
  if (apiContent.includes('createNote') && 
      apiContent.includes('noAuthApi.createNote')) {
    console.log('   ✅ createNote routes to no-auth API');
  } else {
    errors.push('createNote does not properly route to no-auth API');
  }
} else {
  errors.push('api.ts not found');
}

// 3. Check api-noauth.ts implementation
console.log('\n3️⃣ Checking api-noauth.ts implementation...');
const noAuthApiPath = path.join(__dirname, 'src', 'services', 'api-noauth.ts');
if (fs.existsSync(noAuthApiPath)) {
  const noAuthContent = fs.readFileSync(noAuthApiPath, 'utf8');
  
  // Check for input validation in createNote
  if (noAuthContent.includes('createNote') && 
      noAuthContent.includes('payload.title') &&
      noAuthContent.includes('payload.content')) {
    console.log('   ✅ createNote has input validation');
  } else {
    warnings.push('createNote may lack proper input validation');
  }
  
  // Check importNoteFromFile exists
  if (noAuthContent.includes('importNoteFromFile')) {
    console.log('   ✅ importNoteFromFile is implemented');
  } else {
    errors.push('importNoteFromFile not found in api-noauth.ts');
  }
  
  // Check for summary generation
  if (noAuthContent.includes('generateLocalSummary')) {
    console.log('   ✅ Local summary generation is implemented');
  } else {
    warnings.push('Local summary generation may not be implemented');
  }
} else {
  errors.push('api-noauth.ts not found');
}

// 4. Check Notes.tsx page
console.log('\n4️⃣ Checking Notes.tsx page...');
const notesPagePath = path.join(__dirname, 'src', 'pages', 'Notes.tsx');
if (fs.existsSync(notesPagePath)) {
  const notesContent = fs.readFileSync(notesPagePath, 'utf8');
  
  // Check NO_AUTH_MODE detection
  if (notesContent.includes("process.env.REACT_APP_NO_AUTH === 'true'")) {
    console.log('   ✅ Notes.tsx detects no-auth mode correctly');
  } else {
    errors.push('Notes.tsx does not detect no-auth mode correctly');
  }
  
  // Check import button is conditionally shown
  if (notesContent.includes('NO_AUTH_MODE') && 
      notesContent.includes('Import')) {
    console.log('   ✅ Import UI is conditionally rendered');
  } else {
    warnings.push('Import UI may not be properly conditional');
  }
  
  // Check error handling
  if (notesContent.includes('catch') && notesContent.includes('setError')) {
    console.log('   ✅ Error handling is present');
  } else {
    warnings.push('Error handling may be incomplete');
  }
} else {
  errors.push('Notes.tsx not found');
}

// 5. Check NoteForm component
console.log('\n5️⃣ Checking NoteForm.tsx component...');
const formPath = path.join(__dirname, 'src', 'components', 'Notes', 'NoteForm.tsx');
if (fs.existsSync(formPath)) {
  const formContent = fs.readFileSync(formPath, 'utf8');
  
  // Check error extraction
  if (formContent.includes('e?.message') || formContent.includes('errorMessage')) {
    console.log('   ✅ Error message extraction is implemented');
  } else {
    warnings.push('Error message extraction may be incomplete');
  }
  
  // Check validation
  if (formContent.includes('title.trim()') && formContent.includes('content.trim()')) {
    console.log('   ✅ Input validation is present');
  } else {
    warnings.push('Input validation may be incomplete');
  }
} else {
  errors.push('NoteForm.tsx not found');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ All checks passed! No-auth mode should work correctly.');
  console.log('\n📝 Next steps:');
  console.log('   1. Open the app in browser: https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000');
  console.log('   2. Test importing a .txt or .md file');
  console.log('   3. Test creating a new note');
  console.log('   4. Verify summaries are generated automatically');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('\n❌ ERRORS FOUND:');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach((warn, i) => {
      console.log(`   ${i + 1}. ${warn}`);
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Verification failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n⚠️  Verification completed with warnings. Review warnings above.');
    process.exit(0);
  }
}
