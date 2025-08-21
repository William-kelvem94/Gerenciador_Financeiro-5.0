import axios from 'axios';

// @ts-ignore
const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

export default api;
