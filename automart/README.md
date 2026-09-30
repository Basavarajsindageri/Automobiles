# AutoMart E-Commerce Platform

AutoMart is a minimalist, modern, premium automobile accessories e-commerce full-stack platform built with React, Vite, Tailwind CSS, Spring Boot 3.x, Spring Security, JWT, JPA, and MySQL/H2.

## Project Structure

```
automart/
├── frontend/      → React + Vite + Tailwind CSS + Lucide React
└── backend/       → Spring Boot 3.x + Spring Security + JWT + JPA
```

## Running Frontend

```bash
cd automart/frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

## Running Backend

```bash
cd automart/backend
./mvnw spring-boot:run
```

The Spring Boot REST API will be available at `http://localhost:8080/api/v1`.
H2 Console available at `http://localhost:8080/h2-console`.

## Features
- **3 Automobile Categories**: Car Accessories, Scooter Accessories, Motorcycle Accessories.
- **60 Catalog Accessories**: High-res imagery, specs, pricing in INR (₹), compatibility, ratings, discount badges.
- **Complete User Flow**: Registration, Login, Forgot Password, OTP verification, Reset Password, Home, Live Search, Category Filters, Product Details, Wishlist, Cart, Address Management, Multi-step Checkout, Payment Selection, Order History, Invoice View.
