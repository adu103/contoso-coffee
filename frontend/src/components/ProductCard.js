import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-category">{product.category}</div>
      <h4 className="product-name">{product.name}</h4>
      <p className="product-description">{product.description}</p>
      <div className="product-price">${product.price}</div>
    </div>
  );
};

export default ProductCard;
