from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import math
import json

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
        "connect-src 'self' https://api.groq.ai https://api.nasa.gov",
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
            return json.load(f)
    except Exception:
        # Fallback: generate simple sample data
        sample = []
        for i in range(24):
            sample.append({
                "id": i + 1,
                "label": f"Asteroid {i+1}",
                "r": 4.5 + (i % 6) * 0.15 + (i % 3) * 0.05,
                "theta": (i / 24.0) * 2 * math.pi,
                "y": (i % 5 - 2) * 0.06,
                "size": 0.05 + (i % 5) * 0.02,
                "velocity_kms": round(5 + (i % 7) * 0.7, 2),
                "close_approach": False,
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
        "displacement_m": displacement_m,
        "seismic_magnitude_mw": seismic_mag,
        "blast_radius_km": blast_radius_km,
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
