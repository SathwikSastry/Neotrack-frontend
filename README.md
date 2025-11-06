<div align="center">

# 🌍 NeoTrack.Earth

**Track, Visualize, and Simulate Near-Earth Objects in Real-Time**

[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-lightgrey)](https://flask.palletsprojects.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📖 About

**NeoTrack.Earth** is a full-stack web application that brings Near-Earth Object (NEO) tracking to life. Built for space enthusiasts, educators, and curious minds, this platform combines real NASA data with interactive 3D visualizations, impact simulations, and AI-powered explanations to make asteroid tracking accessible and engaging.

### 🎯 Key Highlights

- **Real-time NEO Data**: Integrates with NASA's NeoWs API to fetch live asteroid information
- **3D Visualizations**: Stunning Three.js-powered orbital simulations
- **Impact Calculator**: Simulate potential asteroid impacts and visualize consequences
- **AI Assistant**: Get intelligent explanations about asteroids and space phenomena
- **Educational**: Interactive game and comprehensive learning resources
- **Accessible**: WCAG-compliant with keyboard navigation and screen reader support

---

## ✨ Features

### 🚀 Core Features

- **Interactive Dashboard**: Browse and explore near-Earth asteroids with detailed orbital parameters
- **3D Orbit Simulation**: Visualize asteroid trajectories in real-time using Three.js
- **Custom Impact Simulator**: Calculate impact energy, crater size, and blast radius for hypothetical scenarios
- **Impact Zone Mapper**: Visualize potential impact zones on Earth
- **Space AI Assistant**: Ask questions and get AI-powered explanations about asteroids
- **Asteroid Database**: Search and filter through comprehensive asteroid data
- **Astro Neo Defense Game**: Play an educational space defense game

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly interface for extended viewing
- **Color-blind Friendly**: Accessible color palette design
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Modern UI**: Built with Radix UI and Tailwind CSS

---

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 15.2.4](https://nextjs.org/) (React 18)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Language**: TypeScript

### Backend

- **Framework**: [Flask 3.1.0](https://flask.palletsprojects.com/)
- **CORS**: Flask-CORS for cross-origin requests
- **APIs**: NASA NeoWs API, Groq LLM (optional)
- **Language**: Python 3.8+

### External APIs

- **NASA NeoWs API**: Near-Earth Object data
- **Groq AI**: AI-powered explanations (optional)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm/pnpm**: >= 8.0.0
- **Python**: >= 3.8
- **pip**: Latest version

### 📦 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SathwikSastry/Neotrack-frontend.git
cd Neotrack-frontend
```

#### 2️⃣ Backend Setup

**Windows (PowerShell)**:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Optional: Set environment variables
$env:GROQ_API_KEY = "your_groq_api_key_here"
$env:NASA_API_KEY = "your_nasa_api_key_here"

python app.py
```

**macOS/Linux (Bash/Zsh)**:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Optional: Set environment variables
export GROQ_API_KEY="your_groq_api_key_here"
export NASA_API_KEY="your_nasa_api_key_here"

python app.py
```

The backend server will start on `http://localhost:5000`

#### 3️⃣ Frontend Setup

```bash
# Return to repository root
cd ..

# Install dependencies (using pnpm)
pnpm install

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### 🎮 Testing the Application

1. Open your browser to `http://localhost:3000`
2. Explore the interactive dashboard with real NEO data
3. Try the **3D Orbit Simulation** to visualize asteroid trajectories
4. Navigate to **Custom Impact** (`/custom-impact`) to simulate asteroid impacts
5. Visit **Space AI** (`/space-ai`) to ask questions about asteroids
6. Play the **Astro Neo Defense** game (`/game`)

---

## 📚 API Documentation

### Backend Endpoints

The Flask backend exposes the following API endpoints:

#### `GET /api/asteroids`
Fetches near-Earth asteroid data from NASA NeoWs API or local cache.

**Response**:
```json
{
  "near_earth_objects": [...],
  "element_count": 20,
  "links": {...}
}
```

#### `POST /api/impact`
Calculates impact parameters for a given asteroid scenario.

**Request Body**:
```json
{
  "diameter": 100,
  "velocity": 20,
  "angle": 45,
  "density": 3000
}
```

**Response**:
```json
{
  "energy": "...",
  "crater_diameter": "...",
  "blast_radius": "..."
}
```

#### `POST /api/ai-explain`
Generates AI-powered explanations about asteroids (requires `GROQ_API_KEY`).

**Request Body**:
```json
{
  "query": "What is a near-Earth object?"
}
```

#### `GET /api/impact-details`
Provides detailed impact scenario information.

#### `POST /api/ask-ai`
Alternative AI query endpoint for general space questions.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq AI API key for AI explanations | No |
| `NASA_API_KEY` | NASA API key for NEO data | No |
| `GAME_ORIGIN` | Trusted origin for embedded game | No |
| `PORT` | Backend server port (default: 5000) | No |

---

## 🚢 Deployment

### Frontend (Vercel)

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository
2. **Import to Vercel**: Go to [Vercel](https://vercel.com/) and import your repository
3. **Configure Build Settings**:
   - Framework Preset: `Next.js`
   - Root Directory: `./` (repository root)
   - Build Command: `pnpm build`
   - Output Directory: `.next`
4. **Environment Variables**: Set backend API URL if needed
5. **Deploy**: Vercel will automatically build and deploy your application

### Backend (Render/Railway/Replit)

#### Using Render:

1. Create a new **Web Service** on [Render](https://render.com/)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
4. Add environment variables:
   - `GROQ_API_KEY` (optional)
   - `NASA_API_KEY` (optional)
   - `PORT` (Render sets this automatically)
5. Deploy

#### Using Docker:

```bash
cd backend
docker build -t neotrack-backend .
docker run -p 5000:5000 -e GROQ_API_KEY=your_key neotrack-backend
```

### Connecting Frontend and Backend

After deploying both services:

1. Update the frontend to point to your backend URL
2. In production, configure CORS settings in `backend/app.py`
3. Set appropriate environment variables in your deployment platform

---

## 🧪 Development

### Available Scripts

**Frontend**:
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

**Backend**:
```bash
python app.py     # Start Flask server
pytest            # Run tests (if configured)
```

### Project Structure

```
Neotrack-frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── asteroid-info/     # Asteroid details page
│   ├── custom-impact/     # Impact simulator page
│   ├── game/              # Game page
│   ├── impact-zone/       # Impact zone mapper
│   ├── space-ai/          # AI assistant page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ai/               # AI-related components
│   ├── impact/           # Impact simulation components
│   ├── ui/               # UI components (Radix)
│   └── ...
├── backend/              # Flask backend
│   ├── app.py           # Main Flask application
│   ├── data/            # Data storage
│   ├── tests/           # Backend tests
│   └── requirements.txt # Python dependencies
├── lib/                  # Utility functions
├── public/              # Static assets
├── styles/              # Global styles
└── README.md            # This file
```

---

## 🔒 Security

- **Content Security Policy**: Configured in Flask backend
- **CORS**: Properly configured for cross-origin requests
- **Input Validation**: All user inputs are validated
- **API Key Security**: Environment variables for sensitive data

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure accessibility standards are met

---

## 📝 Notes and Limitations

- **Educational Purpose**: The impact calculator uses simplified physics models for demonstration purposes and should not be used for scientific decision-making or real impact predictions
- **Data Accuracy**: Asteroid data depends on NASA API availability and may have delays
- **AI Responses**: AI features require valid API keys and are subject to rate limits
- **Browser Compatibility**: Best experienced on modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🙏 Acknowledgments

- **NASA**: For providing the NeoWs API and asteroid data
- **Space Data Community**: For inspiration and resources
- **Open Source Libraries**: All the amazing tools that made this project possible
- **Contributors**: Everyone who has contributed to improving NeoTrack.Earth

---

## 📧 Contact & Support

- **Repository**: [github.com/SathwikSastry/Neotrack-frontend](https://github.com/SathwikSastry/Neotrack-frontend)
- **Issues**: [Report a bug or request a feature](https://github.com/SathwikSastry/Neotrack-frontend/issues)

---

<div align="center">

**Made with ❤️ for space enthusiasts everywhere**

⭐ Star this repository if you find it helpful!

</div>
