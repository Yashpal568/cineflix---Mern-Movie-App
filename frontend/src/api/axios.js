import axios from "axios";

const api = axios.create({
  baseURL: "https://cineflix-mern-movie-app.onrender.com/api/v1",
});

// It Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `bearer ${token}`;
  return config;
});

export default api;
