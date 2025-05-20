import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const success = await login(email, password);
            if (success) {
                console.log('Login successful, redirecting to homepage');
                navigate('/', { replace: true });
            } else {
                setError('Неверный логин или пароль');
            }
        } catch (err) {
            setError('Произошла ошибка при входе. Попробуйте позже.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-frame">
                <div className="login-background-shadow">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-heading1margin">
                            <div className="login-heading1">
                                <span className="login-text1">Вход</span>
                            </div>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <div className="login-inputmargin1">
                            <div className="login-input1">
                                <div className="login-container2">
                                    <input
                                        type="email"
                                        placeholder="Имя пользователя"
                                        className="login-input-field"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="login-inputmargin2">
                            <div className="login-input2">
                                <div className="login-container3">
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        className="login-input-field"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="login-linkmargin">
                            <div className="login-link1">
                                <span className="login-text4">Забыли пароль?</span>
                            </div>
                        </div>

                        <button type="submit" className="login-button">
                            <span className="login-text5">Войти</span>
                        </button>

                        <div className="login-margin">
                            <div className="login-container4">
                                <span className="login-text6">Нет аккаунта?&nbsp;</span>
                                <div className="login-link2">
                                    <Link to="/register" className="login-text7">Зарегистрируйтесь</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login; 