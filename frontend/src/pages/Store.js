import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);

  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          {error}
          <br />
          <button onClick={fetchProducts} style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Our Store</h2>
          <p>
            Discover our premium collection of coffee beans, brewing equipment, 
            and exclusive Contoso Coffee merchandise.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h3>Products</h3>
            
            {/* Category Filter */}
            <div style={{ marginTop: '1rem' }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  style={{
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: filter === category ? '#d4a574' : '#f0f0f0',
                    color: filter === category ? 'white' : '#666',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No products found in this category.
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Store;
