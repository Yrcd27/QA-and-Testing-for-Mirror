const apiBaseUrl = 'http://localhost:5000/api';

// Generate unique identifiers for test users using timestamp
const timestamp = new Date().getTime();

// Create user objects with unique emails using the timestamp
const newUser = {
  Name: `TestUser_${timestamp}`,
  email: `testuser_${timestamp}@example.com`,
  password: "securePassword123"
};

const anotherUser = {
  Name: `AnotherUser_${timestamp}`,
  email: `anotheruser_${timestamp}@example.com`,
  password: "anotherPassword456"
};

module.exports = {
  apiBaseUrl,
  authEndpoints: {
    register: `${apiBaseUrl}/auth/signup`,
    login: `${apiBaseUrl}/auth/login`
  },
  testUsers: {
    // New user for registration that doesn't exist yet (with timestamp to ensure uniqueness)
    newUser,
    // Another set of credentials for the second test (also with timestamp)
    anotherUser
  }
};