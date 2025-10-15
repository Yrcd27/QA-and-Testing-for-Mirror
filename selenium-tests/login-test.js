
import { By } from 'selenium-webdriver';
import { 
  sleep,
  checkServers, 
  initializeDriver,
  takeScreenshot,
  performLogin
} from './helpers/test-utils.js';

async function runLoginTest() {
  console.log('Starting Automated Login Test...');
  console.log(`Start time: ${new Date().toISOString()}`);
  console.log('-----------------------------------------------------\n');
  
  // First check servers
  const shouldContinue = await checkServers();
  if (!shouldContinue) {
    console.log(' Test aborted by user');
    return;
  }
  
  let driver = null;
  let testPassed = false;
  let startTime = Date.now();
  
  try {
    // Initialize WebDriver
    driver = await initializeDriver();
    
    // Perform login
    await performLogin(driver);
    
    // Take dashboard screenshot
    await takeScreenshot(driver, 'login-test-dashboard.png');
    
    // Test successful
    testPassed = true;
    
  } catch (error) {
    console.error('Test failed:', error.message);
    
    // Take screenshot on error
    if (driver) {
      await takeScreenshot(driver, 'login-test-error.png');
    }
  } finally {
    if (driver) {
      console.log('\n Closing browser in 2 seconds...');
      await sleep(2000);
      await driver.quit();
    }
    
    const endTime = Date.now();
    const testDuration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n---------------------------------------------');
    console.log(`Login Test ${testPassed ? 'PASSED ' : 'FAILED '}`);
    console.log(`⏱Duration: ${testDuration} seconds`);
    console.log(`End time: ${new Date().toISOString()}`);
    console.log('---------------------------------------------');
  }
}

// Run the login test
runLoginTest();