import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Home.css';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(saved);
  }, []);

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    Swal.fire('Removed', 'Item removed from wishlist', 'success');
  };

  const addToCart = (watch) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find((i) => i._id === watch._id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...watch, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    // remove from wishlist after adding
    removeItem(watch._id);
    Swal.fire('Added', 'Item moved to cart', 'success');
    navigate('/cart');
  };

  return (
    <Container className="my-5">
      <h2 className="section-title mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty. Browse products to add favorites.</p>
      ) : (
        <Row>
          {wishlist.map((watch) => (
            <Col md={6} lg={4} key={watch._id} className="mb-4">
              <Card className="watch-card product-card">
                <div className="card-image-container">
                  <Card.Img
                    variant="top"
                    src={watch.image?.startsWith('http') ? watch.image : `/images/watches/${watch.image}`}
                    alt={watch.title}
                    height="240"
                    className="card-image"
                  />
                </div>
                <Card.Body>
                  <Card.Title>{watch.title}</Card.Title>
                  <Card.Text>₹{watch.price?.toLocaleString('en-IN')}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-danger" onClick={() => removeItem(watch._id)}>
                      Remove
                    </Button>
                    <Button onClick={() => addToCart(watch)}>Add to Cart</Button>
                  </div>
                  <div className="mt-2 text-end">
                    <Link to={`/watch/${watch._id}`}>View</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Wishlist;
