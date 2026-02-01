import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Dropdown, Badge, InputGroup } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import './Navigation.css';

function Navigation() {
  const { user, admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const cartCount = localStorage.getItem('cartCount') || 0;
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem('notifications') || '[]')
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Navbar expand="lg" sticky="top" className={`navbar-custom ${darkMode ? 'dark' : 'light'}`}>
      <Container fluid className="px-3 px-lg-4">
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom fw-bold">
          <span className="brand-icon">🕐</span>
          <span className="brand-text">Caliber Watch</span>
        </Navbar.Brand>

        {/* Toggle for mobile */}
        <Navbar.Toggle aria-controls="navbar-nav" className="navbar-toggler-custom" />

        <Navbar.Collapse id="navbar-nav">
          {/* Search Bar - Center */}
          <Form className="navbar-search mx-auto" onSubmit={handleSearch}>
            <InputGroup className="search-group">
              <Form.Control
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn" type="submit">
                🔍
              </button>
            </InputGroup>
          </Form>

          {/* Right side navigation */}
          <Nav className="ms-auto navbar-right">
            {/* Home Link */}
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>

            {/* Categories Dropdown */}
            <Dropdown className="nav-dropdown">
              <Dropdown.Toggle as={Nav.Link} className="nav-link-custom">
                Categories
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-custom">
                <Dropdown.Item as={Link} to="/category/luxury">
                  💎 Luxury
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/category/sports">
                  ⚡ Sports
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/category/casual">
                  ⌚ Casual
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/category/smartwatch">
                  📱 Smartwatch
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/">
                  All Watches
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Cart with Badge */}
            <Nav.Link as={Link} to="/cart" className="nav-link-custom cart-link">
              <span className="cart-icon">🛒</span>
              <span className="cart-text">Cart</span>
              {cartCount > 0 && (
                <Badge bg="danger" className="cart-badge">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            {/* Notifications Dropdown */}
            <Dropdown className="nav-dropdown notifications-dropdown">
              <Dropdown.Toggle as={Nav.Link} className="nav-link-custom notification-link">
                🔔
                {unreadCount > 0 && (
                  <Badge bg="danger" className="notification-badge">
                    {unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-custom notifications-menu">
                {notifications.length > 0 ? (
                  <>
                    {notifications.slice(0, 5).map((notif, idx) => (
                      <Dropdown.Item key={idx} className="notification-item">
                        {notif.message}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={clearNotifications} className="text-danger">
                      Clear All
                    </Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item disabled>No notifications</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>

      

            {/* User/Admin Dropdown */}
            {user ? (
              <Dropdown className="nav-dropdown user-dropdown">
                <Dropdown.Toggle as={Nav.Link} className="nav-link-custom user-link">
                  👤 {user.name}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-custom">
                  <Dropdown.Item as={Link} to="/dashboard">
                    My Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/dashboard">
                    My Orders
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/dashboard">
                    Wishlist
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/dashboard">
                    Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : admin ? (
              <Dropdown className="nav-dropdown user-dropdown">
                <Dropdown.Toggle as={Nav.Link} className="nav-link-custom admin-link">
                  ⚙️ Admin
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-custom">
                  <Dropdown.Item as={Link} to="/admin/dashboard">
                    Admin Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/dashboard">
                    Manage Products
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/dashboard">
                    Manage Orders
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/dashboard">
                    User Management
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown className="nav-dropdown auth-dropdown">
                <Dropdown.Toggle as={Nav.Link} className="nav-link-custom auth-link">
                  👤 Account
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-custom">
                  <Dropdown.Item as={Link} to="/login">
                    Customer Login
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/register">
                    Create Account
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/admin/login">
                    Admin Login
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
