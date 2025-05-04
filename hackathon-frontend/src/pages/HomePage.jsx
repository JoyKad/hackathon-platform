// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { fetchPublicTeams } from '../api/api';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [teams, setTeams] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicTeams()
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));
  }, []);

  const prev = () => {
    if (!teams.length) return;
    setActiveIndex((activeIndex + teams.length - 1) % teams.length);
  };
  const next = () => {
    if (!teams.length) return;
    setActiveIndex((activeIndex + 1) % teams.length);
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <button className="btn-login" onClick={() => navigate('/auth')}>
          Войти
        </button>
      </header>

      <main className="carousel-wrapper">
        <h1 className="carousel-title">Registered Teams</h1>

        <div className="carousel">
          <button className="arrow left" onClick={prev}>&#10094;</button>
          <div className="cards">
            {teams.map((team, idx) => (
              <div
                key={team.id}
                className={`team-card ${idx === activeIndex ? 'active' : ''}`}
              >
                {team.name}
              </div>
            ))}
          </div>
          <button className="arrow right" onClick={next}>&#10095;</button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
