const request = require('supertest');
const { authEndpoints, testUsers } = require('../config/testConfig');
const { getRequestUrl } = require('../config/urlHelper');

describe('User Registration Tests', () => {
  // Log test user details for debugging
  beforeAll(() => {
    console.log('Using test user for registration:', {
      Name: testUsers.newUser.Name,
      email: testUsers.newUser.email,
      passwordLength: testUsers.newUser.password.length
    });
  });
  
  // Test for successful user registration
  test('Should register a new user successfully', async () => {
    // Get proper URL components
    const { baseUrl, path } = getRequestUrl(authEndpoints.register);
    console.log('Making registration request to:', { baseUrl, path });
    
    const response = await request(baseUrl)
      .post(path)
      .send(testUsers.newUser)
      .set('Accept', 'application/json');
    
    // Log response for debugging
    console.log(`Registration response status: ${response.status}`);
    console.log('Registration response body:', response.body);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User registered successfully');
  });

  // Test for registration with missing fields
  test('Should fail registration when fields are missing', async () => {
    const incompleteUser = {
      email: testUsers.newUser.email,
      // Missing Name and password
    };

    // Get proper URL components
    const { baseUrl, path } = getRequestUrl(authEndpoints.register);
    
    const response = await request(baseUrl)
      .post(path)
      .send(incompleteUser)
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('All fields are required');
  });

  // Test for registration with too short password
  test('Should fail registration with short password', async () => {
    const userWithShortPassword = {
      ...testUsers.newUser,
      password: '12345' // Less than 6 characters
    };

    // Get proper URL components
    const { baseUrl, path } = getRequestUrl(authEndpoints.register);
    
    const response = await request(baseUrl)
      .post(path)
      .send(userWithShortPassword)
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Password must be at least 6 characters long');
  });

  // Test for registration with existing email
  // This test assumes the user has already been registered in the first test
  test('Should fail registration with existing email', async () => {
    // Attempt to register the same user again
    // Get proper URL components
    const { baseUrl, path } = getRequestUrl(authEndpoints.register);
    
    const response = await request(baseUrl)
      .post(path)
      .send(testUsers.newUser)
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Email already exists');
  });
});