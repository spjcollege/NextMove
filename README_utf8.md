# NextMove Chess Store
## Project Status

The **NextMove Chess Store** is currently under active development as part of an E-Commerce Systems lab project.

### Completed Features

**Backend (FastAPI)**

* REST API built using FastAPI
* Product catalog API
* User registration system
* User login authentication
* CORS configuration for frontend integration

**Frontend (React + Vite)**

* React-based frontend interface
* Tailwind CSS styling
* Product browsing page
* Cart functionality
* User registration page
* Login page
* Profile page displaying user details

**Core Functionality**

* Users can browse products without logging in
* Login is required to add items to cart
* Basic Amazon-style workflow implemented

### Technologies Used

Frontend

* React
* Vite
* Tailwind CSS

Backend

* FastAPI
* Python

### Work in Progress

The following features are currently being implemented:

* Product images
* Product ratings and reviews
* Checkout and order placement
* Order history in user profile
* Basic inventory management

### Project Structure

NextMove
├── backend
│   ├── main.py
│   └── app/api
│       ├── products.py
│       ├── users.py
│       └── auth.py
│
└── frontend
├── src
│   ├── components
│   ├── App.jsx
│   └── main.jsx

### Future Improvements

* Admin dashboard for inventory management
* Persistent database integration
* Payment gateway simulation
* Improved UI similar to modern e-commerce platforms
