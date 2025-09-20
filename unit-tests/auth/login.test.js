const request = require('supertest');
const { authEndpoints, testUsers } = require('../config/testConfig');
const { getRequestUrl } = require('../config/urlHelper');

describe('User Login Tests', () => {
  // Log which user we're trying to use
  beforeAll(() => {
    console.log('Using test user for login:', {
      Name: testUsers.newUser.Name,
      email: testUsers.newUser.email,
      passwordLength: testUsers.newUser.password.length
    });
    
    // Register the user first to ensure it exists
    console.log('Registering user before login tests...');
  });
  
  // Register the user before attempting login
  beforeAll(async () => {
    // This ensures the user exists before we try to log in
    try {
      // Get proper URL components for registration
      const regUrl = getRequestUrl(authEndpoints.register);
      console.log('Making pre-registration request to:', regUrl);
      
      const registerResponse = await request(regUrl.baseUrl)
        .post(regUrl.path)
        .send(testUsers.newUser)
        .set('Accept', 'application/json');
      
      console.log(`Pre-registration status: ${registerResponse.status}`);
      console.log('Pre-registration response:', registerResponse.body);
      
      // Even if this fails, we'll continue with the tests
    } catch (error) {
      console.error('Error in pre-registration:', error.message);
    }
  });

  // Test for successful user login
  test('Should login successfully with valid credentials', async () => {
    const loginCredentials = {
      email: testUsers.newUser.email,
      password: testUsers.newUser.password
    };

    console.log('Attempting login with:', { email: loginCredentials.email });
    
    // Get proper URL components for login
    const loginUrl = getRequestUrl(authEndpoints.login);
    console.log('Making login request to:', loginUrl);
    
    const response = await request(loginUrl.baseUrl)
      .post(loginUrl.path)
      .send(loginCredentials)
      .set('Accept', 'application/json');
    
    // Log response for debugging
    console.log(`Login response status: ${response.status}`);
    console.log('Login response body:', response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Login successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name', testUsers.newUser.Name);
    expect(response.body.user).toHaveProperty('email', testUsers.newUser.email);
  });

  // Test for login with missing fields
  test('Should fail login when fields are missing', async () => {
    const incompleteCredentials = {
      email: testUsers.newUser.email,
      // Missing password
    };

    // Get proper URL components for login
    const loginUrl = getRequestUrl(authEndpoints.login);
    
    const response = await request(loginUrl.baseUrl)
      .post(loginUrl.path)
      .send(incompleteCredentials)
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('All fields are required');
  });

  // Test for login with incorrect email
  test('Should fail login with non-existent email', async () => {
    const invalidCredentials = {
      email: 'nonexistent@example.com',
      password: testUsers.newUser.password
    };
    
    // Get proper URL components for login
    const loginUrl = getRequestUrl(authEndpoints.login);
    
    const response = await request(loginUrl.baseUrl)
      .post(loginUrl.path)
      .send(invalidCredentials)
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Invalid email or password');
  });

  // Test for login with incorrect password
  test('Should fail login with incorrect password', async () => {
    const invalidCredentials = {
      email: testUsers.newUser.email,
      password: 'wrongpassword'
    };
    
    // Get proper URL components for login
    const loginUrl = getRequestUrl(authEndpoints.login);
    
    const response = await request(loginUrl.baseUrl)
      .post(loginUrl.path)
      .send(invalidCredentials)
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Invalid email or password');
  });

  // Test login for the second user account
  // First we need to register this user
  test('Should register and login another user successfully', async () => {
    // Register another user first
    const regUrl = getRequestUrl(authEndpoints.register);
    
    const registerResponse = await request(regUrl.baseUrl)
      .post(regUrl.path)
      .send(testUsers.anotherUser)
      .set('Accept', 'application/json');
    
    console.log('Second user registration response:', registerResponse.body);
    expect(registerResponse.status).toBe(201);
    
    // Then try to login with that user
    const loginCredentials = {
      email: testUsers.anotherUser.email,
      password: testUsers.anotherUser.password
    };

    const loginUrl = getRequestUrl(authEndpoints.login);
    
    const loginResponse = await request(loginUrl.baseUrl)
      .post(loginUrl.path)
      .send(loginCredentials)
      .set('Accept', 'application/json');
    
    console.log('Second user login response:', loginResponse.body);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('message');
    expect(loginResponse.body.message).toBe('Login successful');
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body.user).toHaveProperty('name', testUsers.anotherUser.Name);
    expect(loginResponse.body.user).toHaveProperty('email', testUsers.anotherUser.email);
  });
});