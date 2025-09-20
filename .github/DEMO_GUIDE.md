# CI/CD Demo Guide for Viva Presentation

This guide will help you effectively demonstrate your CI/CD pipeline running all unit and automation tests during your viva presentation.

## Key Components to Demonstrate

1. **GitHub Actions Workflow**: Shows automatic building and testing
2. **Unit Tests**: Verifies backend API functionality
3. **Selenium Tests**: Ensures frontend UI works correctly

## Preparation Before Viva

1. **Fix your code**:
   - Ensure your backend and frontend code is properly configured
   - Make sure tests are working locally before pushing to GitHub

2. **Prepare a small change**:
   - Have a small code change ready to commit during the presentation
   - This will demonstrate the automatic triggering of the pipeline

## Demo Script for the Viva

### 1. Show the GitHub Actions Configuration

1. Open your repository on GitHub
2. Navigate to `.github/workflows` directory
3. Show both workflow files:
   - `main.yml`: The complete CI/CD pipeline
   - `run-tests.yml`: The specialized test-focused workflow

**Highlight these key parts:**
- How the workflow is triggered (push to main, pull requests)
- MongoDB setup for testing
- Backend and frontend build steps
- Test execution configuration

### 2. Show Previous Successful Runs

1. Go to the "Actions" tab on GitHub
2. Show a completed workflow run
3. Walk through the build and test logs:
   - Point out the backend build
   - Show frontend build
   - Highlight the unit tests results
   - Show the Selenium tests results

### 3. Demonstrate a Manual Test Run

1. Click on "Actions" tab
2. Select the "Mirror App CI/CD Pipeline - Tests Only" workflow
3. Click "Run workflow" button
4. Select "unit" as the test type
5. Start the workflow and explain:
   - "This specialized workflow allows us to run specific test suites on demand"
   - "We're running just the unit tests now, but we could run Selenium tests or both"

### 4. Explain Test Reports

While waiting for the workflow to run, explain:

- **Unit Tests**: "These verify our API endpoints, authentication logic, and data validation"
- **Selenium Tests**: "These simulate real user interactions to ensure the UI works correctly"

### 5. Demonstrate a Full Pipeline Run (if time permits)

1. Make the small code change you prepared
2. Commit and push to GitHub
3. Show how the full pipeline is automatically triggered

## Troubleshooting During Demo

If you encounter issues during the demonstration:

1. **If workflow fails**:
   - Show how to view error logs
   - Explain how you would diagnose and fix the issue
   - Use this as an opportunity to demonstrate the value of CI/CD for catching issues early

2. **If tests fail**:
   - Discuss how test failures provide immediate feedback to developers
   - Show how the error messages help identify what's wrong
   - Explain how this prevents buggy code from being deployed

## Benefits to Highlight

Make sure to emphasize these CI/CD benefits:

1. **Automation**: Tests run automatically without manual intervention
2. **Consistency**: Tests run in a clean environment every time
3. **Early Detection**: Issues are caught before they reach production
4. **Documentation**: Tests serve as living documentation of expected behavior
5. **Confidence**: The team can make changes knowing tests will catch regressions