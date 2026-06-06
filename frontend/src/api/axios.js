import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV 
    ? "http://localhost:3000/api/v1" 
    : "https://cineflix-mern-movie-app.onrender.com/api/v1",
  timeout: 10000,
});

// It Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `bearer ${token}`;
  return config;
});

export default api;
