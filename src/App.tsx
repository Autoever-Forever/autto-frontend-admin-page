import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import ProductRegistrationForm from './components/Registration/ProductRegistrationForm';
import useAuth from './states/Variable';

function App() {
  const { token } = useAuth();
  console.log("Current token state:", token); // 디버깅용

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !token ? 
              <LoginForm /> : 
              <Navigate to="/register" replace />
          } 
        />
        <Route 
          path="/register" 
          element={
            token ? 
              <ProductRegistrationForm /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/" 
          element={
            token ? 
              <Navigate to="/register" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
