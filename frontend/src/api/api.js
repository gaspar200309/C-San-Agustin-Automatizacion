import axios from 'axios';

const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL: baseURL,
  responseType: 'json',
  withCredentials: true,
  timeout: 10000
});

export const loginUser = (data) => api.post('/auth/login', data);
