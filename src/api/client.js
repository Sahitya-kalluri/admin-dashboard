// src/api/client.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "REACT_APP_API_URL is not set. The frontend is defaulting to http://localhost:8000, which will fail in production unless the backend is accessible at localhost from the browser."
  );
}

const client = axios.create({ baseURL: BASE_URL });

// Attach the JWT to every request once the user is logged in
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, bounce back to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default client;
