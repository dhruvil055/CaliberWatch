import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({ name, email, password, confirmPass });
      Swal.fire('Success', 'Registration successful. Please login.', 'success').then(() => {
        navigate('/login');
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
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
          <div className="auth-logo">✨</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join CaliberWatch and explore premium timepieces</p>
        </div>

        <Card>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <div className="form-group-auth">
                <Form.Label className="form-label">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="form-group-auth">
                <Form.Label className="form-label">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="btn-rose" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" style={{ color: '#E0A084', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link></p>
        </div>

        
      </div>
    </div>
  );
}

export default Register;
