import axios from 'axios';
import { getToken } from '../pages/login/authFunctions';

const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL: baseURL,
  responseType: 'json',
  withCredentials: true,
  timeout: 10000,
  
});

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

export const loginUser = (data) => api.post('/auth/login', data);

export const registerTeacher = (data) => api.post('/api/teachers', data)
export const getTeacher = () => api.get('/api/teachers')
export const deleteTeacher = (id) => api.delete(`/api/teachers/${id}`)
export const updateTeacher = (id, data) => api.put(`/api/teachers/${id}`, data)
export const getTeacherById = (id) => api.get(`/api/teachers/${id}`)

export const getRoles = () => api.get('/api/roles')
export const getUsers = () => api.get('/api/users')
//export const addUser = (data) => api.post('/api/users', data)
export const addUser = (data) => api.post('/auth/register', data)
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/api/users/${id}`)

export const getCourses = () => api.get('/api/courses')

export const getAcademyObjetive = () => api.get('/api/academic')
export const getSGCAcademi = () => api.get('/api/sgc-objectives')
export const getFormulas  = () => api.get('/api/formulas')
export const addIndicator = (data) => api.post('/api/indicators', data);
export const countIndicator = ()  => api.get('/api/indicators/count')
export const getIndicator = () => api.get('/api/indicators')
export const assignCoordinatorToIndicator = (indicatorId, userId) => api.post(`/api/indicators/${indicatorId}/assign-coordinator`, { userId });
export const removeCoordinatorFromIndicator = (indicatorId, userId) => api.delete(`/api/indicators/${indicatorId}/remove-coordinator`, { data: { userId } });
export const getAssignCoordinatorToIndicator = () => api.get('/api/indicators/simple')
export const getIndicatorByUsername = (username) => api.get(`/api/indicators/user/${username}`)
export const getIndicatorAssignements = () => api.get(`/api/indicators/assignments`)


export const registerCommunications = () => api.get('/api/indicators')
export const registerAttendance = () => api.get('/api/indicators')
export const registerTeacherNotes = () => api.get('/api/indicators')
export const registerCourseData = () => api.get('/api/indicators')
export const registerStudentNotes = () => api.get('/api/indicators')
export const getPeriods = () => api.get('/api/indicators')
export const registerYearlyCommunications = () => api.get('/api/indicators')

export const registerDocuments = (data) => api.post('/api/documents', data)
export const getDocuments = () => api.get('/api/documents/delivered')
export const countDocuments = () => api.get('/api/documents/counts')

export const registerStatusIndicator = (data) => api.post('/api/evaluations', data)
export const getStatusIndicator = (id) => api.get(`/api/evaluations/all/${id}`)