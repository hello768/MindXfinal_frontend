import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import { UserProvider, useUser } from "./components/Context/UserContext";
import MainPage from "./components/Pages/MainPage";
import LoginPage from "./components/Pages/LoginPage";

function AppRoutes() {

  const { user, loading } = useUser(); 
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a1a1a', color: 'white' }}>
        <p>Vartija đang khởi động...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <MainPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
        <AppRoutes />
    </UserProvider>
  );
}