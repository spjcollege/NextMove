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

## ✅ Feature Status & Quality

| Feature | State | Current Quality | Industry Target |
|---------|-------|----------------|-----------------|
| Products | SQLite, 30+ seeded items, category/search | **Functional** | Scalable |
| Cart & Checkout | Address selection, payment gateway wired | **Robust** | Robust |
| Auth (Login/Register) | JWT + bcrypt, profile management | **Secure** | Scalable |
| Orders | SQLite persistence, status tracking | **Robust** | Robust |
| CRM Tracking | UserActivity DB model, event logging | **Functional** | Robust |
| SCM / Inventory | Stock validated on order placement | **Functional** | Robust |
| Courses | SQLite, enroll flow, payment gated | **Functional** | Robust |
| Community (chat) | SQLite messages, polling-based | **Basic** | Scalable |
| UI Design | Custom dark-mode glassmorphism CSS | **Robust** | Robust |
| JWT / Security | Python-Jose JWT, bcrypt, 401 interception | **Secure** | Scalable |
| Database | 16-model SQLAlchemy + SQLite | **Functional** | Scalable |
| Payment Gateway | Razorpay (Cards/Netbanking/Wallet) | **Functional** | Robust |
| Wishlist | SQLite-backed, add/remove | **Functional** | Robust |
| Puzzles | Lichess board embed, solution validation | **Functional** | Robust |
| Forums | Threads, comments, likes | **Functional** | Robust |
| Leaderboard | Ratings-based ranking | **Functional** | Robust |
| Real-time Features | Polling only (no WebSockets) | **Basic** | Scalable |

> **Security note:** Plan to migrate to an open-source auth provider (e.g. Supabase Auth / Keycloak) to reach Scalable tier.

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
- Backend APIs are highly secured with Python-Jose JWTs, with robust token decoding.
- The UI has transitioned from basic to a premium dark-themed, highly interactive experience perfectly suited for a modern chess app.

---

## ⚠️ Limitations

- No real payment gateway integration (Stripe/Razorpay needed for real transactions, though simulated flows exist for Courses and Checkout).
- Chat currently uses polling instead of Real-Time WebSockets.
- Puzzles currently leverage an embedded Lichess Analysis Board. Fully native integration (`chess.js` + `react-chessboard`) could offer deeper gamification APIs within the app itself.

---

## 🚀 Next Steps

### Medium Priority
- Full local integration of `react-chessboard` library for deep interactive gamification control without iframes.
- Integrate WebSockets for real-time community chat.
- Add fully functioning external payment gateway.

### Advanced
- Transition from SQLite to PostgreSQL for production.
- Cloud deployment (Vercel for Frontend, Render/Railway for Backend).

---

## 🧑‍💻 Contribution Log

### Latest Updates (March 2026)
- **Authentication & Security:** Fixed a critical JWT decoding bug resulting from strict integer-to-string subject validation requirements. Implemented global 401 interception in the frontend to automatically manage expired sessions smoothly.
- **E-Commerce Enhancements:** Repaired Wishlist POST requests. Improved the Product Checkout flow with dynamic Amazon-style Address selection derived from user profiles.
- **Profile Management:** Created a dedicated Address Management portal in the Profile dashboard allowing users to persistently view, add, and remove multiple delivery locations.
- **Course Enrollment Flow:** Upgraded Premium Course enrollments with a simulated standalone Checkout / Payment modal flow.
- **Puzzle Interactivity:** Replaced static FEN "gibberish" strings with fully interactive, embedded Lichess Analysis boards for real-time tactical visualization.
- **Database Overhaul:** Migrated from single JSON-like user store to a 16-Model SQLAlchemy relational database.
- **UI Rewrite:** Scrapped Tailwind in favor of a bespoke premium Dark-Mode Glassmorphism Vanilla CSS design map (`index.css`).
- **Seed Script:** Created an automated `seed.py` for effortless development environment spinning.