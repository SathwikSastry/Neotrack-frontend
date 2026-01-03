# 🌍 NeoTrack.Earth

**NeoTrack.Earth** is an interactive planetary defense visualization platform built for the NASA Space Apps Challenge. It provides real-time asteroid tracking, impact assessment simulations, and AI-powered space education.

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-green?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#-api-endpoints)
- [Testing the Application](#-testing-the-application)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Accessibility](#-accessibility)
- [Notes and Limitations](#-notes-and-limitations)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **🔭 Real-Time Asteroid Tracking** - Visualize near-Earth objects using NASA's NEO API data
- **💥 Impact Assessment Dashboard** - Calculate kinetic energy, crater size, and blast radius
- **🤖 Space AI Assistant** - AI-powered explanations for space concepts (powered by Groq LLM)
- **🌐 NASA Eyes Integration** - Embedded 3D solar system viewer from NASA
- **🎮 Meteor Madness Game** - Interactive asteroid defense game
- **♿ Accessibility First** - ARIA labels, keyboard navigation, and color-blind friendly palette

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 with React 18
- **3D Rendering:** Three.js with React Three Fiber & Drei
- **Styling:** TailwindCSS 4 with Framer Motion animations
- **UI Components:** Radix UI primitives with shadcn/ui
- **Charts:** Recharts for data visualization

### Backend
- **Framework:** Flask (Python)
- **AI Integration:** Groq LLM (Llama 3.1)
- **Data Source:** NASA NEO API with JSON fallback

---

## 📁 Project Structure

```
neotrack-frontend/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── asteroid-info/      # Asteroid information page
│   ├── custom-impact/      # Custom impact calculator
│   ├── game/               # Game page
│   ├── impact-zone/        # Impact assessment dashboard
│   └── space-ai/           # Space AI chat interface
├── backend/                # Flask backend
│   ├── app.py              # Main Flask application
│   ├── data/               # Asteroid data files
│   └── tests/              # Backend tests
├── components/             # React components
│   ├── ui/                 # UI primitives
│   ├── ai/                 # AI-related components
│   └── impact/             # Impact visualization components
├── lib/                    # Utility functions
├── public/                 # Static assets
└── styles/                 # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **Python** >= 3.8
- **pnpm** (recommended) or npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   **Linux/macOS:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

   **Windows (PowerShell):**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

3. (Optional) Set environment variables for external services:
   ```bash
   export GROQ_API_KEY="your_groq_key_here"
   export NASA_API_KEY="your_nasa_key_here"
   ```

4. Run the server:
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. From the repository root, install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

   The frontend will be available at `http://localhost:3000`

> **Note:** The frontend automatically sets `window.__NEOTRACK_API_BASE__` to `http://localhost:5000` for local development.

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/asteroids` | GET | Returns asteroid data for visualization |
| `/api/impact` | POST | Basic impact energy calculations |
| `/api/impact-details` | POST | Detailed impact physics (crater, seismic, blast) |
| `/api/ai-explain` | POST | AI explanation for astronomy terms |
| `/api/ask-ai` | POST | Space AI chat interface |

### Example: Impact Calculation

```bash
curl -X POST http://localhost:5000/api/impact \
  -H "Content-Type: application/json" \
  -d '{"velocity_kms": 20, "mass_kg": 1e9, "diameter_m": 100}'
```

---

## 🧪 Testing the Application

1. Open the site at [http://localhost:3000](http://localhost:3000)
2. Visit the **Simulation** page to see asteroid visualizations
3. Go to `/custom-impact` to test impact calculations
4. Try the **Space AI** for astronomy questions
5. Launch the **NASA Eyes** 3D viewer from the homepage

---

## 🌐 Deployment

### Frontend (Vercel)

1. Connect your repository to [Vercel](https://vercel.com)
2. Set environment variables for the backend API base URL
3. Deploy

### Backend (Render/Replit)

1. Deploy the `backend/` directory to [Render](https://render.com) or [Replit](https://replit.com)
2. Add secrets:
   - `GROQ_API_KEY` - For AI features
   - `NASA_API_KEY` - For live asteroid data
3. Update the frontend's API base URL to point to your deployed backend

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | No | Groq LLM API key for AI features |
| `NASA_API_KEY` | No | NASA API key for live NEO data |
| `PORT` | No | Backend port (default: 5000) |
| `GAME_ORIGIN` | No | Trusted origin for embedded game |

---

## ♿ Accessibility

NeoTrack.Earth is built with accessibility in mind:

- **ARIA labels** on all interactive elements
- **Keyboard navigation** support throughout
- **Color-blind friendly** palette and contrast ratios
- **Screen reader** compatible components

---

## ⚠️ Notes and Limitations

- The backend uses **simplified physics** for demonstration purposes and should not be used for scientific decision-making
- AI responses require a valid `GROQ_API_KEY`; without it, canned responses are provided
- For production, ensure the backend is publicly accessible and update `window.__NEOTRACK_API_BASE__`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project was created for the NASA Space Apps Challenge.

---

<p align="center">
  Made with ❤️ for planetary defense awareness
</p>
