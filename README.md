# 🍽️ Deewan Namak Mandi - Traditional Taste of D.I Khan

A full-featured, premium restaurant web application for **Deewan Namak Mandi**, featuring a modular customer ordering site, real-time table booking, automatic bill generation, WhatsApp notification routing, and a secure operations Admin Dashboard.

---

## ✨ Features
1. **Premium Brand Identity**: Visually crafted with a customized color scheme of Red (`#DC2626`), deep Royal Blue (`#060d26`), and pure crisp White, reflecting a bold, elegant traditional culture.
2. **Interactive Menu & Cart**: Filter dishes by category (BBQ, Karahi, Roti, Drinks), adjust quantities, and generate clean bills (with automatic 5% GST calculation).
3. **Double Service Modes**: Support for **Home Delivery** (with address collection) and **Sitting at Table** (with Table Number mapping).
4. **WhatsApp Kitchen Integration**: Formats order receipts into clean markdown and forwards them instantly via a WhatsApp link for kitchen processing.
5. **Real-time Reservations**: Full booking request form capturing name, phone, date, time, and guest count.
6. **Robust JWT Authentication**: Complete signup and login flows.
7. **Interactive Admin Dashboard**: Sync live orders, manage table reservation statuses, add/edit/delete menu items, and view registered customers.

---

## 🛠️ Quick-Test Accounts (Evaluation)
To evaluate the application instantly, you can use these pre-seeded credentials:

*   **Admin Dashboard Account:**
    *   **Email:** `admin@diwan.com`
    *   **Password:** `admin`
*   **Regular Customer Account:**
    *   **Email:** `customer@diwan.com`
    *   **Password:** `customer`

---

## 💻 Local Setup Instructions

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   npm (pre-bundled with Node.js)

### 2. Installation
Clone your project repository, navigate to the root directory, and install all pre-requisite packages:
```bash
npm install
```

### 3. Run Development Server
Boot the custom full-stack Express + Vite server locally on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Production Build
Compile both front-end Vite static assets and bundle the server using `esbuild`:
```bash
npm run build
npm start
```

---

## 🚀 Deployment Guidelines (Vercel, Render, Railway, MongoDB Atlas)

This applet runs out-of-the-box using an embedded, high-performance file-based JSON database engine (`src/db/data.json`) which is perfect for standalone development, testing, and container platforms. For highly scaled production hosting, transition to the cloud architecture outlined below:

### 1. Database Setup (MongoDB Atlas)
1.  Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and provision a Free Tier cluster.
2.  Obtain your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/diwan`).
3.  Inside your production `server.ts`, import `mongoose` and establish a database connection:
    ```typescript
    import mongoose from 'mongoose';
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diwan');
    ```

### 2. Backend Deployment (Render or Railway)
1.  Connect your GitHub repository to [Render](https://render.com/) or [Railway](https://railway.app/).
2.  Create a new **Web Service**.
3.  Set the following configuration values:
    *   **Build Command:** `npm run build`
    *   **Start Command:** `npm start`
    *   **Environment Variables:**
        *   `NODE_ENV`: `production`
        *   `JWT_SECRET`: `your_custom_secure_secret_key`
        *   `MONGODB_URI`: `your_mongodb_atlas_connection_string`
4.  Launch the deployment.

### 3. Frontend Deployment (Vercel)
For simple SPAs, deploy the built `/dist` directory static folder directly to [Vercel](https://vercel.com/) or configure your web service on Render/Railway to act as a unified full-stack container (already fully configured for you via the `server.ts` production fallback route).
