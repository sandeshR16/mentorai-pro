# MentorAI — Full-Stack AI Career Engine

MentorAI is a premium AI-powered mentorship and placement preparation platform. It helps engineering students build customized learning roadmaps, evaluate technical and HR interview readiness using AI, audit skill gaps, and view real-time placement probability forecasts.

## 🚀 Architecture Overview

The application is structured as a decoupled full-stack architecture:

- **Frontend**: Built with React, Vite, Tailwind CSS, Lucide icons, and TanStack Router.
- **Backend**: Built with Node.js, Express, MongoDB (Mongoose), and JSON Web Tokens (JWT) for authentication.
- **AI Integration**: Integrates Meta-Llama-3.1-70B-Instruct-Turbo via Together AI (features automatic high-quality local mock fallbacks for offline or tokenless testing).

---

## 🛠️ Local Development Setup

To run both services locally, follow these steps:

### 1. Backend Server Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder (a default `.env` template exists) and set your variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mentor-ai
   JWT_SECRET=your_jwt_secret_key
   TOGETHER_API_KEY=your_together_api_key_here
   ```
   *Note: If MongoDB is not running locally, the server will automatically fallback to **Offline Database Mode** with mock fallbacks, meaning the APIs will remain operational.*
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 2. Frontend App Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:8080`.

---

## ☁️ Production Deployment Guide

Deploy the backend and frontend separately to get the best scalability and performance.

### 🌐 1. Backend Deployment (e.g., Render, Railway, Heroku)

Deploy your Node.js server to a hosting provider like **Render** or **Railway**:

1. Log in to [Render](https://render.com/) and click **New** -> **Web Service**.
2. Connect your GitHub repository `https://github.com/sandeshR16/mentorai-pro.git`.
3. Set the following details:
   - **Name**: `mentorai-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables** in Render's configuration tab:
   - `MONGO_URI`: Your production MongoDB Atlas Connection String (e.g., `mongodb+srv://...`).
   - `JWT_SECRET`: A secure random secret string for JWT encryption.
   - `TOGETHER_API_KEY`: Your Together AI API token (optional; if not provided, offline mocks will be used).
   - `PORT`: `5000` (Render binds this dynamically, but setting a default is good practice).
5. Click **Deploy Web Service**. Render will build and host your backend. Copy your deployed service URL (e.g., `https://mentorai-backend.onrender.com`).

---

### 🎨 2. Frontend Deployment (e.g., Vercel)

Deploy the React/Vite/TanStack Start assets and server to Vercel:

1. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Configure the following build settings:
   - **Framework Preset**: `TanStack Start` (or select `Other` if it defaults to Vite).
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty/default (do NOT override to `dist` or `dist/client`; Vercel automatically detects the Nitro build output at `.vercel/output`).
4. Add the following **Environment Variables**:
   - `VITE_API_URL`: Set this to the URL of your deployed backend followed by `/api` (e.g., `https://mentorai-backend.onrender.com/api`).
   - `VITE_SUPABASE_URL`: Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public API key.
5. Click **Deploy**. Vercel will bundle your assets and provide a production URL (e.g., `https://mentorai-pro.vercel.app`).

Now your application is fully live, connected, and ready for use!
