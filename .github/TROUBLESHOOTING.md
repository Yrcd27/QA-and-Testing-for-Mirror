# Troubleshooting GitHub Actions Workflow

This document provides guidance on how to troubleshoot and fix common issues with the GitHub Actions workflow for the Mirror App.

## Common Issues and Solutions

### 1. Workflow Fails to Start

**Problem**: The workflow doesn't start when you push changes.

**Solution**:
- Verify that your branch name matches the one specified in the workflow file
- Check that the workflow file is in the correct location (`.github/workflows/`)
- Ensure the workflow file has valid YAML syntax

### 2. Node.js Installation Failures

**Problem**: The workflow fails during Node.js setup.

**Solution**:
- Update the Node.js version in the workflow file to match your project requirements
- If using a specific Node.js version, ensure it's available in GitHub Actions

### 3. Dependency Installation Issues

**Problem**: `npm ci` or `npm install` commands fail.

**Solution**:
- Use `npm install` instead of `npm ci` if you don't have a `package-lock.json` file
- Check that your `package.json` files have valid syntax
- Consider adding `continue-on-error: true` to debug specific steps

### 4. Build Process Failures

**Problem**: The build process fails with errors.

**Solution**:
- Check the error messages in the GitHub Actions logs
- Verify that the build scripts in `package.json` work locally
- Ensure all environment variables needed for the build are properly set

### 5. Test Failures

**Problem**: Tests fail when run in the CI environment.

**Solution**:
- Make sure tests pass locally before pushing
- Check if tests require specific environment variables
- Set up any necessary services (like MongoDB) in the workflow

## How to Run the Workflow

1. **Push changes to trigger the workflow**:
   ```bash
   git add .
   git commit -m "Update CI/CD configuration"
   git push origin main
   ```

2. **Monitor the workflow**:
   - Go to your GitHub repository
   - Click on the "Actions" tab
   - Select the latest workflow run

3. **Review logs for each step**:
   - Click on the job name to expand
   - Click on each step to see its output
   - Look for error messages or warnings

4. **Re-run a failed workflow**:
   - On the workflow run page, click "Re-run jobs" in the top-right corner
   - Choose "Re-run all jobs" or "Re-run failed jobs"

## Using the Simplified Workflow

We've included a simplified workflow file (`basic.yml`) that can help diagnose issues:

1. If the main workflow fails, check the results of the basic workflow
2. The basic workflow only performs minimal tasks to identify configuration issues
3. Once the basic workflow passes, you can re-enable features in the main workflow

## Running Tests Manually

If you need to run tests outside the CI pipeline:

1. **Unit Tests**:
   ```bash
   cd unit-tests
   npm install
   npm test
   ```

2. **Selenium Tests**:
   ```bash
   cd selenium-tests
   npm install
   npm run test:login
   ```

## Getting Help

If you continue to encounter issues:

1. Check the GitHub Actions documentation: https://docs.github.com/en/actions
2. Compare your workflow file with examples from similar projects
3. Consult with team members who have experience with CI/CD pipelines