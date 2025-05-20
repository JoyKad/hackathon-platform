import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/TeamCreate.css';

const TeamCreate = () => {
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [members, setMembers] = useState([{ code: '', role: 'Разработчик' }]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        banner: null
    });

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
            banner: e.target.files[0]
        });
    };

    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setMembers(updatedMembers);
    };

    const addMember = () => {
        if (members.length < 5) {
            setMembers([...members, { code: '', role: 'Разработчик' }]);
        }
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            const updatedMembers = [...members];
            updatedMembers.splice(index, 1);
            setMembers(updatedMembers);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            
            // Add member codes
            const memberCodes = members.map(member => member.code).filter(code => code.trim() !== '');
            formDataToSend.append('members_code_input', JSON.stringify(memberCodes));
            
            if (formData.banner) {
                formDataToSend.append('banner', formData.banner);
            }

            const response = await fetch('/api/teams/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                navigate('/teams');
            } else {
                const data = await response.json();
                setError(data.detail || 'Произошла ошибка при создании команды');
            }
        } catch (error) {
            setError('Произошла ошибка при отправке данных');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="team-create-page">
            <h1>Создать команду</h1>
            <p className="subtitle">Создайте новую команду и добавьте участников</p>

            <div className="team-form-container">
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Название команды</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Введите название команды"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="banner">Баннер команды</label>
                        <div className="banner-upload">
                            {formData.banner ? (
                                <img 
                                    src={URL.createObjectURL(formData.banner)} 
                                    alt="Предпросмотр баннера" 
                                    className="banner-preview" 
                                />
                            ) : (
                                <div className="upload-placeholder">
                                    <span className="upload-icon">+</span>
                                    <span>Загрузить баннер</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="banner"
                                name="banner"
                                onChange={handleFileChange}
                                accept="image/jpeg,image/png,application/pdf"
                                className="file-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание команды</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Опишите вашу команду..."
                            rows={5}
                        />
                    </div>

                    <div className="form-group">
                        <label>Участники команды (2-5 человек)</label>
                        
                        {members.map((member, index) => (
                            <div key={index} className="member-row">
                                <input
                                    type="text"
                                    value={member.code}
                                    onChange={(e) => handleMemberChange(index, 'code', e.target.value)}
                                    placeholder="Код участника"
                                    className="member-code-input"
                                />
                                <select
                                    value={member.role}
                                    onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                                    className="member-role-select"
                                >
                                    <option value="Разработчик">Разработчик</option>
                                    <option value="Дизайнер">Дизайнер</option>
                                    <option value="Менеджер">Менеджер</option>
                                    <option value="Аналитик">Аналитик</option>
                                </select>
                                {members.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeMember(index)}
                                        className="remove-member-btn"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        {members.length < 5 && (
                            <button 
                                type="button" 
                                onClick={addMember}
                                className="add-member-btn"
                            >
                                + Добавить участника
                            </button>
                        )}
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={() => navigate('/teams')}
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit" 
                            className="btn-create"
                            disabled={loading}
                        >
                            Создать команду
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamCreate; 