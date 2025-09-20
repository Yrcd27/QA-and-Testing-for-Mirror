/**
 * Simple Selenium test for CI/CD pipeline
 * This is a simplified version that works with our basic HTML test page
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runCiTest() {
  console.log('Starting CI Selenium test');
  
  let driver;
  
  try {
    // Setup Chrome options for headless running
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    // Build the driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    console.log('Navigating to test page');
    await driver.get('http://localhost:5173');
    
    // Wait for the page to load
    await driver.wait(until.elementLocated(By.id('login-form')), 10000);
    
    console.log('Page loaded, performing login test');
    
    // Find and fill the form elements
    const emailInput = await driver.findElement(By.id('email'));
    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.id('login-button'));
    
    // Enter test credentials
    await emailInput.sendKeys('test@example.com');
    await passwordInput.sendKeys('password123');
    
    console.log('Credentials entered, submitting form');
    
    // Click login button
    await loginButton.click();
    
    // Check for response (this is just for demonstration)
    try {
      // Wait for message element to be displayed
      await driver.wait(until.elementLocated(By.id('message')), 5000);
      const messageElement = await driver.findElement(By.id('message'));
      const isDisplayed = await messageElement.isDisplayed();
      
      console.log('Login form submitted, message displayed:', isDisplayed);
      console.log('Test completed successfully');
      
      return true;
    } catch (error) {
      console.log('Error checking for message:', error.message);
      return false;
    }
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  } finally {
    if (driver) {
      console.log('Closing WebDriver');
      await driver.quit();
    }
  }
}

// Run the test and exit with appropriate code
runCiTest().then(success => {
  if (success) {
    console.log('CI test passed');
    process.exit(0);
  } else {
    console.log('CI test failed');
    process.exit(1);
  }
}).catch(error => {
  console.error('Error running test:', error);
  process.exit(1);
});