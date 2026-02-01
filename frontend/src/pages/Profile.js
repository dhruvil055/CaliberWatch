import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

function Profile() {
  const { user, setUser } = useContext(AuthContext) || {};
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Try calling backend if available
      const token = user?.token;
      const payload = { name, email };
      if (password) payload.password = password;

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Update failed');
      }

      const data = await res.json();
      // If AuthContext provides a setter, update it
      if (setUser) setUser(data);
      Swal.fire('Saved', 'Profile updated successfully', 'success');
      setPassword('');
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container className="my-5">
        <p>Please log in to view your profile.</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={8}>
          <h2>Profile Settings</h2>
          <Form onSubmit={handleSubmit} className="mt-4">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
            </Form.Group>

            <div className="d-flex align-items-center">
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
