from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import math
import json

app = Flask(__name__)
CORS(app)

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
        return jsonify({"status": "ok", "data": data})
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
        v_kms = float(payload.get("velocity_kms", 20.0))
        mass_kg = float(payload.get("mass_kg", 1e9))
        diameter_m = float(payload.get("diameter_m", 100.0))
        density = float(payload.get("density_kg_m3", 3000))
        target = payload.get("target", "ground")
    except Exception:
        return jsonify({"status": "error", "message": "Invalid numeric input"}), 400

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
