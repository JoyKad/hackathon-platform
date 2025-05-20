import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/user';
import '../styles/Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Состояние для активной вкладки
    const [activeTab, setActiveTab] = useState('about');
    
    // Состояние для хранения данных пользователя
    const [userData, setUserData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        description: user?.description || '',
        avatar: null,
        birthday: user?.birthday || '',
        nationality: user?.nationality || '',
        education: [],
        contacts: []
    });

    // Состояние для отслеживания режима редактирования для каждого поля
    const [editing, setEditing] = useState({});
    
    // Состояние для отображения сообщений
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Состояние для загрузки
    const [loading, setLoading] = useState(false);
    
    // Состояние для новой записи об образовании
    const [newEducation, setNewEducation] = useState({
        institution: '',
        start_year: '',
        end_year: '',
        description: ''
    });

    // Загрузка данных пользователя с сервера
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                console.log('Fetching user data...');
                const response = await UserService.getUserProfile();
                console.log('User data response:', response);
                
                setUserData(prev => ({
                    ...prev,
                    ...response.data,
                    avatarPreview: null // сбрасываем превью для использования актуального аватара
                }));
                console.log('User data loaded:', response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                console.error('Error details:', error.response?.data || 'No response data');
                console.error('Error status:', error.response?.status || 'No status code');
                setMessage({ 
                    text: `Не удалось загрузить данные пользователя: ${error.message}`, 
                    type: 'error' 
                });
            } finally {
                setLoading(false);
            }
        };
        
        if (user) {
            console.log('User authenticated, fetching data...');
            fetchUserData();
        } else {
            console.log('User not authenticated, redirecting to login');
            navigate('/login');
        }
    }, [user, navigate]);
    
    // Обработчик изменения полей ввода
    const handleInputChange = (field, value) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // Включение режима редактирования для поля
    const startEditing = (field) => {
        setEditing(prev => ({
            ...prev,
            [field]: true
        }));
    };
    
    // Отключение режима редактирования для поля
    const cancelEditing = (field) => {
        setEditing(prev => ({
            ...prev,
            [field]: false
        }));
    };
    
    // Сохранение изменений поля на сервере
    const saveField = async (field) => {
        try {
            setLoading(true);
            console.log(`Saving field ${field} with value:`, userData[field]);
            
            // Обновляем данные на сервере
            const updatedData = { [field]: userData[field] };
            const response = await UserService.updateProfile(updatedData);
            console.log('Field update response:', response);
            
            if (response && response.data) {
                // Обновляем локальные данные
                setUserData(prev => ({
                    ...prev,
                    ...response.data
                }));
                console.log('User data updated:', response.data);
            }
            
            setMessage({
                text: 'Изменения сохранены',
                type: 'success'
            });
            
            // Выходим из режима редактирования
            cancelEditing(field);
            
        } catch (error) {
            console.error(`Error updating field ${field}:`, error);
            console.error('Error details:', error.response?.data || 'No response data');
            console.error('Error status:', error.response?.status || 'No status code');
            setMessage({
                text: `Не удалось сохранить изменения: ${error.message}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        }
    };
    
    // Обработка загрузки аватара
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            setLoading(true);
            console.log('Uploading avatar file:', file.name);
            
            // Создаем превью аватара
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prev => ({
                    ...prev,
                    avatarPreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
            
            // Создаем FormData для отправки файла
            const formData = new FormData();
            formData.append('avatar', file);
            
            // Отправляем файл на сервер
            console.log('Sending avatar to server...');
            const response = await UserService.uploadAvatar(formData);
            console.log('Avatar upload response:', response);
            
            // Обновляем данные пользователя с новым аватаром
            if (response && response.data) {
                setUserData(prev => ({
                    ...prev,
                    avatar: response.data.avatar
                }));
                
                console.log('Avatar updated successfully:', response.data.avatar);
                
                // Получаем обновленные данные пользователя
                const userDataResponse = await UserService.getUserProfile();
                if (userDataResponse && userDataResponse.data) {
                    setUserData(prev => ({
                        ...prev,
                        ...userDataResponse.data,
                        avatarPreview: null
                    }));
                }
            }
            
            setMessage({
                text: 'Аватар обновлен',
                type: 'success'
            });
            
        } catch (error) {
            console.error('Error uploading avatar:', error);
            console.error('Error details:', error.response?.data || 'No response data');
            setMessage({
                text: `Не удалось загрузить аватар: ${error.message}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        }
    };

    // Компонент редактируемого поля
    const EditableField = ({ label, field, value, type = 'text' }) => {
        // Локальное состояние для значения поля
        const [localValue, setLocalValue] = useState(value);
        // Локальное состояние для загрузки
        const [isSaving, setIsSaving] = useState(false);
        
        // Обновляем локальное значение при изменении внешнего значения
        useEffect(() => {
            setLocalValue(value);
        }, [value]);
        
        // Обработчик изменения локального значения
        const handleLocalChange = (e) => {
            setLocalValue(e.target.value);
        };
        
        // Сохраняем изменения при отправке формы
        const handleSaveField = async () => {
            try {
                setIsSaving(true);
                console.log(`Saving field ${field} with value:`, localValue);
                
                // Обновляем данные на сервере
                const updatedData = { [field]: localValue };
                const response = await UserService.updateProfile(updatedData);
                
                if (response && response.data) {
                    // Обновляем глобальные данные
                    setUserData(prev => ({
                        ...prev,
                        [field]: localValue
                    }));
                    
                    // Выходим из режима редактирования
                    cancelEditing(field);
                    
                    setMessage({
                        text: 'Изменения сохранены',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error(`Error updating field ${field}:`, error);
                setMessage({
                    text: `Не удалось сохранить изменения: ${error.message}`,
                    type: 'error'
                });
            } finally {
                setIsSaving(false);
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 3000);
            }
        };

        return (
            <div className="profile-field">
                <div className="field-icon">
                    {field === 'phone' && <span className="icon">📱</span>}
                    {field === 'birthday' && <span className="icon">🎂</span>}
                    {field === 'nationality' && <span className="icon">🌍</span>}
                </div>
                <div className="field-content">
                    <div className="field-label">{label}</div>
                    {editing[field] ? (
                        <div className="edit-mode">
                            <input
                                type={type}
                                value={localValue}
                                onChange={handleLocalChange}
                                className="edit-input"
                                autoFocus
                            />
                            <div className="edit-actions">
                                <button 
                                    className="save-btn" 
                                    onClick={handleSaveField}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button 
                                    className="cancel-btn" 
                                    onClick={() => cancelEditing(field)}
                                    disabled={isSaving}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="display-mode" onClick={() => startEditing(field)}>
                            <div className="field-value">{value || 'Не указано'}</div>
                            <button className="edit-btn">Изменить</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Компонент для многострочного текста
    const EditableTextArea = ({ label, field, value }) => {
        const textareaRef = useRef(null);
        const [isLoading, setIsLoading] = useState(false);
        const [localMessage, setLocalMessage] = useState('');
        
        // Прямая отправка данных на сервер, минуя общую функцию saveField
        const saveDescriptionDirectly = async () => {
            if (!textareaRef.current) return;
            
            const newValue = textareaRef.current.value;
            
            try {
                setIsLoading(true);
                setLocalMessage('Сохранение...');
                
                console.log(`Saving ${field} directly with value:`, newValue);
                
                // Прямой запрос к API
                const response = await UserService.updateProfile({
                    [field]: newValue
                });
                
                console.log('Save response:', response);
                
                // Обновляем пользовательский интерфейс
                if (response.data) {
                    setUserData(prev => ({
                        ...prev,
                        [field]: newValue
                    }));
                    
                    setLocalMessage('Сохранено');
                    // Выход из режима редактирования после успешного сохранения
                    setTimeout(() => {
                        cancelEditing(field);
                        setLocalMessage('');
                    }, 1000);
                }
                
            } catch (error) {
                console.error('Error saving description:', error);
                setLocalMessage('Ошибка сохранения');
                setTimeout(() => {
                    setLocalMessage('');
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };
        
        useEffect(() => {
            // Устанавливаем начальное значение при входе в режим редактирования
            if (editing[field] && textareaRef.current) {
                textareaRef.current.value = value || '';
            }
        }, [editing[field], field, value]);
        
        return (
            <div className="profile-field description-field">
                <div className="field-content full-width">
                    <div className="field-label">{label}</div>
                    {editing[field] ? (
                        <div className="edit-mode">
                            <textarea
                                ref={textareaRef}
                                defaultValue={value}
                                className="edit-textarea"
                                rows="4"
                                autoFocus
                            />
                            <div className="edit-actions">
                                {localMessage && (
                                    <div className={`local-message ${isLoading ? 'saving' : ''}`}>
                                        {localMessage}
                                    </div>
                                )}
                                <button 
                                    className="save-btn" 
                                    onClick={saveDescriptionDirectly}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button 
                                    className="cancel-btn" 
                                    onClick={() => cancelEditing(field)}
                                    disabled={isLoading}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="display-mode" onClick={() => startEditing(field)}>
                            <div className="field-value description-value">
                                {value || 'Не указано описание'}
                            </div>
                            <button className="edit-btn">Изменить</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Обработчик добавления нового образования
    const handleAddEducation = async () => {
        if (!newEducation.institution || !newEducation.start_year) {
            setMessage({
                text: 'Пожалуйста, заполните название учреждения и год начала',
                type: 'error'
            });
            return;
        }

        try {
            setLoading(true);
            
            // Создаем обновленный список образования
            const updatedEducation = [
                ...userData.education,
                { ...newEducation, id: Date.now() } // Добавляем временный ID
            ];
            
            // Обновляем данные на сервере
            const response = await UserService.updateProfile({
                education: updatedEducation
            });
            
            if (response && response.data) {
                // Обновляем локальные данные
                setUserData(prev => ({
                    ...prev,
                    education: response.data.education || updatedEducation
                }));
                
                // Сбрасываем форму
                setNewEducation({
                    institution: '',
                    start_year: '',
                    end_year: '',
                    description: ''
                });
                
                setMessage({
                    text: 'Образование добавлено',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Error adding education:', error);
            setMessage({
                text: `Не удалось добавить образование: ${error.message}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        }
    };

    // Обработчик удаления образования
    const handleDeleteEducation = async (id) => {
        try {
            setLoading(true);
            
            // Фильтруем список образования
            const updatedEducation = userData.education.filter(item => item.id !== id);
            
            // Обновляем данные на сервере
            const response = await UserService.updateProfile({
                education: updatedEducation
            });
            
            if (response && response.data) {
                // Обновляем локальные данные
                setUserData(prev => ({
                    ...prev,
                    education: response.data.education || updatedEducation
                }));
                
                setMessage({
                    text: 'Запись удалена',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Error deleting education:', error);
            setMessage({
                text: `Не удалось удалить запись: ${error.message}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        }
    };

    // Компонент для вкладки "Достижения"
    const AchievementsTab = () => {
        // Локальное состояние для формы, чтобы избежать закрытия при вводе
        const [localEducation, setLocalEducation] = useState({
            institution: '',
            start_year: '',
            end_year: '',
            description: ''
        });
        
        // Локальное состояние для загрузки
        const [isFormLoading, setIsFormLoading] = useState(false);
        
        // При монтировании компонента синхронизируем локальное состояние
        useEffect(() => {
            setLocalEducation({
                institution: newEducation.institution,
                start_year: newEducation.start_year,
                end_year: newEducation.end_year,
                description: newEducation.description
            });
        }, []);
        
        // Обработчик изменения полей формы
        const handleFormChange = (field, value) => {
            setLocalEducation(prev => ({
                ...prev,
                [field]: value
            }));
        };
        
        // Обработчик отправки формы
        const handleFormSubmit = async () => {
            if (!localEducation.institution || !localEducation.start_year) {
                setMessage({
                    text: 'Пожалуйста, заполните название учреждения и год начала',
                    type: 'error'
                });
                return;
            }
            
            try {
                setIsFormLoading(true);
                
                // Создаем обновленный список образования
                const updatedEducation = [
                    ...userData.education,
                    { ...localEducation, id: Date.now() }
                ];
                
                // Обновляем данные на сервере
                const response = await UserService.updateProfile({
                    education: updatedEducation
                });
                
                if (response && response.data) {
                    // Обновляем локальные данные
                    setUserData(prev => ({
                        ...prev,
                        education: response.data.education || updatedEducation
                    }));
                    
                    // Обновляем глобальное состояние для совместимости
                    setNewEducation({
                        institution: '',
                        start_year: '',
                        end_year: '',
                        description: ''
                    });
                    
                    // Очищаем форму
                    setLocalEducation({
                        institution: '',
                        start_year: '',
                        end_year: '',
                        description: ''
                    });
                    
                    setMessage({
                        text: 'Образование добавлено',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Error adding education:', error);
                setMessage({
                    text: `Не удалось добавить образование: ${error.message}`,
                    type: 'error'
                });
            } finally {
                setIsFormLoading(false);
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 3000);
            }
        };
        
        return (
            <div className="content-section">
                <h2 className="section-title">Моё образование</h2>
                <div className="section-underline"></div>
                
                <div className="education-list">
                    {userData.education && userData.education.length > 0 ? (
                        userData.education.map((item, index) => (
                            <div className="education-item" key={item.id || index}>
                                <div className="education-dot"></div>
                                <div className="education-content">
                                    <h3 className="education-institution">{item.institution}</h3>
                                    <p className="education-years">
                                        {item.start_year}{item.end_year ? ` - ${item.end_year}` : ''}
                                    </p>
                                    {item.description && (
                                        <p className="education-description">{item.description}</p>
                                    )}
                                </div>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteEducation(item.id)}
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">Нет данных об образовании</p>
                    )}
                </div>
                
                <div className="add-education-form">
                    <h3>Добавить новое образование</h3>
                    <div className="form-group">
                        <label>Учебное заведение</label>
                        <input
                            type="text"
                            value={localEducation.institution}
                            onChange={(e) => handleFormChange('institution', e.target.value)}
                            placeholder="Например: Университет имени И.И. Иванова"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Год начала</label>
                            <input
                                type="number"
                                value={localEducation.start_year}
                                onChange={(e) => handleFormChange('start_year', e.target.value)}
                                placeholder="Например: 2018"
                            />
                        </div>
                        <div className="form-group">
                            <label>Год окончания</label>
                            <input
                                type="number"
                                value={localEducation.end_year}
                                onChange={(e) => handleFormChange('end_year', e.target.value)}
                                placeholder="Например: 2022"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            value={localEducation.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            placeholder="Дополнительная информация"
                            rows="3"
                        />
                    </div>
                    <button 
                        className="add-btn" 
                        onClick={handleFormSubmit}
                        disabled={isFormLoading}
                    >
                        {isFormLoading ? 'Сохранение...' : 'Добавить образование'}
                    </button>
                </div>
            </div>
        );
    };

    // Компонент для вкладки "Мой блог"
    const BlogTab = () => {
        // Статические данные для блога
        const blogPosts = [
            {
                id: 1,
                title: 'Конференция #Дизайн2025',
                date: '22 февраля 2025',
                type: 'Конференция',
                image: 'https://placehold.co/600x400/222/gold?text=Конференция',
                description: 'Главное деловое событие в дизайне интерьеров для профессионалов. О бизнесе и творчестве, о трудных клиентах и безудержном вдохновении, о принципах работы, полях и результатах.'
            },
            {
                id: 2,
                title: 'Работа в IT',
                date: '20 января 2024',
                type: 'Работа',
                image: 'https://placehold.co/600x400/222/gold?text=Работа+в+IT',
                description: 'Поделился опытом работы в IT-сфере на мероприятии для начинающих разработчиков. Обсудили путь от новичка до профессионала, сложности и возможности в индустрии.'
            },
            {
                id: 3,
                title: 'Конференция #Дизайн2025',
                date: '22 февраля 2025',
                type: 'Конференция',
                image: 'https://placehold.co/600x400/222/gold?text=Конференция',
                description: 'Главное деловое событие в дизайне интерьеров для профессионалов. О бизнесе и творчестве, о трудных клиентах и безудержном вдохновении, о принципах работы, полях и результатах.'
            },
            {
                id: 4,
                title: 'Работа в IT',
                date: '20 января 2024',
                type: 'Работа',
                image: 'https://placehold.co/600x400/222/gold?text=Работа+в+IT',
                description: 'Поделился опытом работы в IT-сфере на мероприятии для начинающих разработчиков. Обсудили путь от новичка до профессионала, сложности и возможности в индустрии.'
            }
        ];

        return (
            <div className="content-section">
                <h2 className="section-title">Мой блог</h2>
                <div className="section-underline"></div>
                
                <div className="blog-posts">
                    {blogPosts.map(post => (
                        <div className="blog-post" key={post.id}>
                            <div className="blog-image">
                                <img src={post.image} alt={post.title} />
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <span className="blog-type">{post.type}</span>
                                    <span className="blog-date">{post.date}</span>
                                </div>
                                <h3 className="blog-title">{post.title}</h3>
                                <p className="blog-description">{post.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Компонент для вкладки "Связь со мной"
    const ContactTab = () => {
        // Доступные социальные сети и мессенджеры
        const contactTypes = [
            { id: 'telegram', name: 'Telegram', icon: '📱', placeholder: '@username' },
            { id: 'vk', name: 'ВКонтакте', icon: '🌐', placeholder: 'vk.com/username' },
            { id: 'whatsapp', name: 'WhatsApp', icon: '💬', placeholder: '+7 (999) 123-45-67' },
            { id: 'email', name: 'Email', icon: '📧', placeholder: 'example@email.com' },
            { id: 'phone', name: 'Телефон', icon: '☎️', placeholder: '+7 (999) 123-45-67' }
        ];

        // Локальное состояние для нового контакта
        const [newContact, setNewContact] = useState({
            type: 'telegram',
            value: ''
        });

        // Локальное состояние для загрузки
        const [isFormLoading, setIsFormLoading] = useState(false);

        // Обработчик изменения типа контакта
        const handleTypeChange = (e) => {
            setNewContact(prev => ({
                ...prev,
                type: e.target.value
            }));
        };

        // Обработчик изменения значения контакта
        const handleValueChange = (e) => {
            setNewContact(prev => ({
                ...prev,
                value: e.target.value
            }));
        };

        // Обработчик добавления нового контакта
        const handleAddContact = async () => {
            if (!newContact.value.trim()) {
                setMessage({
                    text: 'Пожалуйста, укажите значение контакта',
                    type: 'error'
                });
                return;
            }

            try {
                setIsFormLoading(true);

                // Создаем обновленный список контактов
                const updatedContacts = [
                    ...userData.contacts || [],
                    { ...newContact, id: Date.now() }
                ];

                // Обновляем данные на сервере
                const response = await UserService.updateProfile({
                    contacts: updatedContacts
                });

                if (response && response.data) {
                    // Обновляем локальные данные
                    setUserData(prev => ({
                        ...prev,
                        contacts: response.data.contacts || updatedContacts
                    }));

                    // Сбрасываем форму
                    setNewContact({
                        type: 'telegram',
                        value: ''
                    });

                    setMessage({
                        text: 'Контакт добавлен',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Error adding contact:', error);
                setMessage({
                    text: `Не удалось добавить контакт: ${error.message}`,
                    type: 'error'
                });
            } finally {
                setIsFormLoading(false);
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 3000);
            }
        };

        // Обработчик удаления контакта
        const handleDeleteContact = async (id) => {
            try {
                setIsFormLoading(true);

                // Фильтруем список контактов
                const updatedContacts = userData.contacts.filter(item => item.id !== id);

                // Обновляем данные на сервере
                const response = await UserService.updateProfile({
                    contacts: updatedContacts
                });

                if (response && response.data) {
                    // Обновляем локальные данные
                    setUserData(prev => ({
                        ...prev,
                        contacts: response.data.contacts || updatedContacts
                    }));

                    setMessage({
                        text: 'Контакт удален',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Error deleting contact:', error);
                setMessage({
                    text: `Не удалось удалить контакт: ${error.message}`,
                    type: 'error'
                });
            } finally {
                setIsFormLoading(false);
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 3000);
            }
        };

        // Функция для получения иконки и имени по типу
        const getContactInfo = (type) => {
            const contact = contactTypes.find(c => c.id === type);
            return contact || { name: 'Другое', icon: '🔗' };
        };

        return (
            <div className="content-section">
                <h2 className="section-title">Связь со мной</h2>
                <div className="section-underline"></div>

                <div className="contacts-list">
                    {userData.contacts && userData.contacts.length > 0 ? (
                        userData.contacts.map((contact, index) => {
                            const contactInfo = getContactInfo(contact.type);
                            return (
                                <div className="contact-item" key={contact.id || index}>
                                    <div className="contact-icon">{contactInfo.icon}</div>
                                    <div className="contact-content">
                                        <div className="contact-name">{contactInfo.name}</div>
                                        <div className="contact-value">{contact.value}</div>
                                    </div>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteContact(contact.id)}
                                        disabled={isFormLoading}
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-data">Контакты не указаны</p>
                    )}
                </div>

                <div className="add-contact-form">
                    <h3>Добавить новый контакт</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Тип контакта</label>
                            <select
                                value={newContact.type}
                                onChange={handleTypeChange}
                                className="contact-select"
                            >
                                {contactTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.icon} {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Значение</label>
                            <div className="input-with-icon">
                                <span className="input-prefix-icon">{getContactInfo(newContact.type).icon}</span>
                                <input
                                    type="text"
                                    value={newContact.value}
                                    onChange={handleValueChange}
                                    placeholder={getContactInfo(newContact.type).placeholder}
                                    className="input-with-prefix"
                                />
                            </div>
                        </div>
                    </div>
                    <button 
                        className="add-btn" 
                        onClick={handleAddContact}
                        disabled={isFormLoading}
                    >
                        {isFormLoading ? 'Сохранение...' : 'Добавить контакт'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="header-top">
                    <button 
                        className="back-button" 
                        onClick={() => navigate('/')}
                    >
                        <span className="back-icon">←</span> На главную
                    </button>
                    <h1>Мой профиль</h1>
                </div>
                <div className="profile-tabs">
                    <div 
                        className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                        onClick={() => setActiveTab('about')}
                    >
                        Обо мне
                    </div>
                    <div 
                        className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        Мои достижения
                    </div>
                    <div 
                        className={`tab ${activeTab === 'blog' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blog')}
                    >
                        Мой блог
                    </div>
                    <div 
                        className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contact')}
                    >
                        Связь со мной
                    </div>
                </div>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="avatar-section">
                        <div className="avatar-container">
                            {userData.avatarPreview || userData.avatar ? (
                                <img 
                                    src={userData.avatarPreview || userData.avatar} 
                                    alt="Аватар пользователя" 
                                    className="avatar-image"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    {userData.full_name ? userData.full_name[0].toUpperCase() : 'U'}
                                </div>
                            )}
                            <label htmlFor="avatar-upload" className="avatar-upload-label">
                                Изменить фото
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="avatar-upload-input"
                                />
                            </label>
                        </div>
                    </div>
                    <h2 className="profile-name">{userData.full_name}</h2>
                    <div className="profile-role">Разработчик</div>

                    <div className="sidebar-fields">
                        <div className="profile-field">
                            <div className="field-icon">
                                <span className="icon">📧</span>
                            </div>
                            <div className="field-content">
                                <div className="field-label">Почта</div>
                                <div className="display-mode">
                                    <div className="field-value">{userData.email || 'Не указано'}</div>
                                </div>
                            </div>
                        </div>
                        <EditableField 
                            label="Телефон" 
                            field="phone" 
                            value={userData.phone} 
                            type="tel"
                        />
                        <EditableField 
                            label="Дата рождения" 
                            field="birthday" 
                            value={userData.birthday} 
                            type="date"
                        />
                        <EditableField 
                            label="Национальность" 
                            field="nationality" 
                            value={userData.nationality}
                        />
                    </div>

                    <button 
                        className="logout-button" 
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                    >
                        Выйти из аккаунта
                    </button>
                </div>

                <div className="profile-content">
                    {activeTab === 'about' && (
                        <>
                            <div className="content-section">
                                <h2 className="section-title">Обо мне</h2>
                                <div className="section-underline"></div>

                                <div className="profile-field description-field">
                                    <div className="field-content full-width">
                                        <div className="field-label">ФИО</div>
                                        <div className="display-mode">
                                            <div className="field-value">{userData.full_name || 'Не указано'}</div>
                                        </div>
                                    </div>
                                </div>

                                <EditableTextArea 
                                    label="О себе" 
                                    field="description" 
                                    value={userData.description}
                                />
                            </div>

                            <div className="content-section">
                                <h2 className="section-title">Мои Хобби</h2>
                                <div className="section-underline"></div>

                                <div className="hobbies-grid">
                                    <div className="hobby-card">
                                        <div className="hobby-icon">🎨</div>
                                        <h3>Веб Дизайн</h3>
                                        <p>Бла бла бла бла...</p>
                                    </div>
                                    <div className="hobby-card">
                                        <div className="hobby-icon">💻</div>
                                        <h3>Веб Разработка</h3>
                                        <p>Бла бла бла бла...</p>
                                    </div>
                                    <div className="hobby-card">
                                        <div className="hobby-icon">📱</div>
                                        <h3>Мобильная Разработка</h3>
                                        <p>Бла бла бла бла...</p>
                                    </div>
                                    <div className="hobby-card">
                                        <div className="hobby-icon">🖌️</div>
                                        <h3>Дизайн</h3>
                                        <p>Бла бла бла бла...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="content-section">
                                <h2 className="section-title">Моя Команда</h2>
                                <div className="section-underline"></div>
                                
                                <div className="team-members">
                                    <div className="team-member">
                                        <div className="member-avatar">👨‍💻</div>
                                        <div className="member-info">
                                            <h3 className="member-name">Данек</h3>
                                            <p className="member-role">Целеустремленный 1С разработчик</p>
                                        </div>
                                    </div>
                                    <div className="team-member">
                                        <div className="member-avatar">👩‍💼</div>
                                        <div className="member-info">
                                            <h3 className="member-name">Ангелина</h3>
                                            <p className="member-role">Любительница домашних питомцев</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {activeTab === 'achievements' && <AchievementsTab />}
                    
                    {activeTab === 'blog' && <BlogTab />}
                    
                    {activeTab === 'contact' && <ContactTab />}
                </div>
            </div>
        </div>
    );
};

export default Profile; 