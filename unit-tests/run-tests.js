// run-tests.js
// Simple script to run Jest directly from Node.js in proper sequence
const { execSync } = require('child_process');

try {
  console.log('\n=== Running Registration Tests First ===\n');
  // Run registration tests first
  execSync('node ./node_modules/jest/bin/jest.js auth/registration.test.js --runInBand', { stdio: 'inherit' });
  
  console.log('\n=== Running Login Tests Second ===\n');
  // Then run login tests
  execSync('node ./node_modules/jest/bin/jest.js auth/login.test.js --runInBand', { stdio: 'inherit' });
  
  console.log('\n=== All tests completed ===\n');
} catch (error) {
  console.error('Error running tests:', error.message);
  process.exit(1);
}