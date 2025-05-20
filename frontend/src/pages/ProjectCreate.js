import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/ProjectCreate.css';

const ProjectCreate = () => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [teams, setTeams] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        team: '',
        logo: null
    });

    // Fetch all teams instead of just user's teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/api/teams/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setTeams(data);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        
        fetchTeams();
    }, [authTokens]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            logo: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('team', formData.team);
            
            if (formData.logo) {
                formDataToSend.append('logo', formData.logo);
            }

            const response = await fetch('/api/projects/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                navigate('/projects');
            } else {
                const data = await response.json();
                setError(data.detail || 'Произошла ошибка при создании проекта');
            }
        } catch (error) {
            setError('Произошла ошибка при отправке данных');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="project-create-page">
            <h1>Добавить проект</h1>
            <p className="subtitle">Создайте новый проект для вашей команды</p>

            <div className="project-form-container">
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Название проекта *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Введите название проекта"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="logo">Логотип проекта (квадратный, 1:1) *</label>
                        <div className="logo-upload">
                            {formData.logo ? (
                                <img 
                                    src={URL.createObjectURL(formData.logo)} 
                                    alt="Предпросмотр логотипа" 
                                    className="logo-preview" 
                                />
                            ) : (
                                <div className="upload-placeholder">
                                    <span className="upload-icon">+</span>
                                    <span>Загрузить логотип</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="file-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="team">Команда проекта *</label>
                        <select
                            id="team"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите команду</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                        {teams.length === 0 && (
                            <div className="warning-message">
                                <span className="warning-icon">⚠️</span>
                                Выберите один из пунктов списка.
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание проекта *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Опишите ваш проект..."
                            rows={5}
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={() => navigate('/projects')}
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit" 
                            className="btn-create"
                            disabled={loading}
                        >
                            Создать проект
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectCreate; 