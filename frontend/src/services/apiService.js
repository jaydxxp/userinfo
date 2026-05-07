import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/users`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getUsers = (page = 1, limit = 10, search = '', status = '') => 
    api.get(`?page=${page}&limit=${limit}&search=${search}&status=${status}`);

export const getUserById = (id) => api.get(`/${id}`);

export const createUser = (userData) => api.post('/', userData);

export const updateUser = (id, userData) => api.put(`/${id}`, userData);

export const deleteUser = (id) => api.delete(`/${id}`);

export const checkHealth = () => axios.get(`${BASE_URL}/health`);

export const exportUsers = () => {
    window.open(`${API_URL}/export`, '_blank');
};

export default {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    exportUsers,
    checkHealth
};
