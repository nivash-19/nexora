# 🛰️ HeatScape (Nexora)
### *AI-Powered Urban Climate Resilience & Municipal Cooling Decision Support Platform*

[![Live Web Application](https://img.shields.io/badge/Live%20App-nexora--two--chi.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://nexora-two-chi.vercel.app)
[![Live FastAPI Backend](https://img.shields.io/badge/API%20Backend-heatscape--nexora.onrender.com-4f46e5?style=for-the-badge&logo=render&logoColor=white)](https://heatscape-nexora.onrender.com)
[![Interactive API Docs](https://img.shields.io/badge/Swagger%20Docs-OpenAPI%203.0-0284c7?style=for-the-badge&logo=fastapi&logoColor=white)](https://heatscape-nexora.onrender.com/docs)
[![Python Version](https://img.shields.io/badge/Python-3.10%20|%203.11-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React Version](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/GenAI-Google%20Gemini-8e75ff?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Telemetry](https://img.shields.io/badge/Live%20Telemetry-Open--Meteo-f59e0b?style=for-the-badge)](https://open-meteo.com/)

---

## 📑 Table of Contents
- [Executive Overview & Problem Statement](#-executive-overview--problem-statement)
- [Two-System Architectural Blueprint](#-two-system-architectural-blueprint)
- [System 1: Earth Observation & Hotspot Diagnostics](#-system-1-earth-observation--hotspot-diagnostics)
- [System 2: Decision Intelligence & Municipal Platform](#-system-2-decision-intelligence--municipal-platform)
- [The 6 Urban Microclimate Archetypes (Chennai)](#-the-6-urban-microclimate-archetypes-chennai)
- [Mathematical Framework & Diagnostic Equations](#-mathematical-framework--diagnostic-equations)
- [Standardized Municipal Interventions & Costs (Tier 1)](#-standardized-municipal-interventions--costs-tier-1)
- [Generative AI Cooling Architecture (Tier 2)](#-generative-ai-cooling-architecture-tier-2)
- [Greedy Knapsack Municipal Budget Optimizer](#-greedy-knapsack-municipal-budget-optimizer)
- [Core Features Walkthrough](#-core-features-walkthrough)
- [Technology Stack Breakdown](#-technology-stack-breakdown)
- [REST API Reference](#-rest-api-reference)
- [Quickstart & Local Installation](#-quickstart--local-installation)
- [Verification & Automated Test Suite](#-verification--automated-test-suite)
- [Production Cloud Deployment](#-production-cloud-deployment)
- [Repository Structure](#-repository-structure)
- [Ground-Truth Citations & Acknowledgments](#-ground-truth-citations--acknowledgments)

---

## 🌍 Executive Overview & Problem Statement

### The Urban Heat Crisis
Tropical coastal megacities like **Chennai, India** suffer from extreme **Urban Heat Island (UHI)** anomalies. Decades of unmitigated urban sprawl have replaced floodplains, agricultural marshes, and natural canopy with impervious bitumen, multistory concrete envelopes, and corrugated metal sheds. 

During peak summer cycles:
* **Severe Radiant Temperatures**: Surface temperatures consistently soar between **41°C and 48°C** across industrial corridors (Manali, Ambattur) and dense transit nodes (Koyambedu).
* **Vulnerable Population Exposure**: Over **300,000+** outdoor shift workers, wholesale market vendors, and public commuters endure acute, prolonged thermal stress.
* **The Municipal Bottleneck**: City climate responses remain **ad-hoc, generic, and unoptimized**. Municipalities plant saplings without diagnosing microclimate causes or apply reflective coatings without budget prioritization or spatial return-on-investment (ROI) analysis.

### The HeatScape (Nexora) Solution
HeatScape bridges the critical divide between **raw satellite Earth observation** and **actionable municipal capital expenditure (CapEx)**:

1. **Precision 250m × 250m Spatial Diagnosis**: Dissects urban cells down to 6.25-hectare resolution using Landsat 8/9 thermal infrared (TIRS) and multispectral vegetation (OLI) telemetry fused with OpenStreetMap vector morphology.
2. **Deterministic Tier 1 Interventions**: Prescribes standardized, costed, and legally defensible engineering blueprints with **localized microclimate justifications (💡)** explaining *why* a specific solution solves that particular neighborhood.
3. **Generative Tier 2 Concepts (Google Gemini)**: Synthesizes site-adapted architectural innovations strictly constrained by municipal cost ceilings.
4. **Greedy Knapsack Budget Optimizer**: Calculates the mathematically optimal allocation of public funds (e.g., ₹1 Lakh to ₹30+ Lakhs) to maximize city-wide Land Surface Temperature reduction (°C drop per rupee spent).
5. **Live Atmospheric & Solar Telemetry**: Dynamically synchronizes real-time solar irradiance ($W/m^2$), ambient temperature, and humidity from Open-Meteo with an in-memory caching engine.

---

## 🏗️ Two-System Architectural Blueprint

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   SYSTEM 1 — DATA INGESTION & HOTSPOT DIAGNOSIS ENGINE                   │
│                                                                                          │
│   [USGS Landsat 8/9 TIRS & OLI]                 [OpenStreetMap via OSMnx]                │
│       • Thermal Band 10 (LST)                       • Building Polygons & Heights        │
│       • NIR Band 5 & Red Band 4 (NDVI)              • Bitumen Arterial Highway Network   │
│                                                     • Coastal Waterbodies & Canals       │
│                           │                                    │                         │
│                           ▼                                    ▼                         │
│               ┌────────────────────────────────────────────────────┐                     │
│               │     250m x 250m Spatial Mesh (EPSG:32644 UTM)      │                     │
│               │     Metric Normalization (T_norm, V, I, W_norm)    │                     │
│               │     Composite Heat Score = 0.4T + 0.3V + 0.2I + 0.1W │                   │
│               │     Dominant Root-Cause Diagnostic Classifier      │                     │
│               └────────────────────────────────────────────────────┘                     │
│                                           │                                              │
│                                           ▼                                              │
│                              [output/hotspots.json]                                      │
└───────────────────────────────────────────┬──────────────────────────────────────────────┘
                                            │
                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                  SYSTEM 2 — DECISION INTELLIGENCE & OPTIMIZATION PLATFORM                │
│                                                                                          │
│   ⚙️ FastAPI Backend (Port 8000 / Render Cloud)                                          │
│   ├── GET  /api/hotspots              -> 20 Hotspots enriched with Tier 1 & live LST     │
│   ├── GET  /api/grid/{id}             -> Granular 250m Cell Microclimate Inspection      │
│   ├── GET  /api/tier2/{grid_id}       -> Gemini AI Contextual Architectural Ideas        │
│   ├── POST /api/optimize-budget       -> Greedy Knapsack ROI Municipal Allocation        │
│   ├── POST /api/chat                  -> Nexora Cooling Pilot RAG Conversational Agent   │
│   ├── GET  /api/telemetry/live        -> Real-Time Open-Meteo Solar & Weather Engine     │
│   └── GET  /api/health                -> Pipeline Diagnostics & System Telemetry         │
│                                                                                          │
│   💻 React 18 + Vite Frontend (Port 5173 / Vercel Cloud)                                 │
│   ├── 3-Mode Telemetry Layer Switcher (Baseline Diff, Thermal TIRS, Canopy NDVI)         │
│   ├── Interactive Leaflet Cartography with Auto Bounding-Box Reframing (`fitBounds`)     │
│   ├── Dynamic Sector StatsBar (Native Canopy Capacity, Max Cooling Potential)            │
│   ├── Tier 1 Area Justification Card with Dedicated Lightbulb (💡) Explainer             │
│   ├── AI Priority Attention Triage Advisor Modal                                         │
│   ├── Dual Budget Optimizer Controller (Direct Numeric Input + Range Slider + Presets)   │
│   └── Adopted GCC Ward Action Plan with Persistent Storage & Floating Counter Dock       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛰️ System 1: Earth Observation & Hotspot Diagnostics

System 1 (`system1-data-diagnosis/`) processes remote sensing data and physical urban morphology across Chennai:

1. **Land Surface Temperature (LST)**: Derived from **USGS Landsat 8/9 Collection 2 Level-2 TIRS Band 10** ($10.8\,\mu\text{m}$) using split-window radiometric calibration, atmospheric correction, and fractional vegetation emissivity estimation ($P_v$).
2. **Normalized Difference Vegetation Index (NDVI)**: Computed from Landsat-9 OLI-2 Near-Infrared (Band 5) and Red (Band 4):
   $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
3. **Impervious Surface & Water Morphology**: Extracted via `OSMnx` querying OpenStreetMap building footprints, high-albedo/asphalt surfaces, and water buffers, projected into **WGS 84 / UTM Zone 44N (EPSG:32644)**.
4. **Vector Tessellation**: Divides the territory into a uniform $250\text{m} \times 250\text{m}$ grid (~6.25 hectares), aggregating metrics and exporting the ranked diagnostic dataset to `system1-data-diagnosis/output/hotspots.json`.

---

## 💡 System 2: Decision Intelligence & Municipal Platform

System 2 (`system2-app/`) is an interactive web platform serving city planners, municipal commissioners, and climate researchers:

* **Live Telemetry Synchronization**: Queries Open-Meteo for real-time solar irradiance ($W/m^2$), 2m ambient temperature, apparent heat index, humidity, and wind speed. Dynamically adjusts cell-level LST based on solar flux and surface albedo.
* **Full-UI Palette Transformation**: Switching between telemetry layers (Baseline Diff, Thermal Infrared, or NDVI) shifts the visual palette across map markers, radiant halos, borders, header pills, stats cards, and legends.
* **GCC Ward Action Plan Persistence**: Municipal teams can adopt priority intervention plans with one click. Selections persist in browser `localStorage` and display on a floating dock showing committed public funds.
* **Nexora Cooling Pilot (RAG Engine)**: An AI assistant grounded in Chennai's microclimate thermodynamics, ready to answer questions regarding municipal cost allocations, intervention physics, and ward justifications.

---

## 🏙️ The 6 Urban Microclimate Archetypes (Chennai)

Rather than assessing uniform residential wards, HeatScape targets **6 distinct urban archetypes** covering Chennai's land-use spectrum:

| Zone | Urban Archetype | Baseline LST | Dominant Heat Stressor | Target Beneficiaries & Ground Reality |
| :--- | :--- | :---: | :--- | :--- |
| **Manali** | **Petrochemical & Heavy Industrial Belt** | **41.5°C – 43.5°C** *(Highest)* | Extreme Temperature / Low Vegetation | Unshaded corrugated sheet metal manufacturing sheds, bitumen tanker parking, zero canopy (<8%). Direct relief for 140,000+ refinery workers. |
| **Ambattur** | **MSME Manufacturing Estate** | **39.2°C – 41.8°C** | High Impervious / Extreme Heat | 1,500+ factory sheds with dark tin/asbestos roofs re-radiating heat into shop floors. Affects 100,000+ machinists. |
| **Koyambedu** | **Wholesale Market & Mega Transit Hub** | **38.6°C – 40.9°C** | High Impervious / Low Canopy | Asia's largest perishable market with continuous asphalt loading bays and CMBT bus terminal. Prevents food spoilage; protects 50,000+ vendors. |
| **Teynampet** | **High-Density Corporate Street Canyon** | **36.8°C – 37.5°C** | High Impervious / Thermal Inertia | Anna Salai multistory glass/concrete corridor trapping radiant heat in pedestrian walkways and transit stops. |
| **Perungudi** | **IT Expressway & Wetland Boundary** | **35.4°C – 39.7°C** | Distant from Water / Low Canopy | OMR tech expressway where rapid concrete expansion severed natural cooling moisture from the Pallikaranai marshland. |
| **Anna Nagar** | **Planned Residential Grid (Control Baseline)** | **33.9°C – 34.5°C** | Localized Canopy Gaps | Planned residential avenues and public parks serving as the empirical scientific baseline to measure urban heat island deviation. |

---

## 📐 Mathematical Framework & Diagnostic Equations

### 1. Metric Normalization (0.0 to 1.0 Scale)
Every $250\text{m} \times 250\text{m}$ cell has its raw physical telemetry normalized:

* **Surface Thermal Anomaly ($T_{norm}$)**:
  $$T_{norm} = \text{clip}\left(\frac{\text{LST} - \text{LST}_{min}}{\text{LST}_{max} - \text{LST}_{min}}, 0.0, 1.0\right)$$
* **Canopy Vegetation Deficit ($V_{norm}$)**:
  $$V_{norm} = \text{clip}(1.0 - \text{NDVI}, 0.0, 1.0)$$
* **Impervious Surface Ratio ($I_{norm}$)**:
  $$I_{norm} = \text{clip}\left(\frac{\text{impervious\_pct}}{100.0}, 0.0, 1.0\right)$$
* **Distance from Water Buffer ($W_{norm}$)**:
  $$W_{norm} = \text{clip}\left(\frac{\text{dist\_to\_water} - \text{dist}_{min}}{\text{dist}_{max} - \text{dist}_{min}}, 0.0, 1.0\right)$$

### 2. Composite Heat Score
$$\text{Heat Score} = (0.40 \times T_{norm}) + (0.30 \times V_{norm}) + (0.20 \times I_{norm}) + (0.10 \times W_{norm})$$

* **Weight Distribution Rationale**: Surface temperature ($40\%$) represents direct acute thermal exposure. Vegetation deficit ($30\%$) and impervious fraction ($20\%$) denote the physically modifiable urban fabric. Proximity to water ($10\%$) accounts for natural coastal microclimate buffering.

### 3. Dominant Root-Cause Classifier
The system identifies the dominant driver by evaluating the maximum weighted term:
$$\text{Dominant Cause} = \arg\max \{ 0.4 T_{norm},\; 0.3 V_{norm},\; 0.2 I_{norm},\; 0.1 W_{norm} \}$$

* $\max = 0.4 T_{norm} \rightarrow$ **`extreme_temperature`** (Prescription: Extensive Living Green Roofs / Living Facades)
* $\max = 0.3 V_{norm} \rightarrow$ **`low_vegetation`** (Prescription: Native High-Canopy Tree Planting)
* $\max = 0.2 I_{norm} \rightarrow$ **`high_impervious_surface`** (Prescription: High-Albedo Solar Reflective Cool Roofs)
* $\max = 0.1 W_{norm} \rightarrow$ **`far_from_water`** (Prescription: Solar Micro-Misting Pavilions & Bioswales)

### 4. Knapsack ROI Priority Scoring
$$\text{ROI Priority Score} = \frac{\text{Heat Score} \times \Delta T_{\text{cooling impact}} \times 100{,}000}{\text{Implementation Cost (INR)}}$$

---

## 🏛️ Standardized Municipal Interventions & Costs (Tier 1)

All Tier 1 interventions are grounded in official schedules of rates and standards from the **Greater Chennai Corporation (GCC)**, **Bureau of Energy Efficiency (BEE)**, **India Cooling Action Plan (ICAP)**, and **C40 Cities Guidelines**:

| Intervention Category | Unit Cost (INR) | Expected Cooling ($\Delta T$) | Standardized Application per Hotspot Cell | Typical Cost / Cell |
| :--- | :--- | :---: | :--- | :--- |
| **High-Albedo Cool Roofs & Pavements** | ₹120 – ₹180 / $m^2$ | **$-2.0^\circ\text{C}$ to $-3.5^\circ\text{C}$** | $500\,m^2$ elastomeric SRI > 104 solar-reflective coating | **₹75,000** |
| **Native High-Canopy Tree Planting** | ₹1,800 – ₹2,200 / tree | **$-1.8^\circ\text{C}$ to $-2.5^\circ\text{C}$** | 50 native saplings (Neem, Pungai, Indian Cork) + 2-yr maintenance | **₹1,00,000** |
| **Extensive Green Roofs & Living Walls** | ₹1,800 – ₹3,000 / $m^2$ | **$-2.5^\circ\text{C}$ to $-4.0^\circ\text{C}$** | $100\,m^2$ engineered sedum/drought-tolerant vegetative mats | **₹2,40,000** |
| **Solar Micro-Misting Corridors** | ₹50,000 – ₹80,000 / unit | **$-1.5^\circ\text{C}$ to $-2.2^\circ\text{C}$** | 1 solar-powered high-pressure atomizing misting pavilion | **₹65,000** |

### 💡 Dedicated Feature: Localized Area Justification Cards
Each Tier 1 intervention features an interactive **"Why it solves {Zone}"** card with a glowing lightbulb (💡) icon, breaking down:
- **Headline**: Targeted urban hazard (e.g., *"Neutralizes Petrochemical & Industrial Thermal Inertia"*).
- **Localized Problem**: Microclimate conditions specific to that zone.
- **Scientific Mechanism**: Thermodynamics of heat mitigation (e.g., how vegetative shading cuts conductive heat through sheet metal by 65%).
- **Countered Metric**: Key metric addressed (e.g., $T_{norm} > 0.94$).
- **Primary Beneficiaries**: Key populations protected (e.g., refinery shift workers, wholesale market porters).

---

## 🤖 Generative AI Cooling Architecture (Tier 2)

While Tier 1 supplies standardized municipal blueprints, **Tier 2 uses Google Gemini 1.5/2.0** to generate site-adapted, creative interventions:

* **Strict Cost Bounds**: Every generated idea is mapped directly to a Tier 1 cost unit (e.g., ₹75,000 for cool roofs, ₹1,00,000 for canopy trees), ensuring all suggestions remain within municipal spending thresholds.
* **Microclimate Grounding**: Gemini is provided with the cell's coordinates, zone name, normalized indicators ($T_{norm}, V_{norm}, I_{norm}, W_{norm}$), and diagnosed root cause.
* **Resilient Fallback**: If an external API key is unavailable or rate limits are reached, the system falls back seamlessly to a curated, localized offline repository of engineering concepts.

---

## 💰 Greedy Knapsack Municipal Budget Optimizer

Given a municipal budget limit (e.g., ₹5,00,000, ₹10,00,000), the **Budget Optimizer** solves the 0/1 Greedy Knapsack problem to determine the most cost-effective hotspot interventions:

1. **Ranking**: Candidate hotspots are ranked descending by their `ROI Priority Score`.
2. **Allocation**: Interventions are funded in order of ROI until the budget is exhausted.
3. **Summary Outputs**: Returns total allocated capital, remaining reserve, number of treated cells, and projected city-wide average and maximum temperature reduction ($\Delta T$).
4. **Dual User Controls**:
   - **Direct Numeric Input Field**: Type any exact budget (e.g., `₹4,50,000` or `₹12,50,000`).
   - **Interactive Range Slider**: Smooth slider spanning ₹50,000 to ₹30,00,000.
   - **Quick Presets**: 1-click buttons for ₹1L, ₹2.5L, ₹5L, ₹7.5L, ₹10L, ₹15L, ₹20L, ₹30L.
   - **Real-Time Calculation**: Live recalculation debounced as you type or slide.

---

## ⚡ Core Features Walkthrough

### 1. Dynamic 3-Mode Telemetry Layer Switcher
- **Δ DIFF: BASELINE vs TARGET** *(Emerald / Cyan)*: Highlights intervention categories and potential cooling impact.
- **THERMAL INFRARED (TIRS)** *(Crimson / Thermal Orange)*: Displays raw surface temperatures ($34^\circ\text{C}-44^\circ\text{C}$) from Landsat-9 Band 10 ($10.8\,\mu\text{m}$).
- **CANOPY NDVI** *(Lime / Forest Green)*: Shows vegetative chlorophyll levels ($0.12 - 0.78$) and canopy deficits from Landsat-9 OLI-2.
- *Web-wide synchronization*: Marker colors, radiant halos, stats cards, borders, and legends shift together in real time.

### 2. Interactive Map with Dynamic Bounding-Box Reframing
- Powered by Leaflet and React-Leaflet with an Esri dark vector base map.
- Selecting any sector automatically zooms and centers using `map.fitBounds()` with smooth transitions.

### 3. Sector-Specific Dynamic StatsBar
- Dynamically computes **Native Canopy Capacity** (e.g., Manali: 377 trees, Koyambedu: 373 trees) from $V_{norm}$.
- Calculates **Maximum Cooling Potential** (up to $-4.0^\circ\text{C}$) from verified Tier 1 impacts.

### 4. AI Priority Attention Triage Advisor Modal
- Ranks zones by an **Emergency Attention Score** (Manali: 98, Koyambedu: 91, Ambattur: 87).
- Displays socio-economic justifications, worker exposure metrics, expected LST drops, and avoided losses.
- Includes a 1-click **"Adopt All Priority Sites"** button.

### 5. Persistent GCC Ward Action Plan Dock
- Persists user-selected interventions in browser `localStorage`.
- A floating dock on the bottom-left tracks adopted sites and committed public funds (₹ Lakhs).

### 6. Nexora Cooling Pilot (Conversational Assistant)
- Answers questions about urban heat dynamics, municipal budgets, and intervention trade-offs using local knowledge with Gemini GenAI.

---

## 🛠️ Technology Stack Breakdown

### Frontend
| Component / Library | Version | Role in Architecture |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Reactive state management, component tree, and modal controllers |
| **Vite** | `5.4.11` | Build tooling, development server with sub-second HMR, and Rollup bundling |
| **Leaflet & React-Leaflet** | `1.9.4` / `4.2.1` | High-performance interactive cartography, circle markers, and dynamic halos |
| **Lucide-React** | `0.468.0` | Iconography for thermal sensors, vegetation, lightbulbs, and navigation |
| **Axios** | `1.7.9` | Asynchronous REST client with automatic fallback handling |
| **Vanilla CSS Design System** | Modern CSS3 | Dark glassmorphism, responsive grid/flexbox, radial glows, zero framework bloat |

### Backend
| Component / Library | Version | Role in Architecture |
| :--- | :--- | :--- |
| **FastAPI** | `0.110.0+` | High-performance ASGI framework with automatic OpenAPI Swagger generation |
| **Python** | `3.10+ / 3.11` | Scientific processing, knapsack optimization, and business logic |
| **Uvicorn** | `0.28.0+` | Production-grade ASGI web server |
| **Pydantic** | `2.0.0+` | Strict request/response validation schemas |
| **google-generativeai** | `0.8.0+` | Official SDK for Google Gemini 1.5/2.0 generative cooling concepts |
| **Open-Meteo REST Client** | Standard `urllib` | Real-time solar irradiance and meteorological telemetry with in-memory cache |
| **HTTPX** | `0.27.0+` | Asynchronous test client for automated backend verification |

---

## 📡 REST API Reference

The backend exposes the following REST endpoints on `http://localhost:8000` (or `https://heatscape-nexora.onrender.com` in production):

| Method | Endpoint | Description | Key Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Service root and active endpoints manifest | None |
| `GET` | `/api/health` | Health check, loaded hotspot count, and telemetry status | None |
| `GET` | `/api/telemetry/live` | Real-time solar irradiance and weather metrics for Chennai | `refresh=true` (forces live re-fetch) |
| `GET` | `/api/hotspots` | Returns all 20 hotspots enriched with Tier 1 and live LST | `zone=Manali`, `refresh=true` |
| `GET` | `/api/grid/{grid_id}` | Detailed microclimate diagnostic for a specific 250m cell | `grid_id` (e.g., `cell_manali_001`) |
| `GET` | `/api/tier2/{grid_id}` | Triggers Gemini AI to generate site-adapted cooling concepts | `grid_id` (e.g., `cell_koyambedu_001`) |
| `POST` | `/api/optimize-budget` | Runs greedy knapsack optimization for a given budget | `{ "budget": 500000, "zone": "Manali" }` |
| `POST` | `/api/chat` | Conversational endpoint for the Nexora Cooling Pilot chatbot | `{ "message": "...", "history": [] }` |

Interactive Swagger documentation is available at [`/docs`](https://heatscape-nexora.onrender.com/docs).

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- **Python 3.10+** or **3.11** installed on your system.
- **Node.js 18+** and **npm** installed.
- *(Optional)* A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/) for live Tier 2 generation (offline fallback included).

### 1. Clone the Repository
```bash
git clone https://github.com/nivash-19/nexora.git
cd nexora
```

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd system2-app/backend

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your Gemini API key in a .env file
echo "GEMINI_API_KEY=your_actual_gemini_api_key_here" > .env

# Launch the FastAPI server
uvicorn main:app --reload --port 8000
```
The backend will be running at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup (React + Vite)
Open a new terminal window:
```bash
# Navigate to frontend directory
cd system2-app/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Verification & Automated Test Suite

HeatScape includes a backend integration test suite verifying all 9 core subsystems:

```bash
cd system2-app/backend
source .venv/bin/activate
python3 test_backend.py
```

Expected output:
```text
--- RUNNING BACKEND TESTS ---
PASS: Root endpoint
PASS: Health check (20 hotspots loaded, using_real_system1_data=True)
PASS: /api/telemetry/live returning 28.6°C, 0.0 W/m² (Clear Sky)
PASS: /api/hotspots?refresh=true dynamically attached live LST and telemetry
PASS: /api/hotspots verified for 20 items with Tier 1 and area justification
PASS: /api/hotspots?zone=Manali returned 3 hotspots
PASS: /api/grid/cell_manali_001 full detail verified
PASS: /api/grid/404 handled gracefully
PASS: /api/tier2/cell_manali_001 returned 2 AI ideas mapped to Tier 1 cost
PASS: /api/optimize-budget allocated INR 480,000.0 across 2 hotspots
PASS: /api/chat answered query successfully (source: HeatScape Verified Knowledge Engine)

>>> ALL BACKEND TESTS PASSED! <<<
```

To verify the production frontend build:
```bash
cd system2-app/frontend
npm run build
```

---

## ☁️ Production Cloud Deployment

The repository is configured for automated CI/CD deployment:

* **Frontend (Vercel)**:
  - Configuration defined in [`vercel.json`](file:///Users/nivash/heatscape-nexora/vercel.json).
  - Automatically builds via `npm --prefix system2-app/frontend run build` and serves SPA routes from `system2-app/frontend/dist`.
  - Production URL: [https://nexora-two-chi.vercel.app](https://nexora-two-chi.vercel.app)
* **Backend (Render)**:
  - Blueprint defined in [`render.yaml`](file:///Users/nivash/heatscape-nexora/render.yaml).
  - Deploys Python 3.11 with `uvicorn main:app --host 0.0.0.0 --port $PORT`.
  - Production URL: [https://heatscape-nexora.onrender.com](https://heatscape-nexora.onrender.com)

---

## 📂 Repository Structure

```
heatscape-nexora/
├── README.md                                # Main Project Documentation & Guide (this file)
├── PROJECT_OVERVIEW_AND_DOCUMENTATION.md    # Detailed scientific dossier & evaluator Q&A guide
├── TECHNICAL_STACK_AND_SYSTEM_ARCHITECTURE.md # Full technical specification and architecture diagrams
├── render.yaml                              # Render Cloud deployment blueprint for FastAPI backend
├── vercel.json                              # Vercel deployment configuration for React SPA
├── package.json                             # Root build orchestration script
│
├── system1-data-diagnosis/                  # System 1: Satellite Processing & GIS Diagnosis
│   ├── pull_data.py                         # OpenStreetMap vector highway & building ingestion
│   ├── pull_lst_ndvi.py                     # Landsat-9 TIRS & OLI radiometric calculation
│   ├── score_hotspots.py                    # 250m mesh normalizer & dominant cause classifier
│   └── output/
│       └── hotspots.json                    # Processed 20 Chennai hotspots dataset
│
└── system2-app/                             # System 2: Decision Intelligence Web Platform
    ├── backend/                             # FastAPI Backend Service
    │   ├── main.py                          # ASGI server, CORS middleware, and API endpoints
    │   ├── telemetry.py                     # Open-Meteo live solar & atmospheric telemetry engine
    │   ├── tier1.py                         # Standardized municipal solutions & area justifications
    │   ├── tier2.py                         # Gemini 1.5/2.0 generative AI cooling engine
    │   ├── optimizer.py                     # Greedy knapsack ROI optimizer & AI triage matrix
    │   ├── chatbot.py                       # Nexora Cooling Pilot conversational RAG agent
    │   ├── data_loader.py                   # GeoJSON dataset ingestion & fallback handler
    │   ├── test_backend.py                  # Integration test suite
    │   ├── requirements.txt                 # Backend Python package dependencies
    │   └── data/                            # Localized mock and benchmark datasets
    │
    └── frontend/                            # React 18 + Vite Web Application
        ├── index.html                       # HTML5 entry point with metadata
        ├── package.json                     # Frontend npm dependencies
        ├── vite.config.js                   # Vite bundler configuration
        └── src/
            ├── App.jsx                      # Primary state orchestrator & ambient lighting
            ├── main.jsx                     # React DOM entry point
            ├── index.css                    # Glassmorphism design tokens & responsive CSS
            ├── config/
            │   └── api.js                   # API base URLs and endpoint routes
            └── components/
                ├── Header.jsx               # Navigation bar, live telemetry pill, and modals
                ├── HeatMap.jsx              # Leaflet map, 3-mode layer switcher, bounding box
                ├── StatsBar.jsx             # Dynamic sector canopy capacity & cooling metrics
                ├── Legend.jsx               # Dynamic 3-mode color spectrum legend
                ├── DetailPanel.jsx          # Cell-level microclimate inspector & Tier 1/2 cards
                ├── BudgetModal.jsx          # Dual-input greedy knapsack budget optimizer
                ├── AIBudgetAdvisorModal.jsx # Priority triage ranking, LST drops & adoption
                ├── AdoptedPlanModal.jsx     # GCC Ward Action Plan dossier inspection
                └── ChatbotModal.jsx         # Nexora Cooling Pilot conversational assistant
```

---

## 🔬 Ground-Truth Citations & Acknowledgments

* **Satellite Telemetry**: USGS / NASA Landsat 8 & 9 Collection 2 Level-2 Thermal Infrared Sensor (TIRS) and Operational Land Imager (OLI).
* **Urban Spatial Morphology**: OpenStreetMap contributors via `OSMnx` and `Shapely`.
* **Meteorological Telemetry**: [Open-Meteo Weather API](https://open-meteo.com/) for real-time solar irradiance ($DNI$) and surface atmospheric metrics.
* **Municipal Implementation Benchmarks**:
  * Greater Chennai Corporation (GCC) Parks and Social Forestry Schedule of Rates (2022–2024).
  * India Cooling Action Plan (ICAP), Ministry of Environment, Forest and Climate Change (MoEFCC).
  * Bureau of Energy Efficiency (BEE) Energy Conservation Building Code (ECBC) Cool Roof Guidelines.
  * C40 Cities Climate Leadership Group — Urban Cooling Mitigation Framework.
* **Generative AI Engine**: Google DeepMind / Google AI Studio (`gemini-1.5-pro` / `gemini-1.5-flash`).

---

<div align="center">
  <sub>Developed for the Greater Chennai Metropolitan Area & Urban Climate Resilience Decision Intelligence.</sub>
</div>