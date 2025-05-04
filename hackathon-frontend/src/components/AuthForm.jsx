import React, { useState } from 'react';
import './AuthForm.css';
import 'boxicons/css/boxicons.min.css';
import { registerUser, loginUser } from '../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
  const [active, setActive] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.success('Регистрация прошла успешно!');
      setActive(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error('Ошибка регистрации');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      });
      const token = response.data.access;
      localStorage.setItem('token', token);
      toast.success('Вход выполнен!');
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error('Ошибка входа');
    }
  };

  return (
    <div className={`container ${active ? 'active' : ''}`}>
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Войти</h1>
          <div className="input-box">
            <input type="email" name="email" placeholder="Логин" required onChange={handleChange} />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="password" name="password" placeholder="Пароль" required onChange={handleChange} />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button type="submit" className="btn">Войти</button>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Регистрация</h1>
          <div className="input-box">
            <input type="text" name="full_name" placeholder="ФИО" required onChange={handleChange} />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="email" name="email" placeholder="Почта" required onChange={handleChange} />
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box">
            <input type="password" name="password" placeholder="Пароль" required onChange={handleChange} />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button type="submit" className="btn">Зарегистрироваться</button>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Добро пожаловать!</h1>
          <p>Еще не успели зарегистрироваться?</p>
          <button className="btn register-btn" onClick={() => setActive(true)}>Регистрация</button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>С возвращением!</h1>
          <p>Уже есть аккаунт?</p>
          <button className="btn login-btn" onClick={() => setActive(false)}>Войти</button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
