import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const success = await register({
                email,
                password,
                full_name: username
            });

            if (success) {
                navigate('/login');
            } else {
                setError('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
            }
        } catch (err) {
            if (err.response?.data) {
                // Handle validation errors from the API
                const errorData = err.response.data;
                if (errorData.email) {
                    setError(`Email: ${errorData.email[0]}`);
                } else if (errorData.full_name) {
                    setError(`Имя: ${errorData.full_name[0]}`);
                } else if (errorData.password) {
                    setError(`Пароль: ${errorData.password[0]}`);
                } else {
                    setError('Ошибка регистрации. Пожалуйста, проверьте введенные данные.');
                }
            } else {
                setError('Произошла ошибка при регистрации. Попробуйте позже.');
            }
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="register-container">
            <div className="register-frame">
                <div className="register-background-shadow">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="register-heading1margin">
                            <div className="register-heading1">
                                <span className="register-text1">Регистрация</span>
                            </div>
                        </div>

                        {error && <div className="register-error">{error}</div>}

                        <div className="register-inputmargin1">
                            <div className="register-input1">
                                <div className="register-container2">
                                    <input
                                        type="text"
                                        placeholder="Имя пользователя"
                                        className="register-input-field"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="register-inputmargin2">
                            <div className="register-input2">
                                <div className="register-container3">
                                    <input
                                        type="email"
                                        placeholder="Почта"
                                        className="register-input-field"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="register-inputmargin3">
                            <div className="register-input3">
                                <div className="register-container4">
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        className="register-input-field"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="register-button">
                            <span className="register-text5">Зарегистрироваться</span>
                        </button>

                        <div className="register-frame2">
                            <div className="register-container5">
                                <span className="register-text6">
                                    <span className="register-text7">Уже есть аккаунт? </span>
                                    <Link to="/login" className="register-text8">Войти</Link>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register; 