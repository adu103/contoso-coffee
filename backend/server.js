const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'static')));
}

// Sample products data
const products = [
  {
    id: 1,
    name: "Contoso Classic Blend",
    description: "Our signature medium roast coffee with notes of chocolate and caramel. Perfect for your morning routine.",
    price: 12.99,
    category: "coffee",
    image: "/images/classic-blend.jpg"
  },
  {
    id: 2,
    name: "Espresso Dark Roast",
    description: "Bold and intense dark roast coffee beans, perfect for espresso lovers.",
    price: 14.99,
    category: "coffee",
    image: "/images/espresso-dark.jpg"
  },
  {
    id: 3,
    name: "Contoso Coffee Mug",
    description: "Premium ceramic coffee mug with the Contoso Coffee logo. 12oz capacity.",
    price: 8.99,
    category: "merchandise",
    image: "/images/coffee-mug.jpg"
  },
  {
    id: 4,
    name: "Contoso T-Shirt",
    description: "Comfortable cotton t-shirt featuring the Contoso Coffee brand. Available in multiple sizes.",
    price: 19.99,
    category: "merchandise",
    image: "/images/t-shirt.jpg"
  },
  {
    id: 5,
    name: "Coffee Bean Stickers Pack",
    description: "Set of 10 vinyl stickers featuring coffee-themed designs and the Contoso logo.",
    price: 4.99,
    category: "merchandise",
    image: "/images/stickers.jpg"
  },
  {
    id: 6,
    name: "Colombian Single Origin",
    description: "Premium single-origin coffee from Colombian highlands. Light to medium roast with floral notes.",
    price: 16.99,
    category: "coffee",
    image: "/images/colombian-origin.jpg"
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Contoso Coffee API is running' });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const filteredProducts = products.filter(p => p.category.toLowerCase() === category);
  res.json(filteredProducts);
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Contoso Coffee API server running on port ${PORT}`);
});
