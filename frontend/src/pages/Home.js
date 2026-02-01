import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { watchAPI } from '../services/api';
import Swal from 'sweetalert2';
import './Home.css';

function Home() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      setLoading(true);
      const response = await watchAPI.getAllWatches();
      setWatches(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to load watches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (watch) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item._id === watch._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...watch, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cart.reduce((sum, item) => sum + item.quantity, 0));

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${watch.title} added successfully`,
      timer: 2000,
    });
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      Swal.fire('Success', 'Thanks for subscribing!', 'success');
      e.target.reset();
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center hero-content">
            <Col lg={6} className="hero-text">
              <h1 className="hero-title">Caliber Watch</h1>
              <p className="hero-subtitle">Precision, Elegance & Timeless Style</p>
              <p className="hero-description">
                Discover the perfect timepiece that matches your personality. From luxury to sports, 
                find watches that define your style and stand the test of time.
              </p>
              <div className="hero-buttons">
                <Button className="btn-primary-custom btn-lg me-3">
                  Shop Now
                </Button>
                <Button className="btn-secondary-custom btn-lg">
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-image">
              <div className="hero-image-placeholder">
                <span>🕐</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <Row className="text-center">
            <Col md={4} className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Authentic Quality</h3>
              <p>100% genuine timepieces from trusted brands worldwide</p>
            </Col>
            <Col md={4} className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Fast Shipping</h3>
              <p>Secure packaging and quick delivery to your doorstep</p>
            </Col>
            <Col md={4} className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>Multiple payment options with buyer protection</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <Container>
          <h2 className="section-title mb-5">Featured Watches</h2>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" className="spinner-custom" />
              <p className="mt-3">Loading watches...</p>
            </div>
          ) : watches.length > 0 ? (
            <Row>
              {watches.map((watch) => (
                <Col md={6} lg={4} key={watch._id} className="mb-4">
                  <Card className="watch-card product-card">
                    <div className="card-image-container">
                      <Card.Img
                        variant="top"
                        src={`/images/watches/${watch.image}`}
                        alt={watch.title}
                        height="250"
                        className="card-image"
                      />
                      <div className="card-overlay">
                        <Link to={`/watch/${watch._id}`} className="view-btn">
                          View Details
                        </Link>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title className="watch-title">{watch.title}</Card.Title>
                      <Card.Text className="watch-description">{watch.description}</Card.Text>
                      <div className="watch-price">₹{watch.price.toLocaleString('en-IN')}</div>
                      <div className="rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="review-count">(42 reviews)</span>
                      </div>
                      <Button
                        className="btn-add-to-cart w-100 mt-3"
                        onClick={() => addToCart(watch)}
                      >
                        🛒 Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <h4>No watches found</h4>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <h2 className="section-title text-center mb-5">What Our Customers Say</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                  <Card.Text className="testimonial-text">
                    "Amazing quality and fast delivery! The watch looks exactly like in the pictures."
                  </Card.Text>
                  <div className="testimonial-author">
                    <strong>Sarah Johnson</strong>
                    <p>Verified Buyer</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                  <Card.Text className="testimonial-text">
                    "Best price for luxury watches. Great customer service and hassle-free returns."
                  </Card.Text>
                  <div className="testimonial-author">
                    <strong>Michael Chen</strong>
                    <p>Verified Buyer</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                  <Card.Text className="testimonial-text">
                    "Excellent selection and professional packaging. My watch arrived in perfect condition!"
                  </Card.Text>
                  <div className="testimonial-author">
                    <strong>Emma Williams</strong>
                    <p>Verified Buyer</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2>Get Exclusive Deals</h2>
              <p>Subscribe to our newsletter and get 10% off your first purchase!</p>
            </Col>
            <Col lg={6}>
              <Form onSubmit={handleNewsletterSignup}>
                <InputGroup className="newsletter-input-group">
                  <Form.Control
                    placeholder="Enter your email"
                    type="email"
                    name="email"
                    required
                  />
                  <Button className="btn-subscribe">Subscribe</Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;
