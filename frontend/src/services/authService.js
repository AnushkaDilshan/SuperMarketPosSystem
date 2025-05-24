import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const signup = (userData) => {
  return axios.post(`${API_URL}/auth/signup`, userData);
};

const login = (userData) => {
  return axios.post(`${API_URL}/auth/login`, userData);
};

const authService = { signup, login };
export default authService;
