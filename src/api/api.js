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
export const countStadistc = () => api.get('/api/summary/count')

export const registerTeacher = (data) => api.post('/api/teachers', data)
export const getTeacher = () => api.get('/api/teachers')
export const deleteTeacher = (id) => api.delete(`/api/teachers/${id}`)
export const updateTeacher = (id, data) => api.put(`/api/teachers/${id}`, data)
export const getTeacherById = (id) => api.get(`/api/teachers/${id}`)
export const countTeacher = () => api.get('/api/teacher/count')//remplazado

export const getRoles = () => api.get('/api/roles')
export const getUsers = () => api.get('/api/users')
export const addUser = (data) => api.post('/auth/register', data)
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/api/users/${id}`)
export const getUserById = (id) => api.get(`/api/users/${id}`);
export const countUser = () => api.get('/api/users/count')//remplazado

export const getCourses = () => api.get('/api/courses')

export const getAcademyObjetive = () => api.get('/api/academic')
export const getSGCAcademi = () => api.get('/api/sgc-objectives')
export const getFormulas  = () => api.get('/api/formulas')
export const addIndicator = (data) => api.post('/api/indicators', data);
export const countIndicator = ()  => api.get('/api/indicators/count')//remplazado
export const getIndicator = () => api.get('/api/indicators')
export const getIndicatorDeadlines = () => api.get('/api/indicators/deadlines');

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

export const registerStatusIndicator = (data) => api.post('/api/evaluations/indicator2', data)
export const getStatusIndicator = (id) => api.get(`/api/evaluations/all/${id}`)

export const registerStatusIndicador4 = (data) => api.post('/api/evaluations/indicator4', data)
export const getStatusIndicator4 = (id) => api.get(`/api/evaluations/indicator4/${id}`)

export const registerStatusIndicador6 = (data) => api.post('/api/create_indicator6', data)
export const getStatusIndicator6 = (id) => api.get(`/api/evaluations/indicator6/${id}`)

export const registerStatusIndicador7 = (data) => api.post('/api/evaluations/indicator7', data)
export const getStatusIndicator7 = (id) => api.get(`/api/evaluations/indicator7/${id}`)

export const registerStatusIndicador8 = (data) => api.post('/api/evaluations/indicator8', data)
export const getStatusIndicator8 = () => api.get('/api/evaluations/indicator8/9')

export const registerStatusIndicador10 = (data) => api.post('/api/student-status', data)
export const getStatusIndicator10 = (id) => api.get(`/api/student-status/${id}`)

export const registerIndicator12 = (data) => api.post('/api/register-license', data)
export const getIndicator12Stats = () => api.get('/api/statistics/general')

export const registerIndicator13 = (data) => api.post('/api/register-insidence', data)
export const getIndicator13Stats = () => api.get('/api/statistics')

export const registerIndicator14 = (data) => api.post('/api/registro-nota', data);
export const getIndicator14Stats = () => api.get('/api/registro-nota')
export const getIndicator14Peridos = () => api.get('/api/regitro-nota/periods')

export const registerIndicator15 = (data) => api.post('/api/register-communication', data)
export const getIndicator15Stats = () => api.get('/api/communication-statistics')
