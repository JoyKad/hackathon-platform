import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import MinWidthWarning from './components/MinWidthWarning';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import TeamCreate from './pages/TeamCreate';
import ProjectCreate from './pages/ProjectCreate';

// Placeholder pages
const TeamList = () => <div>Team List (Placeholder)</div>;
const TeamDetail = () => <div>Team Detail (Placeholder)</div>;
const ProjectList = () => <div>Project List (Placeholder)</div>;
const ProjectDetail = () => <div>Project Detail (Placeholder)</div>;
const NotFound = () => <div>404 Page Not Found</div>;

function App() {
    return (
        <div className="app">
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/teams" element={<TeamList />} />
                        <Route path="/teams/:id" element={<TeamDetail />} />
                        <Route path="/teams/create" element={<TeamCreate />} />
                        <Route path="/projects" element={<ProjectList />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/projects/create" element={<ProjectCreate />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* 404 and redirect */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <MinWidthWarning />
            </AuthProvider>
        </div>
    );
}

export default App; 