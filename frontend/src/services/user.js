import api from './api';

const UserService = {
    /**
     * Получить данные профиля пользователя
     * @returns {Promise} - Промис с данными пользователя
     */
    getUserProfile: () => {
        return api.get('/api/accounts/me/');
    },

    /**
     * Обновить поле профиля пользователя
     * @param {Object} data - Объект с обновляемым полем и значением
     * @returns {Promise} - Промис с результатом обновления
     */
    updateProfile: (data) => {
        return api.put('/api/accounts/update/', data);
    },

    /**
     * Загрузить аватар пользователя
     * @param {FormData} formData - FormData с файлом аватара
     * @returns {Promise} - Промис с результатом загрузки
     */
    uploadAvatar: (formData) => {
        return api.post('/api/accounts/upload-avatar/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default UserService; 