import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import api from './services/apiService';
import UserList from './pages/user-list/user-list';
import UserForm from './pages/user-form/user-form';
import UserDetail from './pages/user-detail/user-detail';
import './styles/global.css';

function App() {
  useEffect(() => {
    const healthInterval = setInterval(async () => {
      try {
        await api.checkHealth();
        console.log('Health Check: Server is active');
      } catch (error) {
        console.error('Health Check: Server unreachable');
      }
    }, 10000);

    return () => clearInterval(healthInterval);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add" element={<UserForm />} />
          <Route path="/edit/:id" element={<UserForm />} />
          <Route path="/view/:id" element={<UserDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
