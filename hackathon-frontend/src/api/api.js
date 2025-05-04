import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Хелпер для добавления JWT в заголовки
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Регистрация нового пользователя
export const registerUser = (data) => {
  return axios.post(
    `${API_BASE_URL}/accounts/register/`,
    data
  );
};

// Логин (получаем access-токен и сохраняем его в localStorage)
export const loginUser = (data) => {
  return axios
    .post(`${API_BASE_URL}/token/`, data)
    .then((res) => {
      localStorage.setItem('token', res.data.access);
      return res;
    });
};

// Получить список всех команд (требует авторизации)
export const fetchTeams = () => {
  return axios.get(
    `${API_BASE_URL}/teams/`,
    { headers: authHeaders() }
  );
};

// Получить одну команду по ID
export const fetchTeam = (id) => {
  return axios.get(
    `${API_BASE_URL}/teams/${id}/`,
    { headers: authHeaders() }
  );
};

// Создать новую команду
export const createTeam = (data) => {
  return axios.post(
    `${API_BASE_URL}/teams/`,
    data,
    { headers: authHeaders() }
  );
};

// Обновить команду по ID
export const updateTeam = (id, data) => {
  return axios.put(
    `${API_BASE_URL}/teams/${id}/`,
    data,
    { headers: authHeaders() }
  );
};

export const fetchPublicTeams = () =>
  axios.get(`${API_BASE_URL}/teams/`);