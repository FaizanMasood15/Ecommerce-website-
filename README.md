# Funiro15 - Full-Stack Furniture E-Commerce Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/UI-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Production-style MERN furniture e-commerce application with:
- customer storefront
- guest and authenticated checkout
- admin dashboard for products, orders, coupons, and categories
- secure auth using JWT in HTTP-only cookies

Live Demo: https://funiro15.vercel.app

## Table of Contents
- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Author](#author)

## Project Overview
Funiro15 is a complete full-stack e-commerce system focused on real-world workflows:
- browse products by category
- variant-based product selection (size/color)
- cart + checkout flow
- user account (profile, order history, wishlist)
- guest checkout with secure guest order access token
- admin operations and analytics

## Core Features
### Customer-facing
- Home, shop, product detail, cart, checkout, contact, about, privacy policy, and returns pages
- Product variants (size/color), stock-aware purchase flow
- Wishlist for authenticated users
- Product reviews (create/delete with authorization)
- Coupon validation during checkout
- Guest checkout support
- Guest order confirmation page with token-based access

### Admin
- Product management (create, edit, delete, draft support)
- Product image upload (Cloudinary via multer-storage-cloudinary)
- Order management and status tracking
- Revenue and order analytics dashboard (daily/weekly/monthly/yearly)
- Coupon management (CRUD + usage constraints)
- Category manager (navigation categories, hierarchy, ordering, visibility)

### State Management
- Redux Toolkit + RTK Query for API state and server data caching
- Redux auth slice for user session info
- Context API for cart data persistence and cart operations

## Tech Stack
### Frontend
- React 19
- React Router DOM 7
- Redux Toolkit + RTK Query
- Tailwind CSS 4
- Vite 7
- Lucide React

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- cookie-parser + CORS
- Cloudinary + multer for uploads

## Architecture
```text
Client (React + Vite)
  -> RTK Query / fetchBaseQuery (credentials: include)
  -> REST API (/api/*)
Server (Express)
  -> Auth middleware (protect/admin/optionalProtect)
  -> Controllers (users/products/orders/wishlist/reviews/coupons/categories/upload)
  -> MongoDB (Mongoose models)
  -> Cloudinary (product image hosting)
```

## Getting Started
### 1. Clone and install dependencies
```bash
git clone <your-repo-url>
cd Ecommerce-website-
npm install
cd backend
npm install
```

### 2. Configure environment variables
Create `.env` inside `backend/` and set values from the table below.

Optional: create `.env` in root for frontend if backend is hosted elsewhere.

### 3. Run the app (development)
From `backend/`:
```bash
npm run dev
```
From project root (new terminal):
```bash
npm run dev
```

Frontend default: `http://localhost:5173`
Backend default: `http://localhost:5000`

## Environment Variables
### Backend (`backend/.env`)
| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWT and guest order access token |
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | No | API port (default: `5000`) |
| `CORS_ORIGIN` | No | Allowed origins (comma-separated) |
| `CLOUDINARY_CLOUD_NAME` | Yes (for uploads) | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes (for uploads) | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes (for uploads) | Cloudinary API secret |

### Frontend (`.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | No | API base URL (defaults to `/api`) |

## Available Scripts
### Root (frontend)
```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # run ESLint
```

### Backend
```bash
npm run dev          # start backend with nodemon
npm start            # start backend with node
npm run data:import  # seed database data
npm run data:destroy # remove seeded data
```

## API Overview
Base URL: `/api`

### Users
- `POST /users` - register
- `POST /users/login` - login
- `POST /users/logout` - logout
- `GET /users/profile` - get profile (auth)
- `PUT /users/profile` - update profile (auth)

### Products
- `GET /products` - list products
- `GET /products/:id` - get product detail
- `POST /products` - create product (admin)
- `PUT /products/:id` - update product (admin)
- `DELETE /products/:id` - delete product (admin)
- `POST /upload` - upload product image (admin)

### Orders
- `POST /orders` - create order (auth)
- `POST /orders/guest` - create guest order
- `GET /orders/guest/:id?token=...` - guest order access
- `GET /orders/myorders` - current user orders
- `GET /orders/:id` - order detail (owner/admin)
- `GET /orders` - all orders (admin)
- `PUT /orders/:id/status` - update status (admin)
- `PUT /orders/:id/pay` - mark paid (admin)
- `PUT /orders/:id/deliver` - mark delivered (admin)
- `GET /orders/analytics?period=monthly` - analytics (admin)

### Other resources
- Wishlist: `/wishlist`
- Reviews: `/reviews`
- Coupons: `/coupons`
- Categories: `/categories`

## Security Notes
- Passwords are hashed with `bcryptjs`
- JWT is sent in HTTP-only cookies
- Role-based access control for protected/admin routes
- Server-side order and stock validation with rollback logic on failure
- CORS + cookie credentials configured for cross-origin deployment

## Roadmap
- Add automated tests (unit/integration/e2e)
- Add payment gateway integration (Stripe/PayPal)
- Add CI pipeline (lint/test/build)
- Add Docker compose for one-command local setup

## Author
Built by **Faizan Masood**.

If this project helped you or inspired you, consider starring the repo.
