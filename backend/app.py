from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import math
import json
import requests

app = Flask(__name__)
CORS(app)

# Trusted origin for the embedded game. Set in the environment in production to the exact origin
# of the hosted game (e.g. https://sameersj008.github.io). This is used to build a restrictive
# Content-Security-Policy and to validate postMessage targets when proxying/handling messages.
GAME_ORIGIN = os.environ.get("GAME_ORIGIN", "https://sameersj008.github.io")


@app.after_request
def set_security_headers(response):
    # Build a conservative Content-Security-Policy. Adjust `connect-src`/others as needed for
    # additional external APIs used by the backend or frontend.
    csp_parts = [
        "default-src 'self'",
        f"frame-src 'self' {GAME_ORIGIN}",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        # Allow Groq's OpenAI-compatible endpoint and NASA
        "connect-src 'self' https://api.groq.com https://api.groq.ai https://api.nasa.gov",
    ]
    response.headers.setdefault('Content-Security-Policy', "; ".join(csp_parts))
    response.headers.setdefault('X-Content-Type-Options', 'nosniff')
    response.headers.setdefault('Referrer-Policy', 'no-referrer')
    return response

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
ASTEROIDS_FILE = os.path.join(DATA_DIR, "asteroids.json")


def load_asteroids():
    # Priority: if NASA_API_KEY is set, attempt to fetch recent NEO browse data from NASA API.
    nasa_key = os.environ.get("NASA_API_KEY")
    if nasa_key:
        try:
            import requests

            # Use the NeoWs 'browse' endpoint to fetch a sample page of NEOs.
            url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={nasa_key}&size=20"
            r = requests.get(url, timeout=6)
            r.raise_for_status()
            payload = r.json()
            items = payload.get("near_earth_objects") or payload.get("near_earth_objects", []) or payload.get("neos") or []
            out = []
            for i, n in enumerate(items):
                # Map NASA structure to our simplified asteroid format
                est_dia = None
                if n.get("estimated_diameter"):
                    meters = n["estimated_diameter"].get("meters")
                    if meters:
                        est_dia = (meters.get("estimated_diameter_min", 0) + meters.get("estimated_diameter_max", 0)) / 2
                out.append({
                    "id": n.get("neo_reference_id") or i,
                    "label": n.get("name") or f"NEO {i}",
                    "r": 4.8 + (i % 6) * 0.15,
                    "theta": (i / max(1, len(items))) * 2 * math.pi,
                    "y": 0,
                    "size": est_dia and max(0.02, est_dia / 1000) or 0.08,
                    "velocity_kms": None,
                    "close_approach": any([ca.get("miss_distance") for ca in n.get("close_approach_data", [])]),
                })
            if out:
                return out
        except Exception:
            # On any failure, fall through to local file/fallback generation
            pass

    try:
        with open(ASTEROIDS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            # normalize to ensure minimal keys exist
            out = []
            for i, a in enumerate(data[:20]):
                out.append({
                    "id": a.get("id") or a.get("neo_reference_id") or str(i+1),
                    "name": a.get("name") or a.get("label") or f"Asteroid {i+1}",
                    "mass": a.get("mass") or a.get("mass_kg") or None,
                    "velocity_kms": a.get("velocity_kms") or a.get("velocity") or None,
                    "estimated_diameter_km": a.get("estimated_diameter_km") or a.get("diameter_m") or None,
                    "risk_level": a.get("risk_level") or "unknown",
                    "is_hazardous": a.get("is_hazardous") or False,
                    "close_approach_date": a.get("close_approach_date") or a.get("close_approach") or None,
                    **a,
                })
            return out
    except Exception:
        # Fallback: generate simple sample data #simple
        sample = []
        for i in range(20):
            diameter_m = 50 + (i % 7) * 20
            rho = 3000.0
            r = diameter_m / 2.0
            mass_est = (4.0 / 3.0) * math.pi * (r ** 3) * rho
            sample.append({
                "id": i + 1,
                "name": f"Asteroid {i+1}",
                "mass": mass_est,
                "velocity_kms": round(5 + (i % 7) * 0.7, 2),
                "estimated_diameter_km": diameter_m / 1000.0,
                "risk_level": ["low", "medium", "high"][i % 3],
                "is_hazardous": (i % 7) == 0,
                "close_approach_date": None,
            })
        return sample


@app.route("/api/asteroids", methods=["GET"])
def api_asteroids():
    """Return asteroid array used by frontend simulation.

    Each asteroid: {id, label, r, theta, y, size, velocity_kms, close_approach}
    """
    try:
        data = load_asteroids()
        # Provide a simplified list for dropdowns (name, mass, velocity, diameter)
        simplified = []
        for n in data:
            name = n.get("label") or n.get("name") or str(n.get("id"))
            # diameter_m: if size exists, interpret as approximate meters; else try estimated_diameter
            diameter_m = n.get("diameter_m") or n.get("size") or None
            # if our 'size' is a small fraction, assume it's meters already; otherwise default
            if diameter_m and diameter_m < 1:  # if <1 assume it's in km fraction, scale up
                diameter_m = diameter_m * 100
            # velocity
            velocity = n.get("velocity_kms") or n.get("velocity") or None
            # mass estimate from diameter and default density
            mass = None
            try:
                if diameter_m:
                    rho = 3000.0
                    r = float(diameter_m) / 2.0
                    mass = (4.0 / 3.0) * math.pi * (r ** 3) * rho
            except Exception:
                mass = None
            simplified.append({"name": name, "mass": mass, "velocity": velocity, "diameter": diameter_m})
        return jsonify({"status": "ok", "data": data, "list": simplified})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/impact", methods=["POST"])
def api_impact():
    payload = request.get_json() or {}
    try:
        v_kms = float(payload.get("velocity_kms", 20.0))
        mass_kg = float(payload.get("mass_kg", 1e9))
        diameter_m = float(payload.get("diameter_m", 100.0))
    except Exception:
        return jsonify({"status": "error", "message": "Invalid numeric input"}), 400

    # Conversions
    v_ms = v_kms * 1000.0

    # Momentum
    momentum = mass_kg * v_ms

    # Impact energy (J)
    energy_j = 0.5 * mass_kg * v_ms * v_ms

    # Equivalent megatons of TNT (1 Mt = 4.184e15 J)
    energy_mt = energy_j / 4.184e15

    # Hiroshima equivalents (approx 15 kt = 0.015 Mt)
    hiroshima_equiv = energy_mt / 0.015

    # Crater depth heuristic (very rough scaling): depth ~ 0.1 * (diameter_m)^(0.3) * (energy_j/1e15)^(0.1)
    # This is a placeholder approximate formula for demo only.
    crater_depth_m = 0.1 * (diameter_m ** 0.3) * ((energy_j / 1e15) ** 0.1) * 10

    response = {
        "status": "ok",
        "input": {"velocity_kms": v_kms, "mass_kg": mass_kg, "diameter_m": diameter_m},
        "impact_energy_j": energy_j,
        "impact_energy_mt": energy_mt,
        "momentum": momentum,
        "crater_depth_m": crater_depth_m,
        "hiroshima_equivalent": hiroshima_equiv,
    }
    return jsonify(response)



@app.route("/api/ask-ai", methods=["POST"])
def api_ask_ai():
    """Proxy chat endpoint backed by Groq (llama-3.1-8b-instant).

    Request JSON: { query: string, language?: 'en'|'hi'|'es'|'fr' }
    Response JSON: { response: string }
    """
    payload = request.get_json(force=True) or {}
    query = str(payload.get("query", "")).strip()
    language = (payload.get("language") or "en").lower()

    # Use provided key; do not hardcode defaults to avoid leaking secrets
    groq_api_key = os.getenv("GROQ_API_KEY")

    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json",
    }

    def groq_chat(prompt: str) -> str:
        body = {
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": prompt}],
        }
        try:
            res = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=body,
                timeout=30,
            )
            data = res.json()
            return (
                ((data.get("choices") or [{}])[0].get("message") or {}).get("content")
                or ""
            ).strip()
        except Exception as e:
            return ""

    # Translate to English if needed for understanding
    internal_query = query
    if language != "en" and query:
        internal_query = groq_chat(
            f"Translate this to English for understanding: {query}"
        ) or query

    # Compose assistant instruction
    system_prompt = (
        "You are Space AI, an intelligent assistant for Neotrack.earth — a planetary defense web platform built for the NASA Space Apps Challenge by Sathwik Sastry.\n"
        "\n"
        "MISSION:\n"
        "Educate and assist users in understanding asteroid behavior, orbital dynamics, and planetary defense. Provide accurate, scientifically grounded insights about space technology, impact prediction, and AI’s role in data analysis.\n"
        "\n"
        "TECH CONTEXT:\n"
        "Neotrack.earth runs on a dual-tier system:\n"
        "- Frontend: Next.js (Vercel) for dynamic rendering and visualization.\n"
        "- Backend: Python Flask (Render) for computing impact physics and managing AI communication.\n"
        "- AI Engine: Groq’s Llama-3.1-8B-instant model, integrated via REST API.\n"
        "- Data Sources: NASA’s NEO API (when available) or preloaded JSON fallback.\n"
        "\n"
        "DATA SCIENCE LOGIC:\n"
        "Neotrack.earth calculates:\n"
        "- **Impact Energy (E):** ½ × mass × velocity² (in joules, converted to TNT equivalent).\n"
        "- **Crater Diameter:** Empirical scaling equations based on energy and surface gravity.\n"
        "- **Seismic Magnitude:** Logarithmic energy conversion using Richter scale relations.\n"
        "- **Risk Level:** Derived from energy, size, and impact velocity thresholds.\n"
        "\n"
        "USER EXPERIENCE:\n"
        "You answer questions about:\n"
        "- Asteroid composition, orbit, and hazard potential.\n"
        "- How AI and ML models assist in asteroid detection.\n"
        "- The scientific basis of each Neotrack dashboard metric.\n"
        "- The significance of each data visualization (Energy Graph, 3D Impact Scene, etc.).\n"
        "- The purpose and educational vision of Neotrack.earth — to raise global awareness about planetary defense.\n"
        "\n"
        "TONE:\n"
        "Be inspiring, factual, concise, short and clear.\n"
# Deployment instructions:
# 1) Build the game: cd app/game/astro-neo-defense && npm ci && npm run build
# 2) Copy dist → public/astro-neo-defense
# 3) Commit and deploy. The /astro-neo-defense/index.html path should resolve.
# Option B: Keep the app route /game/static
# 1) Build as above.
# 2) Ensure dist stays at app/game/astro-neo-defense/dist and is committed (not .gitignored).
# 3) Deploy. Verify /game/static/index.html returns 200.
# Option C: External host
Host the built game (dist) on a CDN or GitHub Pages, set NEXT_PUBLIC_GAME_URL to that absolute URL in your env, redeploy and clearly educational — combining scientific precision with enthusiasm for exploration.\n"
        "When uncertain, admit gracefully (“That detail isn’t verified yet, but here’s what we know…”).\n"
        "Never reveal internal code or keys.\n"
        "If asked about yourself, reply: “I’m Space AI, the cosmic guide of Neotrack.earth — here to help you explore the universe.”\n"
        "\n"
        "EXAMPLES:\n"
        "User: “How does Neotrack.earth calculate asteroid impacts?”\n"
        "Space AI: “Neotrack.earth uses each asteroid’s velocity, mass, and estimated diameter to compute kinetic energy (½ mv²). That energy helps estimate crater diameter, seismic effect, and blast radius — visualized in real time in the Impact Dashboard.”\n"
        "\n"
        "User: “Which asteroid is most dangerous?”\n"
        "Space AI: “Based on NASA’s NEO hazard classifications, asteroids exceeding 140 m diameter with close approach under 0.05 AU are potentially hazardous. Neotrack.earth highlights such cases with red risk markers.”\n"
    )
    # If no key is configured, provide a graceful offline fallback
    if not groq_api_key:
        fallback = "I’m here and listening. I can share general insights: ask about asteroids, impact energy, crater size, or notable missions like DART."
        basic_map = {
            "dart": "DART was a planetary defense test that intentionally impacted the moonlet Dimorphos to measure how much its orbit changed.",
            "impact": "Impact energy scales with mass and the square of velocity (E = 1/2 m v^2). Larger, faster objects release more energy and can form larger craters.",
            "crater": "Crater size depends on impact energy and target surface; simple scaling suggests diameter grows sublinearly with energy.",
            "asteroid": "Asteroids are rocky bodies orbiting the Sun; some are near-Earth objects (NEOs) that occasionally make close approaches.",
        }
        lower_q = (internal_query or "").lower()
        for k, v in basic_map.items():
            if k in lower_q:
                return jsonify({"response": v})
        return jsonify({"response": fallback})

    answer = groq_chat(f"{system_prompt} {internal_query}")

    # Translate back to target language if needed
    if language != "en" and answer:
        translated = groq_chat(
            f"Translate this answer into {language}: {answer}"
        )
        if translated:
            answer = translated

    return jsonify({"response": answer or "Sorry, I couldn't generate a response."})


