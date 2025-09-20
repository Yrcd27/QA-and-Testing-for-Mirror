# Mirror App CI/CD Pipeline

This directory contains the GitHub Actions workflow for continuous integration and continuous deployment of the Mirror application.

## Pipeline Overview

The CI/CD pipeline automatically runs when changes are pushed to the `main` branch or when pull requests targeting the `main` branch are created. The pipeline performs the following operations:

1. **Build the project**
   - Installs dependencies for backend and frontend
   - Checks backend syntax
   - Builds the frontend application
   - Runs linting on the frontend code

2. **Run automated tests**
   - Unit Tests: Executes all Jest-based unit tests
   - Selenium Tests: Runs UI automation tests using Chrome in headless mode

## Workflow File

The `.github/workflows/main.yml` file defines the complete workflow for the CI/CD pipeline. It:

- Sets up a Node.js environment
- Configures a MongoDB service container for tests
- Builds both backend and frontend components
- Runs unit tests and Selenium tests

## How to Use

### Viewing Workflow Results

1. Go to the GitHub repository
2. Click on the "Actions" tab
3. Select the workflow run you want to view
4. See detailed logs of each step in the pipeline

### Running Locally

To test the workflow locally before pushing to GitHub, you can use [act](https://github.com/nektos/act), a tool for running GitHub Actions locally:

```bash
# Install act
brew install act  # macOS
# or download from GitHub releases for other platforms

# Run the workflow locally
act push
```

## Troubleshooting

If the workflow fails:

1. Check the detailed logs in the GitHub Actions tab
2. Verify that all tests pass locally before pushing
3. Make sure all required environment variables are properly set in the workflow file

## Extending the Pipeline

To add new steps to the pipeline:

1. Edit the `.github/workflows/main.yml` file
2. Add new steps under the appropriate section
3. Commit and push the changes to trigger the updated workflow

## Environment Variables

The workflow uses the following environment variables:

- `API_BASE_URL`: URL for the backend API (used in tests)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `VITE_API_URL`: API URL for the frontend to connect to
- `SELENIUM_BROWSER`: Browser used for Selenium tests
- `SELENIUM_HEADLESS`: Whether to run browser tests in headless mode