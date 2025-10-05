NeoTrack.Earth - Backend (Flask)

Quick start (local):

1. Create a Python environment (recommended):

   python -m venv .venv
   .venv\Scripts\Activate.ps1; pip install -r requirements.txt

2. Run the server:

   $env:FLASK_APP = "app.py"; python app.py

The server listens on port 5000 by default. To expose a different port, set PORT environment variable.

Notes:
- Place sample asteroid JSON in `backend/data/asteroids.json`.
- For Groq LLM integration, set environment variable `GROQ_API_KEY`.
- This backend is intentionally minimal for demo and challenge submission use.
