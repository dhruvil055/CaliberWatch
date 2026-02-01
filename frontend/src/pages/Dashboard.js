import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="my-5">
      <Row className="mb-5">
        <Col md={8}>
          <h2>My Dashboard</h2>
          <p>Welcome, {user.name}</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>My Orders</Card.Title>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              ) : orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.slice(0, 8)}</td>
                        <td>{order.items.length} item(s)</td>
                        <td>₹{order.total}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              order.status === 'Delivered'
                                ? 'success'
                                : order.status === 'Cancelled'
                                ? 'danger'
                                : 'warning'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
