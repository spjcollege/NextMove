# 🧠 NextMove Chess Store – Project Progress

## 📌 Project Overview
NextMove has evolved into a comprehensive chess ecosystem (inspired by chess.com, Chessly, and Amazon), integrating:
- **E-Commerce:** Premium chess equipment store
- **Learning Platform:** Structured courses and daily tactical puzzles
- **Community:** Forums, chat, news, and leaderboards
- **CRM/SCM:** Advanced activity tracking, recommendations, and inventory management

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Custom Vanilla CSS (Premium Dark-Mode & Glassmorphism System)
- React Router v6
- Context API (Auth, Cart)

### Backend
- FastAPI (Python)
- SQLAlchemy 2.0 (ORM)
- PyJWT & Passlib / bcrypt (Authentication)

### Storage
- SQLite (`nextmove.db`) with a 16-model Relational Schema
- LocalStorage (Frontend JWT and Cart caching)

---

## ✅ Features Implemented

### 🛒 E-Commerce
- Product catalog with categories, search, styling, and discounts
- Add to cart, quantity management, and cart persistence
- Checkout system (Address, Payment Methods - COD/UPI/Card)
- Order history tracking and status
- Product Reviews and Wishlists

### 📚 Learning & Gamification
- **Courses:** Browse, enroll, and track progress on chess masterclasses.
- **Puzzles:** Daily chess puzzles parsing FEN notation, answer validation, and puzzle rating updates.
- **Leaderboards:** Track top players by puzzle rating, player rating, and community activity.

### 💬 Community & Forums
- **Forums:** Discuss strategies, pin posts, like algorithms, and threaded comments.
- **Chat:** Community messaging platform for active discussion.
- **News:** Daily chess articles and updates.

### 🔒 Security & Users
- Secure JWT-based authentication.
- Password hashing via `bcrypt`.
- Rich user profiles with subscription tiers, order history, and stats.

### 📊 CRM & SCM Features
- User activity tracking (`UserActivity` DB model).
- Secure inventory tracking & valid stock management during checkouts.

---

## 🧩 API Endpoints (12 Routers)

| Feature | Router Prefix | Description |
|--------|-------------|-------------|
| Auth | `/auth` | Login, Register, Profile |
| Products | `/products` | Catalog, Search, Featured |
| Orders | `/orders` | Placement, History |
| Users | `/users` | CRM tracking, public profiles |
| Courses | `/courses` | Catalog, Enrollments, Progress |
| Community | `/community` | Chat messages |
| Forums | `/forums` | Threads, Comments, Likes |
| Puzzles | `/puzzles` | Daily fetches, solving, stats |
| Leaderboard| `/leaderboard`| Top ranking statistics |
| Wishlist | `/wishlist` | Manage saved items |
| Reviews | `/reviews` | Product star ratings |
| News | `/news` | Articles and updates |

---

## 🌐 Frontend Routes (16 Pages)

| Route | Page |
|------|------|
| `/` | Home (Hero, Featured, Categories, News) |
| `/product/:id` | Product Detail (Reviews, Wishlist) |
| `/cart` | Cart (Summary, Quantity) |
| `/checkout` | Checkout |
| `/auth` | Login & Registration |
| `/profile` | Profile Dashboard |
| `/courses` | Course Catalog |
| `/courses/:id` | Course Detail & Curriculum |
| `/puzzles` | Daily Puzzles |
| `/forums` | Forum Thread List |
| `/forums/:id` | Forum Post & Comments |
| `/community` | Active Community Chat |
| `/leaderboard` | Ratings and Rankings |
| `/news` | Chess Articles |
| `/search` | Search Results |
| `/wishlist` | Wishlist Items |

---

## ⚙️ Current Status

✅ **Phase 2 & Phase 3-6 Completely Finished:**
- Entire mock in-memory data has been completely replaced with a fully seeded relational SQLite database.
- Backend APIs are highly secured with Python-Jose JWTs.
- The UI has transitioned from basic to a premium dark-themed, highly interactive experience perfectly suited for a modern chess app.

---

## ⚠️ Limitations

- No real payment gateway integration (Stripe/Razorpay needed for real transactions).
- Chat currently uses polling instead of Real-Time WebSockets.
- Puzzles currently leverage text-based FEN instead of an integrated interactive visual drag-and-drop chessboard (e.g., `chess.js` + `react-chessboard`).

---

## 🚀 Next Steps

### Medium Priority
- Add actual `react-chessboard` library for visual interactive daily puzzles.
- Integrate WebSockets for real-time community chat.
- Add payment gateway.

### Advanced
- Transition from SQLite to PostgreSQL for production.
- Cloud deployment (Vercel for Frontend, Render/Railway for Backend).

---

## 🧑‍💻 Contribution Log

### Latest Update (March 2026)
- **Database Overhaul:** Migrated from single JSON-like user store to a 16-Model SQLAlchemy relational database.
- **Authentication:** Added comprehensive `bcrypt` cryptography and `JWT` token validation.
- **UI Rewrite:** Scrapped Tailwind in favor of a bespoke premium Dark-Mode Glassmorphism Vanilla CSS design map (`index.css`).
- **Pages Added:** Boosted frontend from 6 pages to 16 full-feature pages (Wishlist, Puzzles, Leaderboards, Reviews, News, Forums).
- **Seed Script:** Created an automated `seed.py` for effortless development environment spinning.