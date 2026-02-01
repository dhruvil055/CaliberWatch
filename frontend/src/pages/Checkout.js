import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

function Checkout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    if (!user) {
      Swal.fire('Error', 'Please login first', 'error').then(() => {
        navigate('/login');
      });
      return;
    }

    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartData.length === 0) {
      navigate('/cart');
      return;
    }

    setCart(cartData);
    const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shipping = 10;
      const orderData = {
        fullName: formData.fullName,
        phone: formData.phone,
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        items: cart.map((item) => ({
          watch: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        total: subtotal + shipping,
      };

      await orderAPI.createOrder(orderData);

      Swal.fire('Success', 'Order placed successfully', 'success').then(() => {
        localStorage.removeItem('cart');
        localStorage.setItem('cartCount', 0);
        navigate('/dashboard');
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Order failed';
      Swal.fire('Error', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Checkout</h2>
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Shipping Address</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <Card.Title>Order Summary</Card.Title>
            </Card.Header>
            <Card.Body>
              {cart.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>
                    {item.title} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>₹{shipping}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="price">₹{total}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
