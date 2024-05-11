import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST, // Replace with your API base URL
});

// Add a request interceptor to set the x-access-token header
axiosInstance.interceptors.request.use(
  (config) => {
    // You can retrieve the token from where it's stored (e.g., localStorage or cookies)
    const token = localStorage.getItem('psymax-token'); // Replace with your token retrieval logic
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const axiosWrap = (pysmaxToken) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST, // Replace with your API base URL
  });

  // Add a request interceptor to set the x-access-token header
  axiosInstance.interceptors.request.use(
    (config) => {
      // You can retrieve the token from where it's stored (e.g., localStorage or cookies)
      const token = pysmaxToken; // Replace with your token retrieval logic
      if (token) {
        config.headers['x-access-token'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export { axiosWrap };
export default axiosInstance;
