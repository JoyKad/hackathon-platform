import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Регистрация нового пользователя
export const registerUser = (data) => {
  return axios.post(`${API_BASE_URL}/accounts/register/`, data);
};

// Авторизация пользователя (JWT)
export const loginUser = (data) => {
  return axios.post(`${API_BASE_URL}/token/`, {
    email: data.email,
    password: data.password,
  });
};
