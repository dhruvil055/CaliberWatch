import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './Auth.css';

function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AuthContext);
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminAPI.login({ email, password });
      loginAdmin(response.data.admin, response.data.token);
      Swal.fire('Success', 'Admin login successful', 'success').then(() => {
        navigate('/admin/dashboard');
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      Swal.fire('Error', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⚙️</div>
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-sub">Sign in to access the admin dashboard</p>
        </div>

        <Card>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <div className="form-group-auth">
                <Form.Label className="form-label">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-auth">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button className="btn-rose" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Admin Sign In'}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="auth-footer">
          <p>Back to user account? <Link to="/login" style={{ color: '#E0A084', fontWeight: 600, textDecoration: 'none' }}>User Login</Link></p>
        </div>

        
      </div>
    </div>
  );
}

export default AdminLogin;