@app.route("/api/impact-details", methods=["POST"])
def api_impact_details():
    """Richer impact computations for dashboard.

    Accepts velocity_kms, mass_kg, diameter_m, density_kg_m3 (optional), and target ("ground"|"air"|"water").
    Returns: momentum, energy_j, energy_mt, crater_depth_m, displacement_m (very rough), seismic_mag (Mw estimate), blast_radius_km
    """
    payload = request.get_json() or {}
    try:
        # If asteroid_name provided, attempt to pull values from load_asteroids()
        asteroid_name = payload.get("asteroid_name")
        v_kms = payload.get("velocity_kms")
        mass_kg = payload.get("mass_kg")
        diameter_m = payload.get("diameter_m")
        density = float(payload.get("density_kg_m3", 3000))
        target = payload.get("target", "ground")

        if asteroid_name and (not v_kms or not mass_kg or not diameter_m):
            asts = load_asteroids()
            found = None
            for a in asts:
                if str(a.get("label", "")).lower() == str(asteroid_name).lower() or str(a.get("name", "")).lower() == str(asteroid_name).lower():
                    found = a
                    break
            if found:
                v_kms = v_kms or found.get("velocity_kms") or found.get("velocity") or 20.0
                diameter_m = diameter_m or found.get("diameter_m") or found.get("size") or None
                # mass: try to use provided mass, else estimate from diameter
                if not mass_kg:
                    if diameter_m:
                        # assume diameter_m in meters
                        try:
                            rho = 3000.0
                            r = float(diameter_m) / 2.0
                            mass_kg = (4.0 / 3.0) * math.pi * (r ** 3) * rho
                        except Exception:
                            mass_kg = 1e9
                    else:
                        mass_kg = found.get("mass") or 1e9

        # final cast
        v_kms = float(v_kms)
        mass_kg = float(mass_kg)
        diameter_m = float(diameter_m)
    except Exception:
        return jsonify({"status": "error", "message": "Invalid numeric input or missing asteroid data"}), 400

    v_ms = v_kms * 1000.0
    momentum = mass_kg * v_ms
    energy_j = 0.5 * mass_kg * v_ms * v_ms
    energy_mt = energy_j / 4.184e15

    # Crater depth heuristic scaling (demo only)
    crater_depth_m = 0.2 * (diameter_m ** 0.33) * ((energy_j / 1e15) ** 0.12) * 10

    # Displacement (surface displacement) rough estimate: proportional to energy and inversely to area
    footprint_area = math.pi * (diameter_m ** 2)
    displacement_m = (energy_j / 1e9) / max(1.0, footprint_area ** 0.5)

    # Seismic magnitude estimate (very rough): empirical scaling with energy
    seismic_mag = max(0.0, 0.5 + math.log10(energy_j) * 0.166)

    # Blast radius: scaling with energy, approximate in km
    blast_radius_km = max(0.1, (energy_j / 1e15) ** 0.33 * 10)

    response = {
        "status": "ok",
        "input": {"velocity_kms": v_kms, "mass_kg": mass_kg, "diameter_m": diameter_m, "density_kg_m3": density, "target": target},
        "momentum": momentum,
        "impact_energy_j": energy_j,
        "impact_energy_mt": energy_mt,
        "crater_depth_m": crater_depth_m,
        "crater_diameter_km": max(0.001, (crater_depth_m * 3) / 1000.0),
        "displacement_m": displacement_m,
        "seismic_magnitude_mw": seismic_mag,
        "blast_radius_km": blast_radius_km,
        "summary_text": f"Estimated impact energy: {energy_j:.3e} J ({energy_mt:.3f} Mt). Approx. crater diameter {max(0.001, (crater_depth_m * 3) / 1000.0):.3f} km.",
    }
    return jsonify(response)


