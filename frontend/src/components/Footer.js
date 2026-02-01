import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>CaliberWatch</h5>
            <p>Premium watches for every occasion</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/cart">Cart</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p>Email: support@caliberwatch.com</p>
            <p>Phone: +1-800-123-4567</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p>&copy; 2025 CaliberWatch. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
