import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      loginUser(response.data.user, response.data.token);
      Swal.fire('Success', 'Login successful', 'success').then(() => {
        navigate('/dashboard');
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
          <div className="auth-logo">🔐</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your CaliberWatch account</p>
        </div>

        <Card>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <div className="form-group-auth">
                <Form.Label className="form-label">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" style={{ color: '#E0A084', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link></p>
        </div>

        
      </div>
    </div>
  );
}

export default Login;
