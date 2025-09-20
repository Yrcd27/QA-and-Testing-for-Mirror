// Helper function to properly parse API URLs
function getRequestUrl(endpoint) {
  try {
    // Parse the URL to extract proper base and path
    const url = new URL(endpoint);
    return {
      baseUrl: `${url.protocol}//${url.host}`,
      path: url.pathname
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {
      baseUrl: 'http://localhost:5000',
      path: endpoint.includes('/api/') 
        ? endpoint.substring(endpoint.indexOf('/api/')) 
        : endpoint
    };
  }
}

module.exports = {
  getRequestUrl
};