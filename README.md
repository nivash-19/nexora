# 🛰️ HeatScape (Nexora)
### *AI-Powered Urban Climate Resilience & Municipal Cooling Platform*

[![Live Web Application](https://img.shields.io/badge/🚀%20Live%20Demo-nexora--two--chi.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://nexora-two-chi.vercel.app)
[![API Backend](https://img.shields.io/badge/⚙️%20FastAPI%20Backend-heatscape--nexora.onrender.com-4f46e5?style=for-the-badge&logo=render&logoColor=white)](https://heatscape-nexora.onrender.com)
[![Swagger Docs](https://img.shields.io/badge/📖%20API%20Docs-Swagger%20UI-0284c7?style=for-the-badge&logo=fastapi&logoColor=white)](https://heatscape-nexora.onrender.com/docs)

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776ab?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Engine-8e75ff?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-Live%20Telemetry-f59e0b?style=flat-square)](https://open-meteo.com/)

---

## 🌟 What is HeatScape?

**HeatScape (Nexora)** is an intelligent decision-support system designed to tackle **Urban Heat Islands (UHI)** in the Chennai Metropolitan Area. 

Instead of generic tree-planting drives or ad-hoc interventions, HeatScape combines **satellite earth observation**, **live meteorological telemetry**, and **generative AI** to tell city planners:
1. **Where** extreme heat hotspots are located ($250\text{m} \times 250\text{m}$ resolution).
2. **Why** that specific area is overheating (asphalt absorption, lack of trees, or distance from water).
3. **What** standardized cooling interventions will fix it (with verified costs and expected temperature drops).
4. **How** to allocate limited municipal budgets to achieve the highest cooling impact (°C drop per rupee).

---

## 🎯 Key Highlights & Features

| Feature | Description |
| :--- | :--- |
| 🛰️ **Satellite Heat Diagnosis** | Ingests **Landsat 8/9** thermal infrared (TIRS) and optical vegetation (NDVI) telemetry with OpenStreetMap building footprints down to 6.25-hectare urban cells. |
| ⚡ **Live Weather & Solar Sync** | Real-time atmospheric integration with **Open-Meteo**, computing dynamic surface temperatures from live solar irradiance ($W/m^2$), ambient temperature, and humidity. |
| 🗺️ **Interactive 3-Mode Maps** | Switch live between **Intervention Blueprint (Diff)**, **Thermal Infrared (TIRS)**, and **Vegetation Canopy (NDVI)** with synchronized theme colors across the entire UI. |
| 🏛️ **Tier 1 Municipal Solutions** | Research-backed cooling blueprints (cool roofs, living walls, native trees) with a dedicated **Lightbulb (💡) Area Justification** explaining why it solves that neighborhood's crisis. |
| 🤖 **Tier 2 Generative AI (Gemini)** | Leverages **Google Gemini** to synthesize creative, microclimate-adapted cooling architectures bounded by municipal cost ceilings. |
| 💰 **Smart Budget Optimizer** | Mathematical greedy knapsack algorithm calculating the optimal allocation of municipal funds (₹50k to ₹30L+) for maximum temperature reduction. |
| 📋 **Persistent Ward Action Plan** | One-click adoption of priority intervention plans with persistent browser storage and a live floating dock tracking committed public funds. |
| 💬 **Nexora Cooling Pilot** | Conversational AI assistant grounded in Chennai's microclimates, ready to answer municipal planners' questions. |

---

## 🏙️ Focus Sectors (Chennai Microclimatic Archetypes)

HeatScape focuses on **6 representative urban typologies** across Chennai:

* 🏭 **Manali (Petrochemical Corridor)** — Peak industrial radiant heat ($41.5^\circ\text{C}-43.5^\circ\text{C}$), unshaded sheet metal sheds, heavy shift worker thermal stress.
* ⚙️ **Ambattur (MSME Industrial Estate)** — High impervious footprint ($>91\%$), dense tin/asbestos roofing conducting solar heat into shop floors.
* 🛒 **Koyambedu (Wholesale Market & CMBT)** — Asia's largest perishable goods market; continuous asphalt loading bays and high food spoilage vulnerability.
* 🏢 **Teynampet (Corporate Street Canyon)** — Anna Salai commercial corridor where glass and concrete facades trap and re-radiate heat.
* 💻 **Perungudi (OMR IT Corridor)** — Rapid concrete expansion adjacent to the Pallikaranai marshland with low natural canopy cover.
* 🌳 **Anna Nagar (Residential Control Baseline)** — Planned residential grid with avenues and parks serving as the empirical scientific baseline.

---

## 🧩 System Architecture

```
  🛰️ Landsat 8/9 Telemetry + OpenStreetMap
                    │
                    ▼
  ┌──────────────────────────────────────────────────┐
  │  System 1: Data Ingestion & Diagnostic Pipeline  │
  │  • 250m x 250m Mesh  • Composite Heat Scoring     │
  └─────────────────┬────────────────────────────────┘
                    │
                    ▼
  ┌──────────────────────────────────────────────────┐
  │  System 2: FastAPI Backend Engine                │
  │  • Real-Time Weather Telemetry (Open-Meteo)      │
  │  • Tier 1 Verified Blueprints + Localized Proofs │
  │  • Tier 2 Generative Cooling Ideas (Gemini AI)   │
  │  • Knapsack Budget Optimizer Engine              │
  └─────────────────┬────────────────────────────────┘
                    │
                    ▼
  ┌──────────────────────────────────────────────────┐
  │  React 18 + Vite + Leaflet Web Application       │
  │  • Dynamic 3-Mode Cartography & Sector Reframing │
  │  • AI Priority Advisor & Knapsack Budget UI      │
  │  • Ward Action Plan Persistent Dossier           │
  └──────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 5, Leaflet, React-Leaflet, Lucide Icons, Axios, Modern Glassmorphism CSS.
* **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic v2, HTTPX.
* **Artificial Intelligence**: Google Gemini 1.5/2.0 API (via `google-generativeai`) with offline fallback.
* **Remote Sensing & Spatial Data**: USGS Landsat-9 TIRS & OLI, OSMnx, Shapely, GeoPandas.
* **Live Telemetry**: Open-Meteo Global Weather & Solar API.
* **Cloud & Hosting**: Vercel (Frontend SPA) + Render (FastAPI Backend Service).

---

## ⚡ Quickstart (Run Locally in 2 Minutes)

### 1. Clone the repository
```bash
git clone https://github.com/nivash-19/nexora.git
cd nexora
```

### 2. Start the FastAPI Backend
```bash
cd system2-app/backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload --port 8000
```
> Backend runs at `http://localhost:8000` (Swagger UI at `/docs`).

### 3. Start the React Frontend
In a separate terminal window:
```bash
cd system2-app/frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
> Open your browser at `http://localhost:5173`.

---

## 🧪 Automated Testing

HeatScape includes an automated backend test suite covering all 9 core subsystems:

```bash
cd system2-app/backend
source .venv/bin/activate
python3 test_backend.py
```
*(All 9 integration suites pass with 100% success).*

---

## 📚 In-Depth Documentation

For detailed technical references, please consult our companion documentation:

* 📐 [**TECHNICAL_STACK_AND_SYSTEM_ARCHITECTURE.md**](./TECHNICAL_STACK_AND_SYSTEM_ARCHITECTURE.md) — Comprehensive technical dossier, sequence diagrams, API schemas, and component breakdown.
* 🔬 [**PROJECT_OVERVIEW_AND_DOCUMENTATION.md**](./PROJECT_OVERVIEW_AND_DOCUMENTATION.md) — Scientific grounding, normalization formulas, evaluator viva guide, and FAQs.

---

## 👥 Authors & Acknowledgments

* **Lead Developer**: Nivash ([@nivash-19](https://github.com/nivash-19))
* **Domain Data**: USGS Landsat Earth Observation, OpenStreetMap contributors, and Open-Meteo.
* **Municipal Guidelines**: Greater Chennai Corporation (GCC), Bureau of Energy Efficiency (BEE), and India Cooling Action Plan (ICAP).

---

<div align="center">
  <sub>Built for the Chennai Metropolitan Area Climate Resilience Initiative.</sub>
</div>