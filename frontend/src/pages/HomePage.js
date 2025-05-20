import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

// Import images
import rectangleImg from '../assets/homepage/rectangle-21@2x.png';
import rectangleImg2 from '../assets/homepage/rectangle-211@2x.png';
import rectangleImg3 from '../assets/homepage/rectangle-19@2x.png';
import rectangleImg4 from '../assets/homepage/rectangle-191@2x.png';
import groupIcon from '../assets/homepage/group.svg';
import group1Icon from '../assets/homepage/group1.svg';
import group2Icon from '../assets/homepage/group2.svg';
import group3Icon from '../assets/homepage/group3.svg';
import group4Icon from '../assets/homepage/group4.svg';
import group5Icon from '../assets/homepage/group5.svg';
import vectorIcon from '../assets/homepage/vector.svg';
import svaLogoIcon from '../assets/homepage/svalogosvg-1.svg';
import ciLogoIcon from '../assets/homepage/ci72b93c3-1@2x.png';

const HomePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // States for timer
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [nextMonthName, setNextMonthName] = useState('');

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Calculate time until end of month
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
            lastDayOfMonth.setHours(23, 59, 59, 999);

            const nextMonth = new Date(currentYear, currentMonth + 1, 1);
            const nextMonthName = nextMonth.toLocaleString('ru-RU', { month: 'long' });
            setNextMonthName(nextMonthName);

            const difference = lastDayOfMonth - now;

            if (difference > 0) {
                setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                setMinutes(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
                setSeconds(Math.floor((difference % (1000 * 60)) / 1000));
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="homepage-container">
            {/* Top Navigation Bar */}
            <div className="top-navbar">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Поиск..." />
                </div>
                <div className="nav-links">
                    <Link to="/projects" className="nav-item">
                        <span className="nav-icon">♥</span>
                        О проекте
                    </Link>
                    <Link to="/projects" className="nav-item">
                        <span className="nav-icon">📋</span>
                        Проекты
                    </Link>
                    <Link to="/teams" className="nav-item">
                        <span className="nav-icon">👥</span>
                        Команды
                    </Link>
                    <Link to="/projects/create" className="nav-item add-project">
                        <span className="nav-icon">+</span>
                        Добавить проект
                    </Link>
                    {user ? (
                        <Link to="/profile">
                            <div className="user-avatar">
                                {user.full_name?.charAt(0) || '👤'}
                            </div>
                        </Link>
                    ) : (
                        <Link to="/login" className="login-button">Войти</Link>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Teams of the month header */}
                <div className="teams-month-header">
                    <h1>Команды месяца</h1>
                </div>

                {/* Teams grid - Top section */}
                <div className="teams-grid">
                    <div className="team-card">
                        <div className="team-card-image">
                            <img src={rectangleImg3} alt="PixelCraft" />
                        </div>
                        <div className="team-card-title">PixelCraft</div>
                        <div className="team-position second">
                            <div className="position-number">2</div>
                        </div>
                    </div>

                    <div className="team-card first-place">
                        <div className="team-card-image">
                            <img src={rectangleImg2} alt="ZeroBias" />
                        </div>
                        <div className="team-card-title">ZeroBias</div>
                        <div className="team-position first">
                            <div className="position-number">1</div>
                        </div>
                    </div>

                    <div className="team-card">
                        <div className="team-card-image">
                            <img src={rectangleImg4} alt="TGForge" />
                        </div>
                        <div className="team-card-title">TGForge</div>
                        <div className="team-position third">
                            <div className="position-number">3</div>
                        </div>
                    </div>
                </div>

                {/* Teams details and timer */}
                <div className="bottom-section">
                    {/* Team details list */}
                    <div className="teams-details-list">
                        {/* Team 1 */}
                        <div className="team-detail-card">
                            <div className="team-logo">
                                <img src={rectangleImg2} alt="ZeroBias" />
                            </div>
                            <div className="team-info">
                                <h3>ZeroBias</h3>
                                <p>Детектор ИИ в художественных текстах, проект ломающий жизнь студентам</p>
                                <div className="team-stats">
                                    <div className="members-count">
                                        <span className="members-icon">👥</span>
                                        16
                                    </div>
                                    <div className="team-rating">
                                        <span className="rating-icon">⭐</span>
                                        9.9
                                    </div>
                                </div>
                            </div>
                            <div className="team-position first">
                                <div className="position-number">1</div>
                            </div>
                        </div>

                        {/* Team 2 */}
                        <div className="team-detail-card">
                            <div className="team-logo">
                                <img src={rectangleImg2} alt="ZeroBias" />
                            </div>
                            <div className="team-info">
                                <h3>ZeroBias</h3>
                                <p>Детектор ИИ в художественных текстах, проект ломающий жизнь студентам</p>
                                <div className="team-stats">
                                    <div className="members-count">
                                        <span className="members-icon">👥</span>
                                        16
                                    </div>
                                    <div className="team-rating">
                                        <span className="rating-icon">⭐</span>
                                        9.9
                                    </div>
                                </div>
                            </div>
                            <div className="team-position second">
                                <div className="position-number">2</div>
                            </div>
                        </div>

                        {/* Team 3 */}
                        <div className="team-detail-card">
                            <div className="team-logo">
                                <img src={rectangleImg2} alt="ZeroBias" />
                            </div>
                            <div className="team-info">
                                <h3>ZeroBias</h3>
                                <p>Детектор ИИ в художественных текстах, проект ломающий жизнь студентам</p>
                                <div className="team-stats">
                                    <div className="members-count">
                                        <span className="members-icon">👥</span>
                                        16
                                    </div>
                                    <div className="team-rating">
                                        <span className="rating-icon">⭐</span>
                                        9.9
                                    </div>
                                </div>
                            </div>
                            <div className="team-position third">
                                <div className="position-number">3</div>
                            </div>
                        </div>

                        {/* Team 4 */}
                        <div className="team-detail-card">
                            <div className="team-logo">
                                <img src={rectangleImg2} alt="ZeroBias" />
                            </div>
                            <div className="team-info">
                                <h3>ZeroBias</h3>
                                <p>Детектор ИИ в художественных текстах, проект ломающий жизнь студентам</p>
                                <div className="team-stats">
                                    <div className="members-count">
                                        <span className="members-icon">👥</span>
                                        16
                                    </div>
                                    <div className="team-rating">
                                        <span className="rating-icon">⭐</span>
                                        9.9
                                    </div>
                                </div>
                            </div>
                            <div className="team-position">
                                <div className="position-number">4</div>
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="right-sidebar">
                        {/* Timer section */}
                        <div className="timer-section">
                            <div className="timer-title">
                                Наградим «Команды Месяца» через:
                            </div>
                            <div className="timer-display">
                                <div className="timer-units">
                                    <div className="timer-value">{days}</div>
                                    <div className="timer-label">Дней</div>
                                </div>
                                <div className="timer-units">
                                    <div className="timer-value">{hours}</div>
                                    <div className="timer-label">Часов</div>
                                </div>
                                <div className="timer-units">
                                    <div className="timer-value">{minutes}</div>
                                    <div className="timer-label">Минут</div>
                                </div>
                                <div className="timer-units">
                                    <div className="timer-value">{seconds}</div>
                                    <div className="timer-label">Секунд</div>
                                </div>
                            </div>
                        </div>

                        {/* News Section */}
                        <div className="news-section">
                            <h3>Новости</h3>
                            <div className="news-items">
                                <div className="news-item">
                                    <div className="news-content">
                                        <div className="news-title">Спецвузавтоматика</div>
                                        <p>Обучает невероятную LLM модель, которая будет лучше ChatGPT на 10%</p>
                                    </div>
                                    <div className="news-logo">
                                        <img src={svaLogoIcon} alt="SVA Logo" />
                                    </div>
                                </div>
                                <div className="news-item">
                                    <div className="news-content">
                                        <div className="news-title">Центр-инвест</div>
                                        <p>Станет спонсором на 4ом летнем Хакатоне от ДГТУ для студентов всего Ростова</p>
                                    </div>
                                    <div className="news-logo">
                                        <img src={ciLogoIcon} alt="Центр-инвест Logo" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="main-footer">
                <div className="footer-links">
                    <a href="#">Команда</a>
                    <span className="separator">•</span>
                    <a href="#">Поддержка</a>
                    <span className="separator">•</span>
                    <a href="#">Блог</a>
                    <span className="separator">•</span>
                    <a href="#">ВКонтакте</a>
                    <span className="separator">•</span>
                    <a href="#">Telegram</a>
                    <span className="separator">•</span>
                    <a href="#">YouTube</a>
                </div>
                <div className="footer-legal">
                    <a href="#">Политика конфиденциальности</a>
                    <span className="separator">•</span>
                    <a href="#">Пользовательское соглашение</a>
                </div>
            </footer>
        </div>
    );
};

export default HomePage; 