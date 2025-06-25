import axios from 'axios';

const api = axios.create({
  baseURL: "https://splitwise-zv50.onrender.com", // FastAPI server URL
});

export default api;

// 'http://localhost:8000'
