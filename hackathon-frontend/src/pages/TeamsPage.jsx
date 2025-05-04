// src/pages/TeamsPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchTeams } from '../api/api';
import './TeamsPage.css';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetchTeams()
      .then(res => setTeams(res.data))
      .catch(console.error);
  }, []);

  const prev = () => setActive((active - 1 + teams.length) % teams.length);
  const next = () => setActive((active + 1) % teams.length);

  return (
    <div className="teams-container">
      <h1>Registered Teams</h1>
      <div className="carousel">
        <button className="arrow" onClick={prev}>&lt;</button>
        {teams.map((team, idx) => (
          <div
            key={team.id}
            className={`team-card ${idx === active ? 'active' : ''}`}
          >
            <img src={team.banner_url} alt={team.name} />
            <h3>{team.name}</h3>
          </div>
        ))}
        <button className="arrow" onClick={next}>&gt;</button>
      </div>
    </div>
  );
};

export default TeamsPage;
