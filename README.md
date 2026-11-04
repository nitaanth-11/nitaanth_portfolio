# Nitaanth Panickar — Portfolio

Personal developer portfolio and showcase for Nitaanth Panickar, Data Science undergraduate at MPSTME NMIMS.

## 🚀 Overview

- **Frontend:** Vanilla HTML5, CSS3 (Modern Glassmorphic Dark UI), JavaScript (ES6+).
- **Backend:** Python Flask API service (`server.py`) with Vercel serverless integration (`api/index.py`).
- **Key Modules:**
  - `index.html` — Semantic, responsive portfolio layout.
  - `styles.css` — Custom glassmorphism, responsive grid, dynamic hover micro-interactions.
  - `app.js` — Client-side API hydration with resilient local fallback.
  - `server.py` — Flask API service with dual-route support.
  - `vercel.json` — Vercel routing and serverless function configuration.

## ⚡ Deployment to Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Other**.
3. Root Directory: `./` (leave default).
4. Click **Deploy**. Vercel will automatically serve the static frontend and route `/api/*` to the Python serverless function (`api/index.py`).

## 🛠️ Setup & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nitaanth-11/nitaanth_portfolio.git
   cd nitaanth_portfolio
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python server.py
   ```
   Open `http://localhost:5000` in your browser.
