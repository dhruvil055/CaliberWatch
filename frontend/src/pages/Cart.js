import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartData);
    calculateSubtotal(cartData);
  };

  const calculateSubtotal = (cartData) => {
    const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    const filteredCart = updatedCart.filter((item) => item.quantity > 0);
    setCart(filteredCart);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    localStorage.setItem('cartCount', filteredCart.reduce((sum, item) => sum + item.quantity, 0));
    calculateSubtotal(filteredCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    localStorage.setItem('cartCount', updatedCart.reduce((sum, item) => sum + item.quantity, 0));
    calculateSubtotal(updatedCart);
  };

  const shipping = 10;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <Row>
        <Col lg={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeItem(item._id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>₹{shipping}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="price">₹{total}</strong>
              </div>
              <Link to="/checkout" className="btn btn-primary w-100">
                Proceed to Checkout
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
