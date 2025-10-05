# NeoTrack.Earth — Fullstack (Frontend + Backend)

This repository contains the NeoTrack.Earth frontend (Next.js + React + Three.js) and a minimal Flask backend for API endpoints used by the UI.

Overview
- Frontend: Next.js app in the repo root (React, Three.js, TailwindCSS, Framer Motion)
- Backend: Flask app at `/backend` exposing `/api/asteroids`, `/api/impact`, `/api/ai-explain`

Local development (Windows PowerShell)

1. Backend

   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
   # Optional: set GROQ_API_KEY environment variable for external LLM
   $env:GROQ_API_KEY = "your_groq_key_here"
   python app.py

   The backend listens on port 5000.

2. Frontend

   # from repo root
   pnpm install
   pnpm dev

   The layout injects a small client helper which will set `window.__NEOTRACK_API_BASE__` to `http://localhost:5000` when visiting locally. Frontend components will call `/api/asteroids` and `/api/impact` through that base.

Testing the flow
- Open the site at http://localhost:3000
- Visit "Simulation" or the Custom Impact page at `/custom-impact` to test POSTing to the backend.
- AI explanations call `/api/ai-explain` and will use a canned response unless `GROQ_API_KEY` is set.

Deployment
- Frontend: Vercel is recommended (Next.js). If deploying to Vercel, either deploy the frontend separately and configure the backend host, or deploy backend to Render/Replit and set environment variables in Vercel for API base.
- Backend: Render or Replit are simple options for the Flask service. Add `GROQ_API_KEY` as a secret if using Groq LLM.

Notes and limitations
- The backend includes simplified physics for demonstration and should not be used for scientific decision-making.
- The project adds accessibility (ARIA labels, keyboard-friendly forms) and a color-blind friendly palette.
- For the challenge demo, ensure the backend is publicly reachable and update `window.__NEOTRACK_API_BASE__` accordingly.

If you'd like, I can:
- Add CI tests and a tiny unit test for `/api/impact` using pytest
- Add a Dockerfile for the backend
- Wire up Vercel + Render deployment config files
# Remix of Untitled

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sathwik27/v0-remix-of-untitled)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/JKuP84JnsQG)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/sathwik27/v0-remix-of-untitled](https://vercel.com/sathwik27/v0-remix-of-untitled)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/JKuP84JnsQG](https://v0.app/chat/projects/JKuP84JnsQG)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository