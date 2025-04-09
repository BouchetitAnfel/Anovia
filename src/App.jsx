import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import Stock from './pages/Stock';
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"  element={<Dashboard />}/>
          <Route path="/stock"  element={<Stock />}/>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;