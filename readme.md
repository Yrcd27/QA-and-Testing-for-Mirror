# Mirror - MERN Stack Project

## Project Overview
Mirror is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for users to create and maintain personal journals. The application provides secure user authentication, journal creation and management features, and user profile customization.

## Repository Structure
- **mirror-backend**: Node.js/Express.js server with MongoDB connection
- **mirror-frontend**: React-based frontend built with Vite
- **unit-tests**: Automated unit tests for backend API endpoints
- **selenium-tests**: End-to-end UI tests using Selenium WebDriver
- **postman-tests**: API testing collection for Postman
- **jmeter-tests**: Performance and load testing scripts
- **security-testing**: OWASP Top 10 security testing documentation and fixes

## Key Features
- User registration and authentication with JWT
- Personal journal creation and management
- User profile customization
- Secure API endpoints with middleware protection

## Testing Documentation
This repository contains comprehensive testing artifacts including:

- Unit tests for backend functionality
- Selenium end-to-end tests for UI flows
- Postman collections for API testing
- JMeter scripts for performance testing
- OWASP Top 10 security analysis

## Setup Instructions

### Backend Setup
```powershell
cd mirror-backend
npm install
npm start
```

### Frontend Setup
```powershell
cd mirror-frontend
npm install
npm run dev
```

### Running Tests
- **Unit Tests**: `cd unit-tests; npm test`
- **Selenium Tests**: `cd selenium-tests; npm test` or use `.\run-tests.ps1`
- **Load Tests**: See instructions in `jmeter-tests\LOAD-TEST-INSTRUCTIONS.txt` or use `.\register-test-users.ps1`

## CI/CD Pipeline
This project utilizes GitHub Actions for continuous integration, automating build, test, and deployment processes.

## Security Testing
Security testing documentation and implementation guides are available in the `security-testing` directory, covering OWASP Top 10 vulnerabilities and their mitigations.

## Project Requirements
- Node.js (v18.x recommended)
- MongoDB
- Modern web browser
- JDK 8+ (for JMeter tests)
- Chrome/Firefox WebDriver (for Selenium tests)