import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Budgets from './pages/budgets';
import Profile from './pages/Profile';
import Stock from './pages/Stock';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { StockProvider } from './contexts/StockContext';
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <StockProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"  element={<Dashboard />}/>
          <Route path="/stock"  element={<Stock />}/>
          <Route path="/Budgets" element={<Budgets />}/>
          <Route path="/Profile" element={<Profile />}/>
        </Routes>
        </StockProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;