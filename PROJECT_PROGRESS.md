# 🧠 NextMove Chess Store – Project Progress

## 📌 Project Overview
NextMove is a full-stack e-commerce platform for chess products, integrating:
- CRM (Customer Relationship Management)
- SCM (Supply Chain Management)
- Subscription-based learning
- Community engagement

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router

### Backend
- FastAPI (Python)

### Storage
- In-memory (backend)
- LocalStorage (frontend)

---

## ✅ Features Implemented

### 🛒 E-Commerce
- Product listing & details
- Add to cart
- Cart persistence
- Checkout system
- Order history

---

### 📊 CRM Features
- User activity tracking (`USER_ACTIVITY`)
- Product recommendations
- Customer insights:
  - Total orders
  - Total spending

---

### 📦 SCM Features
- Inventory tracking
- Stock validation during orders

#### Push Strategy
- Preloaded inventory

#### Pull Strategy
- Stock updates based on demand

---

### 📚 Subscription Model
- Chess courses available
- Users can subscribe
- Stored in `SUBSCRIPTIONS`
- Displayed in Profile

---

### 💬 Community Feature
- Only subscribers can access
- Post and view messages
- Backend access control

---

## 🧩 API Endpoints

| Feature | Endpoint |
|--------|--------|
| Products | `/products` |
| Orders | `/orders` |
| Users | `/users` |
| Auth | `/auth` |
| Courses | `/courses` |
| Community | `/community` |

---

## 🌐 Frontend Routes

| Route | Page |
|------|------|
| `/` | Home |
| `/product/:id` | Product Detail |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/profile` | Profile |
| `/courses` | Courses |
| `/community` | Community |

---

## ⚙️ Current Status

✅ Fully working:
- Products
- Cart & Checkout
- CRM tracking
- Recommendations
- Courses
- Community

---

## ⚠️ Limitations

- No database (in-memory only)
- No payment gateway
- No authentication tokens (JWT)
- Basic UI

---

## 🚀 Next Steps

### High Priority
- Add database (PostgreSQL / MongoDB)
- Implement JWT authentication
- Improve recommendation logic

### Medium Priority
- Payment integration
- UI improvements
- Notifications

### Advanced
- Real-time chat (WebSockets)
- ML-based recommendations
- Analytics dashboard

---

## 📈 Business Value

- Improves customer retention
- Enables personalization
- Enhances engagement
- Optimizes inventory usage
- Increases lifetime value via subscriptions

---

## 🧑‍💻 Contribution Log

### Latest Update
- Added Courses (subscription model)
- Added Community (subscriber-only access)

---

## 🔄 Update Instructions

After each major change:
1. Update "Latest Update"
2. Add new features under relevant sections
3. Push changes to GitHub

---