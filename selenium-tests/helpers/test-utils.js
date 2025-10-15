/**
 * Utility functions for Selenium tests
 */

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { config } from '../config/testConfig.js';

// Add a sleep function to pause between actions
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if servers are running
export async function checkServers() {
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
    
    console.log('\nYou mentioned servers are running, continuing automatically...');
    return true;
  }
  
  return true;
}

// Use Chrome from environment variable or find in common locations
export async function findBrowserPath() {
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

// Initialize WebDriver
export async function initializeDriver() {
  // Find browser path
  const browserPath = await findBrowserPath();
  
  if (!browserPath) {
    throw new Error('Chrome or Chromium not found. Please install or specify the correct path.');
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
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  // Set timeouts
  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 30000
  });
  
  return driver;
}

// Take and save screenshot
export async function takeScreenshot(driver, filename) {
  try {
    const screenshot = await driver.takeScreenshot();
    const screenshotPath = path.join(path.dirname(path.dirname(__filename)), filename);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);
    return screenshotPath;
  } catch (error) {
    console.log(`⚠️ Failed to take screenshot: ${error.message}`);
    return null;
  }
}

// Login function that can be reused by other tests
export async function performLogin(driver) {
  console.log('\n📋 STEP: Login Process');
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
    
    return true;
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
}