// Get the current host for dynamic API URL in WSL environments
const getApiUrl = () => {
  const host = window.location.hostname;
  // If accessing via IP address (WSL scenario), use the same host for API
  if (host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:8080`;
  }
  // Default to localhost for local development
  return 'http://localhost:8080';
};

export const environment = {
  production: false,
  apiUrl: `${getApiUrl()}/api`,
  baseUrl: getApiUrl(),
};