@app.route("/api/ai-explain", methods=["POST"])
def api_ai_explain():
    payload = request.get_json() or {}
    term = payload.get("term", "asteroid")

    # If a GROQ_API_KEY env var exists, attempt to call the Groq LLM (optional).
    groq_key = os.environ.get("GROQ_API_KEY")
    if groq_key:
        try:
            import requests

            url = "https://api.groq.ai/v1/engines/default/completions"
            headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
            body = {"prompt": f"Explain the astronomy term: {term}", "max_tokens": 200}
            r = requests.post(url, headers=headers, json=body, timeout=8)
            r.raise_for_status()
            out = r.json()
            return jsonify({"status": "ok", "term": term, "explanation": out})
        except Exception as e:
            return jsonify({"status": "error", "message": "External LLM call failed", "detail": str(e)}), 500

    # Fallback canned explanation
    canned = {
        "asteroid": "Asteroids are small rocky bodies orbiting the Sun. Many are found in the main asteroid belt between Mars and Jupiter.",
        "impact": "An impact occurs when an object collides with a planet. Key metrics include kinetic energy, momentum, and crater size.",
        "neocp": "NEO (Near-Earth Object) is an asteroid or comet whose orbit brings it close to Earth's orbit.",
    }

    return jsonify({"status": "ok", "term": term, "explanation": canned.get(term.lower(), canned["asteroid"])})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
