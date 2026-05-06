import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

const getToken = () => localStorage.getItem('token')

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
})

// Auth
export const signup = (data) => axios.post(`${BASE_URL}/auth/signup`, data)
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data)

// Users
export const getAllUsers = () => axios.get(`${BASE_URL}/users`, authHeader())

// Projects
export const createProject = (data) => axios.post(`${BASE_URL}/projects`, data, authHeader())
export const getAllProjects = () => axios.get(`${BASE_URL}/projects`, authHeader())
export const getProjectById = (id) => axios.get(`${BASE_URL}/projects/${id}`, authHeader())
export const addMember = (projectId, userId) => axios.post(`${BASE_URL}/projects/${projectId}/members/${userId}`, {}, authHeader())
export const deleteProject = (id) => axios.delete(`${BASE_URL}/projects/${id}`, authHeader())

// Tasks
export const createTask = (projectId, assigneeId, data) => axios.post(`${BASE_URL}/tasks/project/${projectId}?assigneeId=${assigneeId}`, data, authHeader())
export const getTasksByProject = (projectId) => axios.get(`${BASE_URL}/tasks/project/${projectId}`, authHeader())
export const updateTaskStatus = (taskId, status) => axios.patch(`${BASE_URL}/tasks/${taskId}/status`, { status }, authHeader())
export const deleteTask = (taskId) => axios.delete(`${BASE_URL}/tasks/${taskId}`, authHeader())
export const getDashboard = () => axios.get(`${BASE_URL}/tasks/dashboard`, authHeader())