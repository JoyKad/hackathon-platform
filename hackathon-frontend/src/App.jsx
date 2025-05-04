// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AuthForm from './components/AuthForm';
import TeamsPage from './pages/TeamsPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Главная публичная страница с каруселью и кнопкой «Войти» */}
        <Route path="/" element={<HomePage />} />

        {/* Форма логина/регистрации */}
        <Route path="/auth" element={<AuthForm />} />

        {/* Доступ к списку команд только для авторизованных */}
        <Route
          path="/teams"
          element={ token ? <TeamsPage /> : <Navigate to="/auth" replace /> }
        />

        {/* Все прочие пути редиректим на корень или /teams в зависимости от авторизации */}
        <Route
          path="*"
          element={<Navigate to={ token ? '/teams' : '/' } replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
