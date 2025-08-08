# Contoso Coffee - Full Stack Web Application

A full-stack web application for a fictional coffee shop featuring a React frontend and Node.js/Express backend.

## Features

### Frontend (React)
- **Home Page**: Information about the coffee shop, location, and history
- **Store Page**: Product catalog with filtering by category
- Responsive design with coffee-themed styling
- React Router for navigation

### Backend (Node.js/Express)
- RESTful API for product management
- CORS enabled for cross-origin requests
- Sample product data included
- Health check endpoint

## Project Structure

```
contoso-coffee/
├── frontend/                 # React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── ...
│   └── package.json
├── backend/                 # Express API server
│   ├── server.js           # Main server file
│   ├── .env               # Environment variables
│   └── package.json
├── package.json            # Root package.json for running both apps
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd contoso-coffee
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install dependencies for both frontend and backend**
   ```bash
   npm run install-deps
   ```

4. **Start both frontend and backend with one command**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Individual Commands

If you prefer to run them separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/category/:category` - Get products by category

### Health Check
- `GET /api/health` - API health check

## Sample Products

The application comes with sample data including:
- Coffee beans (Classic Blend, Espresso Dark Roast, Colombian Single Origin)
- Merchandise (Coffee mugs, t-shirts, sticker packs)

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- CSS3 with responsive design

### Backend
- Node.js
- Express.js
- CORS
- dotenv

## Development

### Adding New Products
Edit the `products` array in `backend/server.js` to add new products.

### Styling
Main styles are in `frontend/src/index.css`. The design uses a coffee-themed color palette with browns and golds.

### Environment Variables
Backend environment variables are stored in `backend/.env`:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Production Build

To build the frontend for production:
```bash
npm run build
```

## License

MIT License
