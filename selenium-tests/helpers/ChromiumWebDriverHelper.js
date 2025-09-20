/**
 * ChromiumWebDriverHelper - Selenium WebDriver helper using Chromium
 * 
 * This helper class configures WebDriver to use Chromium instead of Chrome
 * for more stable test automation.
 */

import { Builder, Browser, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ChromiumWebDriverHelper {
  constructor() {
    this.driver = null;
    this.chromiumPath = null;
  }

  /**
   * Find Chromium binary path
   * @returns {Promise<string|null>} Path to Chromium binary or null if not found
   */
  async findChromiumPath() {
    // Check if path is provided via environment variable
    if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) {
      console.log(`✅ Using Chromium from environment variable: ${process.env.CHROMIUM_PATH}`);
      return process.env.CHROMIUM_PATH;
    }

    // Common paths where Chromium might be installed
    const CHROMIUM_PATHS = [
      // Your specific Chrome path
      'D:\\Setups\\chrome-win\\chrome-win\\chrome.exe',
      
      // Standard installation paths
      'C:\\Program Files\\Chromium\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe',
      'C:\\Users\\Administrator\\AppData\\Local\\Chromium\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Chromium\\Application\\chrome.exe',
      
      // Additional common paths
      'C:\\Program Files\\Chromium\\chrome.exe',
      'C:\\Program Files (x86)\\Chromium\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Chromium\\chrome.exe',
      
      // Path for Chromium downloaded from woolyss.com
      process.env.LOCALAPPDATA + '\\Chromium\\bin\\chrome.exe',
      'C:\\Chromium\\chrome.exe',
      'C:\\Chromium\\bin\\chrome.exe',
      'C:\\Chromium\\Application\\chrome.exe',
      
      // Try regular Chrome paths as fallback
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
      
      // Default Edge path as last resort
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    
    // Check all paths
    for (const chromiumPath of CHROMIUM_PATHS) {
      if (chromiumPath && fs.existsSync(chromiumPath)) {
        console.log(`✅ Found browser at: ${chromiumPath}`);
        return chromiumPath;
      }
    }
    
    // Try to find in Program Files directories
    try {
      const programFiles = ['C:\\Program Files', 'C:\\Program Files (x86)'];
      
      for (const dir of programFiles) {
        if (!fs.existsSync(dir)) continue;
        
        const subdirs = fs.readdirSync(dir);
        
        for (const subdir of subdirs) {
          // Look for directories that might contain Chromium
          if (subdir.toLowerCase().includes('chrom')) {
            const possiblePath = path.join(dir, subdir, 'Application', 'chrome.exe');
            const altPath = path.join(dir, subdir, 'chrome.exe');
            
            if (fs.existsSync(possiblePath)) {
              console.log(`✅ Found Chromium at: ${possiblePath}`);
              return possiblePath;
            }
            
            if (fs.existsSync(altPath)) {
              console.log(`✅ Found Chromium at: ${altPath}`);
              return altPath;
            }
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Error searching Program Files:', error.message);
    }
    
    return null;
  }

  /**
   * Initialize WebDriver with Chromium
   * @param {Object} options Additional WebDriver options
   * @returns {Promise<WebDriver>} Selenium WebDriver instance
   */
  async initializeDriver(options = {}) {
    console.log('🔧 Setting up Chromium WebDriver...');

    try {
      // Find Chromium binary
      this.chromiumPath = options.chromiumPath || await this.findChromiumPath();

      if (!this.chromiumPath) {
        console.error('❌ Chromium not found in standard locations. Please try one of the following:');
        console.error('   1. Install Chromium from https://www.chromium.org/getting-involved/download-chromium/');
        console.error('   2. Specify the path manually by setting CHROMIUM_PATH environment variable:');
        console.error('      $env:CHROMIUM_PATH="C:\\path\\to\\chrome.exe"; npm run quicktest:chromium');
        console.error('   3. Or install Chrome and it will be used as a fallback');
        
        throw new Error('Chromium not found. Please install Chromium browser or specify the correct path.');
      }

      console.log(`✅ Found browser at: ${this.chromiumPath}`);

      // Configure Chrome options to use Chromium
      const chromeOptions = new chrome.Options();
      chromeOptions.setChromeBinaryPath(this.chromiumPath);

      // Essential stability options
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-dev-shm-usage');
      chromeOptions.addArguments('--disable-gpu');
      chromeOptions.addArguments('--window-size=1280,720');
      chromeOptions.addArguments('--disable-extensions');

      // Additional stability options for Chromium
      chromeOptions.addArguments('--disable-background-networking');
      chromeOptions.addArguments('--disable-background-timer-throttling');
      chromeOptions.addArguments('--disable-backgrounding-occluded-windows');
      chromeOptions.addArguments('--disable-breakpad');
      chromeOptions.addArguments('--disable-component-extensions-with-background-pages');
      chromeOptions.addArguments('--disable-features=TranslateUI,BlinkGenPropertyTrees');
      chromeOptions.addArguments('--disable-ipc-flooding-protection');
      chromeOptions.addArguments('--disable-renderer-backgrounding');
      chromeOptions.addArguments('--enable-automation');

      // Apply headless mode if specified
      if (options.headless) {
        chromeOptions.addArguments('--headless=new');
      }

      // Apply any additional arguments
      if (options.additionalArguments && Array.isArray(options.additionalArguments)) {
        for (const arg of options.additionalArguments) {
          chromeOptions.addArguments(arg);
        }
      }

      console.log('⏳ Creating Chromium driver...');
      console.log(`⏱️ Start time: ${new Date().toISOString()}`);

      // Create driver with explicit service options
      const service = new chrome.ServiceBuilder()
        .enableVerboseLogging()
        .setStdio('inherit');

      // Add browser logging preferences
      const loggingPrefs = new chrome.Options.Logging();
      loggingPrefs.setLevel('browser', 'ALL');
      chromeOptions.setLoggingPrefs(loggingPrefs);

      this.driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(chromeOptions)
        .setChromeService(service)
        .build();

      console.log('✅ Chromium WebDriver created successfully!');
      console.log(`⏱️ End time: ${new Date().toISOString()}`);

      // Set conservative timeouts
      await this.driver.manage().setTimeouts({
        implicit: 5000,
        pageLoad: 15000,
        script: 10000
      });

      return this.driver;

    } catch (error) {
      console.error('❌ Chromium WebDriver creation failed:', error.message);

      if (error.message.includes('ChromeDriver')) {
        console.log('💡 ChromeDriver issues detected. Try:');
        console.log('   1. Update Chromium to latest version');
        console.log('   2. Run: npm run setup');
        console.log('   3. Or install Chromium from: https://www.chromium.org/getting-involved/download-chromium/');
      }

      throw error;
    }
  }

  /**
   * Navigate to a URL
   * @param {string} url URL to navigate to
   */
  async navigateTo(url) {
    if (!this.driver) {
      throw new Error('WebDriver not initialized');
    }

    try {
      console.log(`🌐 Navigating to: ${url}`);
      await this.driver.get(url);

      // Wait for page to be interactive
      await this.driver.wait(
        () => this.driver.executeScript('return document.readyState === "complete"'),
        10000
      );

      console.log('✅ Page loaded successfully');
    } catch (error) {
      console.error(`❌ Navigation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find an element
   * @param {By} locator Selenium locator
   * @param {number} timeout Timeout in milliseconds
   * @returns {Promise<WebElement>} Found element
   */
  async findElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  /**
   * Find multiple elements
   * @param {By} locator Selenium locator
   * @param {number} timeout Timeout in milliseconds
   * @returns {Promise<WebElement[]>} Found elements
   */
  async findElements(locator, timeout = 10000) {
    await this.driver.wait(until.elementLocated(locator), timeout);
    return await this.driver.findElements(locator);
  }

  /**
   * Take a screenshot
   * @param {string} filename Filename to save screenshot
   * @returns {Promise<string>} Path to saved screenshot
   */
  async takeScreenshot(filename) {
    if (!this.driver) {
      throw new Error('WebDriver not initialized');
    }

    try {
      const screenshot = await this.driver.takeScreenshot();
      const screenshotPath = path.join(__dirname, '..', filename || `screenshot-${Date.now()}.png`);
      fs.writeFileSync(screenshotPath, screenshot, 'base64');
      console.log(`📸 Screenshot saved to: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.error(`❌ Screenshot failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Quit WebDriver
   */
  async quit() {
    if (this.driver) {
      console.log('🧹 Closing Chromium browser...');
      await this.driver.quit();
      this.driver = null;
      console.log('✅ Chromium WebDriver closed successfully');
    }
  }

  /**
   * Get current URL
   * @returns {Promise<string>} Current URL
   */
  async getCurrentUrl() {
    if (!this.driver) {
      throw new Error('WebDriver not initialized');
    }
    return await this.driver.getCurrentUrl();
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async getPageTitle() {
    if (!this.driver) {
      throw new Error('WebDriver not initialized');
    }
    return await this.driver.getTitle();
  }

  /**
   * Wait for a condition
   * @param {Function} condition Condition to wait for
   * @param {number} timeout Timeout in milliseconds
   * @returns {Promise<any>} Result of the condition
   */
  async wait(condition, timeout = 10000) {
    if (!this.driver) {
      throw new Error('WebDriver not initialized');
    }
    return await this.driver.wait(condition, timeout);
  }
}

// Quick test function
export async function testChromium() {
  const helper = new ChromiumWebDriverHelper();
  
  try {
    await helper.initializeDriver();
    
    // Test with a reliable external site
    await helper.navigateTo('https://www.google.com');
    
    const title = await helper.getPageTitle();
    console.log(`✅ Test successful! Page title: "${title}"`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Chromium test failed:', error.message);
    return false;
  } finally {
    await helper.quit();
  }
}