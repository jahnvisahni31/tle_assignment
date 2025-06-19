import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import SyncSettings from './pages/SyncSettings';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/sync" element={<SyncSettings />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;