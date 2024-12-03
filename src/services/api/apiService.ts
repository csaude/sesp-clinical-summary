import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

// Configure your Axios instance
const instance: AxiosInstance = axios.create({
  baseURL: 'http://10.10.2.17:8089/openmrsmuzima/ws/rest/v1/',
  responseType: 'json',
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
});

// Function to encode credentials for Basic Authentication
function getBasicAuthHeader(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  return `Basic ${btoa(credentials)}`;
}

// Request interceptor for API calls
instance.interceptors.request.use(
  (request) => {
    const username = localStorage.getItem('username') || ''; // Retrieve username dynamically
    const password = localStorage.getItem('password') || ''; // Retrieve password dynamically

    // Ensure headers are of type AxiosRequestHeaders
    if (username && password) {
      request.headers = {
        ...request.headers, // Keep existing headers if any
        Accept: 'application/json',
        Authorization: getBasicAuthHeader(username, password),
      } as AxiosRequestHeaders;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

export default instance;
