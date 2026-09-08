# HeatScape (Nexora) — Complete Project Documentation & Technical Dossier

> **Project Name**: HeatScape (Nexora)  
> **Domain**: Urban Climate Resilience, Remote Sensing, AI-Powered Decision Support  
> **Focus City**: Chennai Metropolitan Area, Tamil Nadu, India  
> **Primary Objectives**: High-resolution urban heat island (UHI) hotspot diagnosis, standardized Tier 1 municipal cooling interventions, generative AI (Tier 2) adaptive cooling strategies, and knapsack budget optimization.  
> **Live Web Application**: [https://nexora-two-chi.vercel.app](https://nexora-two-chi.vercel.app)  
> **Live FastAPI Backend**: [https://heatscape-nexora.onrender.com](https://heatscape-nexora.onrender.com)  
> **GitHub Repository**: [https://github.com/nivash-19/nexora](https://github.com/nivash-19/nexora)

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Two-System Architectural Blueprint](#2-two-system-architectural-blueprint)
3. [Data Sources & Ground-Truth Benchmarking](#3-data-sources--ground-truth-benchmarking)
4. [Zonal Selection Rationale (The 6 Urban Typology Archetypes)](#4-zonal-selection-rationale-the-6-urban-typology-archetypes)
5. [Mathematical Models & Algorithmic Formulations](#5-mathematical-models--algorithmic-formulations)
6. [Tier 1 Verified Municipal Solutions & Area Justifications](#6-tier-1-verified-municipal-solutions--area-justifications)
7. [Tier 2 Generative AI Concept Engine (Gemini)](#7-tier-2-generative-ai-concept-engine-gemini)
8. [Municipal Budget Optimizer (Greedy Knapsack ROI)](#8-municipal-budget-optimizer-greedy-knapsack-roi)
9. [Frontend & Backend Technical Stack](#9-frontend--backend-technical-stack)
10. [Frequently Asked Questions & Evaluator Viva Guide](#10-frequently-asked-questions--evaluator-viva-guide)

---

## 1. Executive Summary & Problem Statement

### The Problem
Tropical coastal megacities like Chennai suffer from acute **Urban Heat Island (UHI)** effects. Rapid urbanization has replaced coastal wetlands, agricultural floodplains, and dense forest canopies with dark bitumen asphalt, corrugated metal roofing, and multistory concrete envelopes. During summer heatwaves:
* Surface temperatures routinely exceed **41°C–48°C** in industrial and commercial corridors.
* Vulnerable populations—street vendors at Koyambedu market, industrial shift workers in Manali/Ambattur, and transit commuters on Anna Salai—experience severe thermal stress.
* Existing municipal cooling responses are often **ad-hoc, generic, and unoptimized**: cities plant random saplings without analyzing microclimate causes, or apply reflective coatings without budget prioritization.

### The Solution: HeatScape
HeatScape bridges the gap between **raw satellite earth observation** and **actionable municipal capital allocation**:
1. **Diagnoses Root Causes**: Dissects each $250\text{m} \times 250\text{m}$ urban cell to determine whether heat is driven by high surface albedo absorption, vegetative deficit, extreme radiant surface temperature, or distance from water bodies.
2. **Standardized Tier 1 Interventions**: Prescribes research-backed, costed, and defensible interventions with localized area justifications explaining *why* that specific solution solves that particular neighborhood's crisis.
3. **Generative Tier 2 Concepts**: Synthesizes localized, creative cooling architectures using Google Gemini AI, bounded by municipal budget constraints.
4. **Budget Optimizer**: Employs greedy knapsack optimization to calculate the mathematically optimal allocation of limited municipal funds (e.g., ₹5 Lakhs, ₹10 Lakhs) to achieve maximum cooling relief (°C drop per rupee).

---

## 2. Two-System Architectural Blueprint

HeatScape is built upon a modular two-tier architecture:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│             SYSTEM 1 — DATA INGESTION & HOTSPOT DIAGNOSIS ENGINE               │
│                                                                                │
│  [Landsat 8/9 TIRS & OLI]           [OpenStreetMap via OSMnx]                  │
│     • LST (Surface Temp)                • Building footprints                  │
│     • NDVI (Vegetation Index)           • Bitumen road networks                │
│                                         • Water bodies & canals                │
│                         │                              │                       │
│                         ▼                              ▼                       │
│             ┌───────────────────────────────────────────────┐                  │
│             │  250m x 250m Spatial Mesh (EPSG:32644 UTM)   │                  │
│             │  Metric Normalization (T_norm, V, I, W_norm) │                  │
│             │  Composite Heat Score = 0.4T+0.3V+0.2I+0.1W   │                  │
│             │  Dominant Cause Diagnosis Pipeline           │                  │
│             └───────────────────────────────────────────────┘                  │
│                                         │                                      │
│                                         ▼                                      │
│                             [output/hotspots.json]                             │
└─────────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│            SYSTEM 2 — DECISION SUPPORT & OPTIMIZATION PLATFORM                 │
│                                                                                │
│    FastAPI Backend (Port 8000 / Render Cloud)                                  │
│    ├── GET  /api/hotspots              -> Enriched 20 Hotspots with Tier 1     │
│    ├── GET  /api/grid/{id}             -> 250m Cell Microclimate Detail        │
│    ├── GET  /api/tier2/{cell_id}       -> Gemini AI Contextual Ideas           │
│    ├── POST /api/optimize-budget       -> Knapsack ROI Municipal Allocation    │
│    └── GET  /api/health                -> Data pipeline & system telemetry    │
│                                                                                │
│    React + Vite + Leaflet Frontend (Vercel Cloud)                              │
│    ├── Esri High-Res Satellite Canopy & Dark Canvas (Zero Watermarks)          │
│    ├── Optimistic Blueprint Mode (Cooled vs Baseline Heat Island)             │
│    ├── Dynamic City StatsBar (Hotspots, Max Temp, Cooling Potential)           │
│    ├── Tier 1 Area Justification Card with Dedicated Lightbulb Icon (💡)       │
│    └── Dual Budget Optimizer Controller (Numeric Text Input + Range Slider)    │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Sources & Ground-Truth Benchmarking

All costs, temperature impacts, and spatial metrics in HeatScape are grounded in verifiable data:

### A. Satellite Earth Observation & Spatial Vectors
* **Land Surface Temperature (LST)**: Derived from **USGS Landsat 8 & 9 Collection 2 Level-2 Thermal Infrared Sensor (TIRS)** Band 10 using split-window atmospheric correction algorithms.
* **Normalized Difference Vegetation Index (NDVI)**: Computed from Landsat Near-Infrared (NIR, Band 5) and Red (Band 4): $\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$.
* **Impervious Surface & Water Bodies**: Extracted using **OpenStreetMap (OSM)** building polygons, highways, and water bodies via the Python `OSMnx` library, reprojected into Chennai's local coordinate system: **WGS 84 / UTM Zone 44N (EPSG:32644)**.

### B. Standardized Implementation Unit Costs (INR)
* **Native High-Canopy Tree Planting (₹1,800 – ₹2,200 per tree)**:
  * *Source*: Greater Chennai Corporation (GCC) Parks & Social Forestry Department Schedule of Rates (2022–2024).
  * *Inclusions*: Native high-canopy saplings (Neem / *Azadirachta indica*, Pungai / *Millettia pinnata*, Indian Cork Tree / *Millingtonia hortensis*), metal tree guard, organic soil preparation, and 2-year watering/maintenance contract.
* **High-Albedo Cool Roof Coatings (₹120 – ₹180 per $m^2$)**:
  * *Source*: India Cooling Action Plan (ICAP), Bureau of Energy Efficiency (BEE) Cool Roof Guidelines, and Telangana Municipal Cool Roof Policy tenders.
  * *Inclusions*: High Solar Reflectance Index (SRI > 100) elastomeric solar-reflective primer and topcoat applied on flat RCC or industrial metal roofing.
* **Extensive Living Green Roofs (₹1,800 – ₹3,000 per $m^2$)**:
  * *Source*: The Energy and Resources Institute (TERI) Urban Heat Mitigation Framework & C40 Cities Green Infrastructure Benchmarks.
  * *Inclusions*: Lightweight sedum/drought-tolerant vegetative mats, root barrier membrane, drainage filtration layer, and growing substrate engineered for existing RCC slabs.
* **Solar Micro-Misting Pavilions (₹50,000 – ₹80,000 per unit)**:
  * *Source*: Ahmedabad Heat Action Plan (HAP) Evaporative Cooling Pilot & Singapore Urban Misting Guidelines.
  * *Inclusions*: Solar-powered ultra-fine high-pressure atomizing misting nozzles installed along transit corridors and outdoor pedestrian hubs.

### C. Temperature Reduction Impact ($\Delta T$)
* **Cool Roofs**: $-2.0^\circ\text{C}$ to $-3.5^\circ\text{C}$ surface temperature drop ($-1.2^\circ\text{C}$ ambient air).
* **Green Roofs & Living Walls**: $-2.5^\circ\text{C}$ to $-4.0^\circ\text{C}$ microclimate drop.
* **Native Canopy Trees**: $-1.8^\circ\text{C}$ to $-2.5^\circ\text{C}$ LST drop via vegetative shade and evapotranspiration (~350 liters of water vapor/day per tree).
* **Misting Corridors**: $-1.5^\circ\text{C}$ to $-2.2^\circ\text{C}$ immediate pedestrian corridor relief.

---

## 4. Zonal Selection Rationale (The 6 Urban Typology Archetypes)

Chennai has 15 municipal administrative zones. Rather than analyzing repetitive residential sectors, HeatScape targeted **6 representative urban typologies** covering Chennai's complete microclimatic and land-use spectrum:

| Zone | Primary Urban Archetype | Baseline LST | Dominant Heat Stressor | Ground Reality & Target Beneficiaries |
| :--- | :--- | :---: | :--- | :--- |
| **Manali** | **Petrochemical & Heavy Industrial Belt** | **41.5°C** (Highest) | Extreme Temperature / Low Vegetation | Unshaded corrugated sheet metal manufacturing sheds, bitumen tanker parking, zero canopy (<8%). Direct impact on refinery technicians and shift workers. |
| **Ambattur** | **MSME Manufacturing Estate** | **39.2°C** | High Impervious / Extreme Temperature | 1,500+ factory sheds with dark tin/asbestos roofs that conduct solar heat into the shop floor. Direct impact on 100,000+ machinists and fabrication workers. |
| **Koyambedu** | **Wholesale Market & Mega Transit Hub** | **38.6°C** | High Impervious / Low Vegetation | Asia's largest perishable market with continuous bitumen asphalt loading bays and CMBT bus stands. Direct impact on 50,000+ daily street vendors and porters. |
| **Teynampet** | **High-Density Corporate Street Canyon** | **36.8°C** | High Impervious / Extreme Temperature | Anna Salai multistory corridor where glass and concrete facades re-radiate intense solar heat into pedestrian walkways and transit stops. |
| **Perungudi** | **IT Corridor & Wetland Boundary** | **35.4°C** | Far from Water / Low Vegetation | OMR tech expressway where rapid concrete expansion cut off the natural cooling moisture of the adjacent Pallikaranai marshland. Direct impact on IT workforce and commuters. |
| **Anna Nagar** | **Planned Residential Grid (Control Baseline)** | **33.9°C** | Canopy Gaps / Extreme Surface Temp | Planned residential grid with wide avenues and parks, serving as the scientific comparison baseline to measure heat deviations. |

---

## 5. Mathematical Models & Algorithmic Formulations

### A. Metric Normalization (0.0 to 1.0 Scale)
For every $250\text{m} \times 250\text{m}$ cell, raw environmental signals are normalized:

1. **Surface Heat Index ($T_{norm}$)**:
   $$T_{norm} = \text{clip}\left(\frac{\text{LST} - \text{LST}_{min}}{\text{LST}_{max} - \text{LST}_{min}}, 0.0, 1.0\right)$$
   *(Higher surface temperature $\rightarrow$ higher vulnerability)*

2. **Vegetation Deficit ($V_{norm}$)**:
   $$V_{norm} = \text{clip}(1.0 - \text{NDVI}, 0.0, 1.0)$$
   *(Lower green cover $\rightarrow$ higher vulnerability)*

3. **Impervious Surface Ratio ($I_{norm}$)**:
   $$I_{norm} = \text{clip}\left(\frac{\text{impervious\_pct}}{100.0}, 0.0, 1.0\right)$$
   *(More concrete and asphalt $\rightarrow$ higher heat storage)*

4. **Distance from Water Buffer ($W_{norm}$)**:
   $$W_{norm} = \text{clip}\left(\frac{\text{dist\_to\_water} - \text{dist}_{min}}{\text{dist}_{max} - \text{dist}_{min}}, 0.0, 1.0\right)$$
   *(Further from lakes/rivers $\rightarrow$ lower natural evaporative cooling)*

### B. Composite Heat Score
$$\text{Heat Score} = (0.40 \times T_{norm}) + (0.30 \times V_{norm}) + (0.20 \times I_{norm}) + (0.10 \times W_{norm})$$

* **Weights Rationale**: Land Surface Temperature is the primary physical symptom ($40\%$). Vegetation canopy ($30\%$) and Impervious surface fraction ($20\%$) represent the modifiable physical urban fabric. Water distance ($10\%$) accounts for natural evaporative buffering.

### C. Dominant Root Cause Diagnosis
Whichever of the four weighted terms contributes the highest value is diagnosed as the cell's primary cause:
$$\text{Dominant Cause} = \arg\max \{ 0.4 T_{norm}, 0.3 V_{norm}, 0.2 I_{norm}, 0.1 W_{norm} \}$$

* $\max = 0.4 T_{norm} \rightarrow$ **`extreme_temperature`** (Needs Green Roofs / Living Facades)
* $\max = 0.3 V_{norm} \rightarrow$ **`low_vegetation`** (Needs Native Canopy Trees)
* $\max = 0.2 I_{norm} \rightarrow$ **`high_impervious_surface`** (Needs High-Albedo Cool Roofs/Pavements)
* $\max = 0.1 W_{norm} \rightarrow$ **`far_from_water`** (Needs Bioswales & Solar Misting Corridors)

---

## 6. Tier 1 Verified Municipal Solutions & Area Justifications

Tier 1 solutions represent **proven, standardized municipal engineering blueprints** that municipal commissioners can defend in city budget hearings.

### Dedicated Feature: Separate Area Justification Icon (💡)
Inside the Tier 1 solution card, a dedicated interactive button—`Why it solves {Zone}` with a glowing `Lightbulb` icon—expands the localized microclimate explanation:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Tier 1 Verified Intervention                       [DEFENSIBLE BENCHMARK]  │
│  Standardized Municipal Blueprint                                           │
│                                                                             │
│  Extensive Green Roofs & Vertical Living Walls   [💡 Why it solves Manali ▾]│
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 🎯 AREA IMPACT JUSTIFICATION: MANALI INDUSTRIAL ZONE                   │  │
│  │ Headline: Neutralizes Petrochemical & Industrial Thermal Inertia      │  │
│  │                                                                       │  │
│  │ 💡 Why it solves Manali's problem:                                    │  │
│  │ Manali's heavy petrochemical refineries and metal manufacturing sheds │  │
│  │ absorb massive radiant energy, creating an intense heat dome (LST>41°C│  │
│  │ Retrofitting living green roofs shields metal structures and prevents │  │
│  │ heat from re-radiating into nearby worker residential quarters.       │  │
│  │                                                                       │  │
│  │ 🔬 Scientific Mechanism: Vegetative shading and soil insulation reduce│  │
│  │ thermal conduction across metal roofs by 65%, dropping surface temp by│  │
│  │ 15°C and reducing ambient microclimate heat by 2.5°C to 4.0°C.        │  │
│  │                                                                       │  │
│  │ 🎯 Countered Metric: T_norm > 0.94   👥 Beneficiaries: Shift workers   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [ ₹ Standard Cost: ₹1,800 - ₹3,000/m² ]  [ 📉 Cooling Impact: -3.2°C LST ]  │
│  Co-benefits: [Thermal insulation] [Runoff retention] [Urban biodiversity]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Tier 2 Generative AI Concept Engine (Gemini)

While Tier 1 provides standardized blueprints, **Tier 2 uses Google Gemini 1.5/2.0 AI** to synthesize creative, microclimate-specific adaptations for that exact grid cell:
* **Cost Cap Adherence**: Every AI recommendation is hard-constrained to not exceed the Tier 1 unit cost threshold.
* **Contextual Grounding**: Gemini is fed the cell's exact coordinates, zone name, $T_{norm}$, $V_{norm}$, $I_{norm}$, $W_{norm}$, and diagnosed cause.
* **Output Structure**: Returns 2 creative ideas featuring a title, 2-line explanation, estimated cost in INR, projected cooling reduction, and co-benefits (e.g., *Miyawaki Micro-Forest Pockets along Manali Expressways*, *Reflective Tensile Shading Sails across Koyambedu Market Aisles*).

---

## 8. Municipal Budget Optimizer (Greedy Knapsack ROI)

### The Problem it Solves
Municipal governments have strict budget limits (e.g. ₹5,00,000, ₹10,00,000). The Budget Optimizer calculates **which exact hotspots to treat** to maximize city cooling within the spending cap.

### Standardized Application Scale per Hotspot Cell:
* **High Impervious**: $500\text{ m}^2$ High-Albedo Cool Roof $\rightarrow$ **₹75,000** ($-2.8^\circ\text{C}$ impact)
* **Low Vegetation**: $50$ Native High-Canopy Trees $\rightarrow$ **₹1,00,000** ($-2.2^\circ\text{C}$ impact)
* **Extreme Temperature**: $100\text{ m}^2$ Extensive Living Green Roof $\rightarrow$ **₹2,40,000** ($-3.2^\circ\text{C}$ impact)
* **Far from Water**: $1$ Solar Micro-Misting Corridor Pavilion $\rightarrow$ **₹65,000** ($-1.8^\circ\text{C}$ impact)

### ROI Scoring Formula:
$$\text{ROI Priority Score} = \frac{\text{Heat Score} \times \Delta T_{\text{cooling impact}} \times 100{,}000}{\text{Implementation Cost (INR)}}$$

### Algorithmic Execution:
1. Candidate hotspots are ranked descending by their `ROI Priority Score`.
2. The greedy knapsack loop funds the highest ROI candidates until the total budget is exhausted.
3. Summary metrics are calculated: Total Allocated, Remaining Budget, Treated Hotspots Count, and City-Wide Average Cooling (°C).

### Dual Input Controls (User-Driven):
* **Direct Numeric Input Field**: Users can type any exact budget amount with a `₹` symbol (e.g., `₹4,50,000` or `₹12,50,000`).
* **Interactive Range Slider**: Smooth slider from ₹50,000 to ₹30,00,000 in sync with the input box.
* **Quick Presets**: 1-click pills for ₹1L, ₹2.5L, ₹5L, ₹7.5L, ₹10L, ₹15L, ₹20L, ₹30L.
* **Real-Time Calculation**: Debounced live recalculation as you type or slide.

---

## 9. Frontend & Backend Technical Stack

| Layer | Technologies Used | Key Libraries & Features |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Vanilla CSS | `leaflet`, `react-leaflet`, `lucide-react`, `axios` |
| **Mapping** | Leaflet with Esri Basemaps | Esri Dark Canvas, Esri High-Res Satellite Canopy, OpenStreetMap (Zero watermarks, floating switcher) |
| **UI Aesthetics** | Dark Glassmorphism | Custom design tokens, Outfit & Plus Jakarta Sans typography, HSL emerald & purple gradients |
| **Backend** | Python 3.11, FastAPI, Uvicorn | `pydantic` v2, `google-generativeai`, `geopandas`, `shapely`, `osmnx` |
| **Cloud Hosting** | Vercel + Render | Continuous Deployment (CI/CD) auto-deploying from `origin/main` |

---

## 10. Frequently Asked Questions & Evaluator Viva Guide

### Q1: Why did you choose 250m x 250m instead of ward-level or 1km resolution?
> **Answer**: Ward-level data is an administrative average that obscures microclimate extremes (e.g., a localized asphalt bus bay inside an otherwise residential ward). A 1km satellite pixel is too coarse to identify specific buildings or streets. The $250\text{m} \times 250\text{m}$ grid (~6.25 hectares) directly matches the actionable scale of municipal interventions—such as retrofitting a cluster of warehouse roofs or planting an avenue of trees.

### Q2: How is the Tier 1 solution different from Tier 2?
> **Answer**: 
> * **Tier 1 is Deterministic & Standardized**: Derived from verified municipal engineering lookups, Indian government codes (BEE, ICAP), and GCC schedules of rates. It is legally and financially defensible.
> * **Tier 2 is Generative & Adaptive**: Powered by Google Gemini AI to propose contextual architectural innovations (e.g., vertical hydroponics, kinetic shading sails) that respect the Tier 1 cost ceilings.

### Q3: How does the system prevent hallucinations in AI recommendations?
> **Answer**: The Gemini prompt is strictly grounded with hard mathematical constraints from System 1 ($T_{norm}$, $V_{norm}$, $I_{norm}$, $W_{norm}$, diagnosed cause) and a hard cost ceiling from Tier 1. If the API is unreachable, the system fails over to a curated offline repository of validated concepts.

### Q4: How does the Budget Optimizer handle fractional budgets?
> **Answer**: It implements the 0/1 Greedy Knapsack algorithm based on realistic integer units of intervention (e.g., you cannot plant half a tree or build a fractional misting pavilion). Unspent capital is returned as `remaining_budget`.

### Q5: Can this platform scale to other Indian cities?
> **Answer**: Absolutely. Because System 1 uses globally accessible Landsat satellite telemetry and OpenStreetMap vector data, the pipeline can be replicated for Mumbai, Bengaluru, Hyderabad, or Delhi by simply supplying the city's geographic bounding coordinates.
