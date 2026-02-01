import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { watchAPI } from '../services/api';
import Swal from 'sweetalert2';

function WatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchWatch();
  }, [id]);

  const fetchWatch = async () => {
    try {
      setLoading(true);
      const response = await watchAPI.getWatchById(id);
      setWatch(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to load watch details', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item._id === watch._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...watch, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cart.reduce((sum, item) => sum + item.quantity, 0));

    Swal.fire('Success', 'Watch added to cart', 'success').then(() => {
      navigate('/cart');
    });
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!watch) {
    return (
      <Container className="text-center my-5">
        <h3>Watch not found</h3>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img
            src={`/images/watches/${watch.image}`}
            alt={watch.title}
            className="img-fluid"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </Col>
        <Col md={6}>
          <h1>{watch.title}</h1>
          <div className="price my-3">₹{watch.price}</div>
          <p className="text-muted">{watch.description}</p>

          <Card className="p-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button size="lg" variant="primary" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default WatchDetail;
