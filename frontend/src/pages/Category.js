import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { watchAPI } from '../services/api';
import Swal from 'sweetalert2';
import './Category.css';

function Category() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [watches, setWatches] = useState([]);
  const [filteredWatches, setFilteredWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchWatches();
  }, [categoryName]);

  const fetchWatches = async () => {
    try {
      setLoading(true);
      const response = await watchAPI.getAllWatches();
      const allWatches = response.data;
      
      // Filter by category
      const categoryWatches = allWatches.filter(
        watch => watch.category.toLowerCase() === categoryName.toLowerCase()
      );
      
      setWatches(categoryWatches);
      setFilteredWatches(categoryWatches);
    } catch (error) {
      Swal.fire('Error', 'Failed to load watches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterWatches(query, sortBy);
  };

  const handleSort = (value) => {
    setSortBy(value);
    filterWatches(searchQuery, value);
  };

  const filterWatches = (query, sort) => {
    let filtered = watches;

    // Search filter
    if (query) {
      filtered = filtered.filter(
        watch =>
          watch.title.toLowerCase().includes(query.toLowerCase()) ||
          watch.brand.toLowerCase().includes(query.toLowerCase()) ||
          watch.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sort
    if (sort === 'price-low') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered = filtered.reverse();
    }

    setFilteredWatches(filtered);
  };

  const addToCart = (watch) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item._id === watch._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...watch, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${watch.title} has been added to your cart`,
      timer: 1500,
    });
  };

  const getCategoryTitle = () => {
    const titles = {
      luxury: '💎 Luxury Watches',
      sports: '⚡ Sports Watches',
      casual: '⌚ Casual Watches',
      smartwatch: '📱 Smartwatches',
    };
    return titles[categoryName?.toLowerCase()] || categoryName;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" style={{ color: '#E0A084' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="category-page">
      <Container className="py-5">
        {/* Header */}
        <div className="category-header mb-5">
          <h1 className="category-title">{getCategoryTitle()}</h1>
          <p className="category-subtitle">
            {filteredWatches.length} products found
          </p>
        </div>

        {/* Filters and Sort */}
        <Row className="mb-4 filter-section">
          <Col md={6}>
            <div className="search-wrapper">
              <Form.Control
                type="text"
                placeholder="Search by name, brand..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </Col>
          <Col md={6}>
            <Form.Select
              value={sortBy}
              onChange={e => handleSort(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
              <option value="newest">Newest</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Products Grid */}
        {filteredWatches.length === 0 ? (
          <div className="text-center py-5">
            <h3 style={{ color: '#666' }}>No watches found</h3>
            <p>Try adjusting your search or filters</p>
            <Button
              variant="outline-warning"
              onClick={() => navigate('/')}
              className="mt-3"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {filteredWatches.map(watch => (
              <Col key={watch._id} lg={3} md={4} sm={6} xs={12}>
                <Card className="watch-card h-100">
                  <Card.Img
                    variant="top"
                    src={watch.image}
                    alt={watch.title}
                    className="watch-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/250?text=Watch';
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="watch-title">{watch.title}</Card.Title>
                    <p className="watch-brand">{watch.brand}</p>
                    <p className="watch-description text-muted">
                      {watch.description.substring(0, 60)}...
                    </p>
                    <div className="rating-section mb-2">
                      <span className="stars">⭐ {watch.rating}</span>
                      <span className="reviews">({watch.reviews} reviews)</span>
                    </div>
                    <h4 className="watch-price mb-3">₹{watch.price.toLocaleString('en-IN')}</h4>
                    <div className="mt-auto">
                      <Button
                        variant="warning"
                        className="w-100 mb-2"
                        onClick={() => addToCart(watch)}
                      >
                        🛒 Add to Cart
                      </Button>
                      <Button
                        variant="outline-warning"
                        className="w-100"
                        onClick={() => navigate(`/watch/${watch._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Category;
