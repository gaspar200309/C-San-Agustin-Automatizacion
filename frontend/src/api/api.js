import axios from 'axios';

const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL: baseURL,
  responseType: 'json',
  withCredentials: true,
  timeout: 10000
});

export const loginUser = (data) => api.post('/auth/login', data);

export const registerTeacher = (data) => api.post('/api/teachers', data)
export const getTeacher = () => api.get('/api/teachers')

export const getRoles = () => api.get('/api/roles')
export const getUsers = () => api.get('/api/users')
export const addUser = (data) => api.post('/api/users', data)
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/api/users/${id}`)