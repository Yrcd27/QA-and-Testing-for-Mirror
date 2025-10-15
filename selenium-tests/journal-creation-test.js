/**
 * Automated test for journal creation functionality
 */

import { By } from 'selenium-webdriver';
import { 
  sleep,
  checkServers, 
  initializeDriver,
  performLogin
} from './helpers/test-utils.js';

// Function to create a new journal entry
async function createJournalEntry(driver) {
  console.log('\nCreating new journal entry...');
  
  // Navigate to journal creation page
  await driver.findElement(By.css('a[href="/journal/new"]')).click();
  console.log(' Navigated to journal creation page');
  
  // Wait for form to load
  await driver.sleep(1000);
  
  // Generate a random title with timestamp to ensure uniqueness
  const randomTitle = `Test Journal Entry ${new Date().toISOString()}`;
  
  // Fill out the form
  await driver.findElement(By.id('title')).sendKeys(randomTitle);
  console.log('Entered journal title');
  
  await driver.findElement(By.id('content')).sendKeys('This is an automated test journal entry created by Selenium.');
  console.log('Entered journal content');
  
  // Submit the form
  await driver.findElement(By.css('button[type="submit"]')).click();
  console.log('Submitted journal form');
  
  // Wait for redirect to journal list
  await driver.sleep(2000);
  
  // Verify the journal was created by looking for the title in the list
  const pageSource = await driver.getPageSource();
  if (pageSource.includes(randomTitle)) {
    console.log('Journal entry successfully created and visible in the list');
    return true;
  } else {
    console.error('Created journal entry not found in the list');
    return false;
  }
}

async function runJournalCreationTest() {
  console.log('Starting Automated Journal Creation Test...');
  console.log(`⏱Start time: ${new Date().toISOString()}`);
  console.log('-----------------------------------------------------\n');
  
  // First check servers
  const shouldContinue = await checkServers();
  if (!shouldContinue) {
    console.log('Test aborted by user');
    return;
  }
  
  let driver = null;
  let testPassed = false;
  let startTime = Date.now();
  
  try {
    // Initialize WebDriver
    driver = await initializeDriver();
    
    // Perform login first (required to access journal features)
    await performLogin(driver);
    
    // Create a new journal entry
    const journalCreated = await createJournalEntry(driver);
    
    // Set test result based on journal creation
    testPassed = journalCreated;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (driver) {
      console.log('\n🧹 Closing browser in 2 seconds...');
      await sleep(2000);
      await driver.quit();
    }
    
    const endTime = Date.now();
    const testDuration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n---------------------------------------------');
    console.log(`🏁 Journal Creation Test ${testPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`⏱️ Duration: ${testDuration} seconds`);
    console.log(`⏰ End time: ${new Date().toISOString()}`);
    console.log('---------------------------------------------');
  }
}

// Run the journal creation test
runJournalCreationTest();