import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { watchAPI, orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

function AdminDashboard() {
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);
  const [watches, setWatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWatchModal, setShowWatchModal] = useState(false);
  const [editingWatch, setEditingWatch] = useState(null);
  const [watchForm, setWatchForm] = useState({
    image: '',
    title: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [admin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [watchRes, orderRes] = await Promise.all([
        watchAPI.getAllWatches(),
        orderAPI.getAllOrders(),
      ]);
      setWatches(watchRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWatchModal = (watch = null) => {
    if (watch) {
      setEditingWatch(watch);
      setWatchForm(watch);
    } else {
      setEditingWatch(null);
      setWatchForm({ image: '', title: '', description: '', price: '' });
    }
    setShowWatchModal(true);
  };

  const handleSaveWatch = async (e) => {
    e.preventDefault();
    try {
      if (editingWatch) {
        await watchAPI.updateWatch(editingWatch._id, watchForm);
        Swal.fire('Success', 'Watch updated successfully', 'success');
      } else {
        await watchAPI.createWatch(watchForm);
        Swal.fire('Success', 'Watch created successfully', 'success');
      }
      setShowWatchModal(false);
      fetchData();
    } catch (error) {
      Swal.fire('Error', 'Operation failed', 'error');
    }
  };

  const handleDeleteWatch = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await watchAPI.deleteWatch(id);
          Swal.fire('Deleted!', 'Watch deleted successfully.', 'success');
          fetchData();
        } catch (error) {
          Swal.fire('Error', 'Delete failed', 'error');
        }
      }
    });
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      Swal.fire('Success', 'Order status updated', 'success');
      fetchData();
    } catch (error) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  if (!admin) {
    return null;
  }

  return (
    <Container fluid className="my-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* Watches Section */}
          <Row className="mb-5">
            <Col>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Card.Title>Manage Watches</Card.Title>
                  <Button variant="success" onClick={() => handleOpenWatchModal()}>
                    Add Watch
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watches.map((watch) => (
                        <tr key={watch._id}>
                          <td>{watch.title}</td>
                          <td>₹{watch.price}</td>
                          <td>{watch.description.substring(0, 50)}...</td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleOpenWatchModal(watch)}
                              className="me-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteWatch(watch._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Orders Section */}
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>All Orders</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id.slice(0, 8)}</td>
                          <td>{order.fullName}</td>
                          <td>₹{order.total}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order._id, e.target.value)
                              }
                            >
                              <option>Pending</option>
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </Form.Select>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                Swal.fire(
                                  'Order Details',
                                  `Items: ${order.items.length}\nAddress: ${order.shippingAddress.city}, ${order.shippingAddress.state}`,
                                  'info'
                                )
                              }
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Watch Modal */}
      <Modal show={showWatchModal} onHide={() => setShowWatchModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingWatch ? 'Edit Watch' : 'Add New Watch'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveWatch}>
            <Form.Group className="mb-3">
              <Form.Label>Image Filename</Form.Label>
              <Form.Control
                type="text"
                value={watchForm.image}
                onChange={(e) => setWatchForm({ ...watchForm, image: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={watchForm.title}
                onChange={(e) => setWatchForm({ ...watchForm, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={watchForm.description}
                onChange={(e) => setWatchForm({ ...watchForm, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={watchForm.price}
                onChange={(e) => setWatchForm({ ...watchForm, price: e.target.value })}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {editingWatch ? 'Update Watch' : 'Create Watch'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
