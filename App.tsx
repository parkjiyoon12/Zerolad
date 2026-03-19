import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MainSite } from './MainSite';
import { AdminDashboard } from './components/AdminDashboard';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/admin" element={<AdminDashboard onExit={() => navigate('/')} />} />
    </Routes>
  );
};

export default App;
