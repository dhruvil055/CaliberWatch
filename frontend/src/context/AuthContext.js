import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');

    if (userData) setUser(JSON.parse(userData));
    if (adminData) setAdmin(JSON.parse(adminData));
    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminToken', token);
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, loginUser, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
