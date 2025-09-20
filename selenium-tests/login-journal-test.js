/**
 * Single-command automated test for login and journal creation
 * 
 * This script provides a simplified way to run the login and journal creation test
 * with a single command, including server status checks.
 */

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/testConfig.js';
import http from 'http';
import readline from 'readline';

// Add a sleep function to pause between actions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if servers are running
async function checkServers() {
  console.log('🔍 Checking if servers are running...');
  
  const checkUrl = (url) => {
    return new Promise((resolve) => {
      http.get(url, (res) => {
        resolve(res.statusCode < 400); // Any successful status code
      }).on('error', () => {
        resolve(false);
      });
    });
  };
  
  // Check backend
  const backendRunning = await checkUrl('http://localhost:5000');
  console.log(`Backend server (http://localhost:5000): ${backendRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
  
  // Check frontend
  const frontendRunning = await checkUrl('http://localhost:5173');
  console.log(`Frontend server (http://localhost:5173): ${frontendRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
  
  if (!backendRunning || !frontendRunning) {
    console.log('\n⚠️ WARNING: One or both servers are not running!');
    console.log('To start the servers:');
    console.log('  1. Backend: npm run start:backend');
    console.log('  2. Frontend: npm run start:frontend');
    
    // Since you mentioned servers are running, continuing automatically
    console.log('\nYou mentioned servers are running, continuing automatically...');
    return true; // Skip the prompt and continue with the test
  }
  
  return true;
}

// Use Chrome from environment variable or find in common locations
async function findBrowserPath() {
  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) {
    return process.env.CHROMIUM_PATH;
  }
  
  const paths = [
    'D:\\Setups\\chrome-win\\chrome-win\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Chromium\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Chromium\\Application\\chrome.exe',
  ];
  
  for (const path of paths) {
    if (path && fs.existsSync(path)) {
      return path;
    }
  }
  
  return null;
}

async function runAutomatedTest() {
  console.log('🚀 Starting Automated Login & Journal Creation Test...');
  console.log(`⏱️ Start time: ${new Date().toISOString()}`);
  console.log('-----------------------------------------------------\n');
  
  // First check servers
  const shouldContinue = await checkServers();
  if (!shouldContinue) {
    console.log('❌ Test aborted by user');
    return;
  }
  
  let driver = null;
  let testPassed = false;
  let startTime = Date.now();
  
  try {
    // Find browser path
    const browserPath = await findBrowserPath();
    
    if (!browserPath) {
      console.error('❌ Chrome or Chromium not found. Please install or specify the correct path.');
      return;
    }
    
    console.log(`✅ Using browser at: ${browserPath}`);
    
    // Configure Chrome options
    const options = new chrome.Options();
    options.setChromeBinaryPath(browserPath);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1366,768');
    
    // Initialize driver
    console.log('🔧 Initializing WebDriver...');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    // Set timeouts
    await driver.manage().setTimeouts({
      implicit: 10000,
      pageLoad: 30000,
      script: 30000
    });
    
    // STEP 1: Login
    console.log('\n📋 STEP 1: Login Process');
    console.log('--------------------');
    
    // Navigate to login page
    console.log(`🌐 Navigating to login page: ${config.pages.login}`);
    await driver.get(config.pages.login);
    
    // Add a pause to see the login page
    console.log('⏱️ Pausing for 1.5 seconds to view the login page...');
    await sleep(1500);
    
    // Enter login credentials
    console.log(`✏️ Entering email: ${config.testUser.email}`);
    const emailInput = await driver.findElement(By.css('input[name="email"]'));
    await emailInput.clear();
    // Type at moderate speed
    for (const char of config.testUser.email) {
      await emailInput.sendKeys(char);
      await sleep(50); // slight pause between characters
    }
    await sleep(500);
    
    console.log(`✏️ Entering password: ${'*'.repeat(config.testUser.password.length)}`);
    const passwordInput = await driver.findElement(By.css('input[name="password"]'));
    await passwordInput.clear();
    // Type at moderate speed
    for (const char of config.testUser.password) {
      await passwordInput.sendKeys(char);
      await sleep(50); // slight pause between characters
    }
    await sleep(500);
    
    // Submit the form
    console.log('🖱️ Submitting login form...');
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    
    // Pause before clicking the button
    console.log('⏱️ Pausing for 1 second before submitting...');
    await sleep(1000);
    
    await loginButton.click();
    
    // Wait for redirect to dashboard
    console.log('⏳ Waiting for redirect to dashboard...');
    try {
      await driver.wait(
        until.urlContains('/dashboard'),
        15000, 
        'Timed out waiting for dashboard redirect'
      );
      console.log('✅ Login successful!');
      
      // Add pause to view the dashboard
      console.log('⏱️ Pausing for 2 seconds to view the dashboard...');
      await sleep(2000);
    } catch (error) {
      console.log('⚠️ Login failed or no redirect happened');
      // Check if there's an error message
      try {
        const errorElement = await driver.findElement(By.css('.text-red-400, .error'));
        const errorText = await errorElement.getText();
        console.log(`❌ Login error: ${errorText}`);
      } catch (noError) {
        // No error element found
      }
      
      throw new Error('Login failed - check credentials or server status');
    }
    
    // Take dashboard screenshot
    const dashboardScreenshot = await driver.takeScreenshot();
    const dashboardScreenshotPath = path.join(__dirname, 'login-test-dashboard.png');
    fs.writeFileSync(dashboardScreenshotPath, dashboardScreenshot, 'base64');
    console.log(`📸 Dashboard screenshot saved to: ${dashboardScreenshotPath}`);
    
    // STEP 2: Create Journal Entry
    console.log('\n📋 STEP 2: Journal Creation');
    console.log('-----------------------');
    
    // Navigate to new entry page
    console.log(`🌐 Navigating to new entry page: ${config.pages.newEntry}`);
    await driver.get(config.pages.newEntry);
    
    // Pause to view the new entry page
    console.log('⏱️ Pausing for 1.5 seconds to view the new entry page...');
    await sleep(1500);
    
    // Generate journal content with timestamp
    const journalContent = `Automated test journal entry created at ${new Date().toISOString()}.\n\nThis entry was created by a Selenium WebDriver automated test.`;
    
    // Enter journal content
    console.log('✏️ Entering journal content...');
    try {
      // Try different possible selectors for the textarea
      let textarea = null;
      const possibleSelectors = [
        'textarea[placeholder*="Take a moment to reflect"]',
        'textarea[placeholder*="journal"]',
        'textarea',
        '.journal-content',
        '[contenteditable="true"]'
      ];
      
      for (const selector of possibleSelectors) {
        try {
          textarea = await driver.findElement(By.css(selector));
          break;
        } catch (e) {
          // Try next selector
        }
      }
      
      if (!textarea) {
        throw new Error('Could not find journal content input element');
      }
      
      await textarea.clear();
      
      // Type journal content at moderate speed
      console.log('⏱️ Typing journal content...');
      for (const char of journalContent) {
        await textarea.sendKeys(char);
        await sleep(15); // slight pause between characters
      }
      
      console.log('✅ Journal content entered');
      await sleep(1000); // pause to view the completed text
      
      // Try to select mood if mood selector is present
      try {
        // Click the mood selector button
        const moodButtons = await driver.findElements(
          By.css('button[title="Select Mood"], button.mood-selector')
        );
        
        if (moodButtons.length > 0) {
          console.log('😊 Clicking mood selector...');
          await moodButtons[0].click();
          
          // Wait for mood picker and select a mood
          await driver.wait(
            until.elementLocated(By.css('.mood-picker, .emoji-picker, .bg-white')),
            5000,
            'Timed out waiting for mood picker'
          );
          
          // Pause to see the mood picker
          console.log('⏱️ Pausing for 1 second to view mood options...');
          await sleep(1000);
          
          // Find mood options
          const moodOptions = await driver.findElements(
            By.css('.mood-picker button, .emoji-picker button, .bg-white button')
          );
          
          if (moodOptions.length > 0) {
            // Select first mood
            await moodOptions[0].click();
            console.log('✅ Mood selected');
            await sleep(1000);
          }
        }
      } catch (moodError) {
        // Mood selection is optional, continue if it fails
        console.log('ℹ️ Mood selection not available or failed');
      }
      
      // Save the journal entry
      console.log('💾 Saving journal entry...');
      
      // Try different methods to find the save button
      let saveButton = null;
      const saveButtonSelectors = [
        'button[title="Save Entry"]',
        'button[title="Save"]',
        'button.save',
        'button.primary',
        'button[type="submit"]'
      ];
      
      for (const selector of saveButtonSelectors) {
        try {
          saveButton = await driver.findElement(By.css(selector));
          break;
        } catch (e) {
          // Try next selector
        }
      }
      
      if (!saveButton) {
        // If no button found by selector, try by text content
        const allButtons = await driver.findElements(By.css('button'));
        for (const button of allButtons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('save')) {
            saveButton = button;
            break;
          }
        }
      }
      
      if (!saveButton) {
        throw new Error('Could not find save button');
      }
      
      // Pause before saving
      console.log('⏱️ Pausing for 1.5 seconds before saving the journal entry...');
      await sleep(1500);
      
      // Click save button
      await saveButton.click();
      console.log('✅ Save button clicked');
      
      // Wait for redirect back to dashboard
      console.log('⏳ Waiting for redirect to dashboard...');
      await driver.wait(
        until.urlContains('/dashboard'),
        15000, 
        'Timed out waiting for dashboard redirect after saving'
      );
      
      console.log('✅ Journal entry saved successfully!');
      
      // Pause to view the final dashboard with new entry
      console.log('⏱️ Pausing for 3 seconds to view the result...');
      await sleep(3000);
      
      // Take final screenshot
      const finalScreenshot = await driver.takeScreenshot();
      const finalScreenshotPath = path.join(__dirname, 'journal-creation-result.png');
      fs.writeFileSync(finalScreenshotPath, finalScreenshot, 'base64');
      console.log(`📸 Final result screenshot saved to: ${finalScreenshotPath}`);
      
      testPassed = true;
      
    } catch (error) {
      console.error(`❌ Journal creation failed: ${error.message}`);
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Take screenshot on error
    if (driver) {
      try {
        const errorScreenshot = await driver.takeScreenshot();
        const errorScreenshotPath = path.join(__dirname, 'test-error.png');
        fs.writeFileSync(errorScreenshotPath, errorScreenshot, 'base64');
        console.log(`📸 Error screenshot saved to: ${errorScreenshotPath}`);
      } catch (screenshotError) {
        // Ignore screenshot errors
      }
    }
  } finally {
    if (driver) {
      console.log('\n🧹 Closing browser in 2 seconds...');
      await sleep(2000);
      await driver.quit();
    }
    
    const endTime = Date.now();
    const testDuration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n---------------------------------------------');
    console.log(`🏁 Test ${testPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`⏱️ Duration: ${testDuration} seconds`);
    console.log(`⏰ End time: ${new Date().toISOString()}`);
    console.log('---------------------------------------------');
  }
}

// Run the test
runAutomatedTest();