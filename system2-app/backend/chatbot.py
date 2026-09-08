"""
Chatbot & Doubt-Resolution Engine — HeatScape Nexora
Enables users to ask questions and clear doubts regarding urban heat solutions,
Tier 1 municipal benchmarks, Tier 2 generative concepts, zone-specific climatology,
and Knapsack budget allocation.
Uses Google Gemini API when GEMINI_API_KEY is available, with an authoritative
built-in knowledge fallback engine so queries never fail.
"""

import os
import re
from typing import List, Dict, Any, Optional
from tier1 import TIER1_LOOKUP, ZONE_CAUSE_JUSTIFICATIONS
from data_loader import load_hotspots_raw

SYSTEM_PROMPT = """You are the HeatScape AI Copilot, an expert urban climatologist, municipal civil engineer, and policy consultant for the Greater Chennai Corporation (GCC) and Tamil Nadu State Disaster Management Authority.

You have deep technical knowledge of the HeatScape Nexora platform:
1. SATELLITE & SENSOR DATA:
   - Uses Landsat-8/9 Thermal Infrared Sensors (TIRS-2 at 30m resolution) calibrated with Sentinel-2 Multi-Spectral (10m NDVI).
   - Operates on a precise 250m x 250m grid (~6.25 hectares) across 7 key Chennai zones (Manali, Ambattur, Koyambedu, Teynampet, Perungudi, Anna Nagar, Royapuram).
   - 4 Normalized Environmental Indices:
     * T_norm: Land Surface Temperature anomaly (0.0 to 1.0; >0.85 = extreme heat stress).
     * V_norm: Vegetation deficit (1 - normalized NDVI; higher = severe lack of canopy).
     * I_norm: Impervious surface fraction (concrete, bitumen, metal roof density).
     * W_norm: Water/coastal cooling buffer distance penalty.

2. TIER 1 VERIFIED MUNICIPAL BLUEPRINTS (Standards & Schedules of Rates):
   - Low Vegetation: Native Tree Planting & Canopy Expansion (Neem, Pungai, Indian Cork Tree).
     * Benchmark Cost: ₹1,800 – ₹2,200 per tree (Base: ₹2,000/tree).
     * Cooling: -1.8°C to -2.5°C LST. Standard allocation: 50 trees/cell = ₹1,00,000.
     * Source: GCC Urban Forestry & C40 Cities Benchmarks.
   - High Impervious Surface: Cool Roofs & High-Albedo Pavements (SRI > 100).
     * Benchmark Cost: ₹120 – ₹180 per m² (Base: ₹150/m²).
     * Cooling: -2.0°C to -3.5°C surface (-1.2°C ambient). Standard allocation: 500 m²/cell = ₹75,000.
     * Source: India Cooling Action Plan (ICAP) & Bureau of Energy Efficiency (BEE).
   - Extreme Temperature: Extensive Living Green Roofs & Vertical Walls (Sedum + Solar PV).
     * Benchmark Cost: ₹1,800 – ₹3,000 per m² (Base: ₹2,400/m²).
     * Cooling: -2.5°C to -4.0°C microclimate reduction. Standard allocation: 100 m²/cell = ₹2,40,000.
     * Source: C40 Cities Green Infrastructure & TERI Studies.
   - Far from Water: Urban Bioswales & Solar Misting Corridors.
     * Benchmark Cost: ₹50,000 – ₹80,000 per misting unit (Base: ₹65,000/unit, ₹650/m² bioswale).
     * Cooling: -1.5°C to -2.2°C pedestrian corridor relief. Standard allocation: 1 unit/cell = ₹65,000.
     * Source: Ahmedabad Heat Action Plan & Singapore Urban Benchmarks.

3. TIER 2 GEMINI AI CONCEPTS:
   - Creative architectural innovations synthesized for the specific micro-grid cell.
   - Critical Rule: AI does NOT invent cost numbers. Every Tier 2 concept is mapped strictly to Tier 1 cost ceilings.

4. MUNICIPAL BUDGET OPTIMIZATION (Greedy Knapsack Algorithm):
   - Formula: ROI Score = (Heat Score * Delta_T * 100,000) / Implementation Cost (INR).
   - Ranks hotspots descending by ROI Priority and funds whole actionable units until budget is exhausted.

INSTRUCTIONS:
- Answer the user's doubts clearly, authoritatively, and concisely.
- Use clean formatting with bold titles, bullet points, and exact numbers (INR, °C, m², units).
- When asked about a specific Chennai zone or solution, ground your answer in local realities (e.g. Manali's petrochemical industrial sheds, Koyambedu's vegetable wholesale market, Ambattur's manufacturing factories).
- Keep answers accessible to both city municipal officials and students/evaluators.
"""

# Authoritative Local Q&A Knowledge Engine for offline or fallback operation
KNOWLEDGE_BASE = [
    {
        "keywords": ["cost", "price", "budget", "capex", "rate", "how much", "expensive"],
        "answer": """### Standardized Municipal Cost Benchmarks (INR)

All costs in HeatScape are derived from **Greater Chennai Corporation (GCC)** schedules of rates and the **India Cooling Action Plan (ICAP)**:

| Intervention Category | Unit Schedule Rate | Standard Hotspot Cell Package | Est. Cooling Impact |
| :--- | :--- | :--- | :--- |
| **Native Tree Canopy** | **₹2,000 / tree** (₹1,800 – ₹2,200) | 50 trees = **₹1,00,000** | -1.8°C to -2.5°C LST |
| **Cool High-Albedo Roofs** | **₹150 / m²** (₹120 – ₹180) | 500 m² = **₹75,000** | -2.0°C to -3.5°C surface |
| **Living Green Roofs** | **₹2,400 / m²** (₹1,800 – ₹3,000) | 100 m² = **₹2,40,000** | -2.5°C to -4.0°C microclimate |
| **Bioswales & Misting** | **₹65,000 / unit** (₹50k – ₹80k) | 1 pavilion = **₹65,000** | -1.5°C to -2.2°C pedestrian |

*Note: In Tier 2, Gemini AI proposes creative variations (e.g. biosolar canopies or misting pergolas), but costs are strictly locked to these verified municipal rates to avoid hallucinations.*"""
    },
    {
        "keywords": ["manali", "petrochem", "refinery", "industrial"],
        "answer": """### Why Living Green Biosolar Roofs are Chosen for Manali

1. **High Thermal Mass of Metal Structures**: Manali is dominated by expansive petrochemical refineries, container freight stations, and unshaded corrugated metal warehouse sheds. These metal surfaces reach upwards of **58°C** in afternoon sun.
2. **Biological Heat Sink**: Living sedum green roofs cut solar heat transmission through industrial roofs by up to **65%**, reducing ambient microclimate temperatures by **-2.5°C to -4.0°C**.
3. **Air Pollution Co-benefit**: Heavy PM2.5 and volatile organic compounds from refinery operations are actively filtered by vegetative canopy belts.
4. **Beneficiaries**: Over 140,000 shift workers, logistics technicians, and residents in nearby worker colonies."""
    },
    {
        "keywords": ["koyambedu", "market", "wholesale", "vendor"],
        "answer": """### Why Cool Roofs & Misting Corridors are Chosen for Koyambedu

1. **Massive Bitumen & Concrete Footprint**: Koyambedu hosts Asia's largest wholesale perishable goods and transport market, featuring extensive asphalt loading bays and concrete rooftops that trap heat ($I_{norm} > 0.90$).
2. **Food Spoilage Reduction**: High ambient heat accelerates the rotting of fresh vegetables and fruits. High-reflectance cool roof coatings (SRI > 100) drop indoor warehouse temperatures by **4°C to 7°C**, directly preserving produce shelf-life.
3. **Vendor Heat Relief**: Solar misting corridors along pedestrian aisles provide instant **-1.8°C to -2.5°C** evaporative cooling for daily market vendors and loaders."""
    },
    {
        "keywords": ["ambattur", "manufacturing", "auto", "factory"],
        "answer": """### Why Buffer Canopy Greening is Chosen for Ambattur

1. **Industrial Heat Concentration**: Ambattur Industrial Estate features dense auto-component and electrical manufacturing facilities with continuous machinery waste heat.
2. **Tree Deficit**: Canopy cover is under 12% ($V_{norm} > 0.85$), leaving workers exposed during shift changes.
3. **Evaporative Canopy Belts**: Planting high-canopy native species (Neem, Pungai, Casuarina) provides dense shade, groundwater absorption, and over 350 liters of daily evapotranspiration per tree."""
    },
    {
        "keywords": ["knapsack", "optimizer", "greedy", "algorithm", "roi", "formula", "allocation"],
        "answer": """### How the Municipal Budget Optimizer Works

HeatScape uses a **Greedy 0/1 Knapsack Algorithm** tailored for city engineers:

1. **ROI Priority Formula**:
   $$\\text{ROI Priority Score} = \\frac{\\text{Heat Score} \\times \\Delta T_{\\text{cooling impact}} \\times 100{,}000}{\\text{Implementation Cost (INR)}}$$
2. **Ranking**: All hotspot cells in the target zone (or all zones) are sorted descending by their ROI Priority Score.
3. **Integer Allocation**: The algorithm commits funding to full, discrete intervention packages (e.g. ₹75,000 for 500m² cool roof) one by one until the user's budget ceiling is reached.
4. **Output Metrics**: Returns the exact list of treated hotspots, total money spent, remaining unspent budget, and projected city-wide temperature reduction."""
    },
    {
        "keywords": ["tier 1", "tier 2", "difference", "compare"],
        "answer": """### Difference Between Tier 1 and Tier 2 Interventions

| Dimension | Tier 1 (Municipal Blueprint) | Tier 2 (Gemini AI Suggestions) |
| :--- | :--- | :--- |
| **Nature** | Deterministic, legal engineering lookup | Generative, contextual, architectural |
| **Engine** | Standardized GCC & ICAP engineering tables | Google Gemini 1.5 Pro / Flash |
| **Cost Basis** | Fixed verified schedule rate (e.g. ₹150/m²) | **Strictly mapped** to Tier 1 cost ceilings |
| **Role** | Defensible public tender specification | Creative pilot innovations & site adaptations |
| **Verification** | 100% verified by GCC & ICAP | Exploratory / estimated |"""
    },
    {
        "keywords": ["250m", "grid", "resolution", "scale", "why not ward"],
        "answer": """### Why HeatScape Uses a 250m x 250m Micro-Grid

1. **Ward Averages are Too Coarse**: A municipal ward averages 3–8 km². An asphalt parking lot or warehouse cluster inside an otherwise leafy ward gets smoothed out and ignored by ward-level statistics.
2. **Actionable Intervention Scale**: A 250m x 250m cell equals **6.25 hectares** (~15.4 acres)—the exact operational scale at which a municipal crew can plant 50 trees, paint 500m² of roofs, or install a misting canopy.
3. **Satellite Alignment**: Matches downsampled Landsat-8/9 thermal infrared (30m) combined with Sentinel-2 multi-spectral (10m) resolution without artificial interpolation errors."""
    }
]

def search_fallback_knowledge(query: str) -> Optional[str]:
    """Matches user doubt against verified platform knowledge base."""
    q = query.lower()
    for item in KNOWLEDGE_BASE:
        if any(k in q for k in item["keywords"]):
            return item["answer"]
    return None

def answer_doubt(
    query: str,
    history: Optional[List[Dict[str, str]]] = None,
    context_cell_id: Optional[str] = None,
    api_key_override: Optional[str] = None
) -> Dict[str, Any]:
    """
    Solves user doubts regarding urban heat solutions using Google Gemini API
    or authoritative fallback knowledge engine.
    """
    clean_query = (query or "").strip()
    if not clean_query:
        return {
            "answer": "Please enter a question about Chennai urban heat solutions, intervention costs, or algorithms.",
            "source": "HeatScape Assistant",
            "suggested_followups": [
                "What is the cost breakdown of Tier 1 solutions?",
                "Why are green roofs recommended for Manali?",
                "How does the Greedy Knapsack algorithm allocate budget?"
            ]
        }

    # Resolve API Key: passed parameter -> backend .env -> environment variable
    api_key = (api_key_override or os.getenv("GEMINI_API_KEY", "")).strip()

    # If active cell context was passed, enrich prompt
    cell_context_str = ""
    if context_cell_id:
        raw_hotspots = load_hotspots_raw()
        matching = next((h for h in raw_hotspots if h.get("cell_id", "").lower() == context_cell_id.lower()), None)
        if matching:
            cell_context_str = f"""
Currently Selected Cell Context:
- Cell ID: {matching.get('cell_id')}
- Zone: {matching.get('zone')}, Chennai
- Heat Score: {matching.get('heat_score')}
- Diagnosed Root Cause: {matching.get('cause')}
- Primary Tier 1 Solution: {matching.get('tier1_recommendation', {}).get('intervention')}
- Standard Cost: {matching.get('tier1_recommendation', {}).get('cost_display')}
- Cooling Impact: {matching.get('tier1_recommendation', {}).get('impact_display')}
"""

    # If Gemini API Key is available, invoke live Google Gemini model
    if api_key and api_key != "your_key_here":
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)

            # Build messages conversation history
            messages = [{"role": "user", "parts": [SYSTEM_PROMPT + cell_context_str]}]
            messages.append({"role": "model", "parts": ["Understood. I am HeatScape AI Copilot, ready to answer questions about Chennai cooling interventions, municipal benchmarks, and optimization math."]})

            if history:
                for h in history[-6:]: # Keep last 6 exchanges for context
                    role = "user" if h.get("role") == "user" else "model"
                    content = h.get("content", "")
                    if content:
                        messages.append({"role": role, "parts": [content]})

            messages.append({"role": "user", "parts": [clean_query]})

            # Attempt modern Gemini models with fallback
            candidate_models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
            response_text = ""
            used_model = "gemini-1.5-flash"

            for m_name in candidate_models:
                try:
                    model = genai.GenerativeModel(m_name)
                    res = model.generate_content(messages)
                    if res and res.text:
                        response_text = res.text
                        used_model = m_name
                        break
                except Exception:
                    continue

            if response_text:
                return {
                    "answer": response_text.strip(),
                    "source": f"Google {used_model} (Live AI)",
                    "has_live_api": True,
                    "suggested_followups": [
                        "How is this solution financed under the budget optimizer?",
                        "What are the maintenance requirements in Chennai's climate?",
                        "How does this compare to traditional gray infrastructure?"
                    ]
                }
        except Exception as err:
            # Fall back smoothly to internal knowledge
            pass

    # Authoritative Fallback Knowledge Matching
    matched_answer = search_fallback_knowledge(clean_query)
    if matched_answer:
        return {
            "answer": matched_answer,
            "source": "HeatScape Verified Knowledge Engine",
            "has_live_api": False,
            "suggested_followups": [
                "Why are living green roofs recommended for Manali?",
                "What is the cost breakdown of Tier 1 solutions?",
                "How does the Greedy Knapsack budget allocation work?"
            ]
        }

    # General Fallback response
    return {
        "answer": f"""### HeatScape Urban Cooling Copilot

Regarding your query: **"{clean_query}"**

In HeatScape Nexora, interventions are strictly calibrated across Chennai's microclimate zones:
1. **Tier 1 Solutions** are legally defensible municipal standards (tree planting at ₹2,000/tree, cool roofs at ₹150/m², living green roofs at ₹2,400/m², and bioswales/misting at ₹65,000/unit).
2. **Tier 2 Concepts** are generative architectural innovations (e.g. biosolar canopies, calcite coatings) bound to Tier 1 cost ceilings.
3. **The Budget Optimizer** uses greedy knapsack ROI priority scoring to maximize city-wide temperature reduction within municipal spending limits.

*Tip: Connect your Google Gemini API Key in the settings below to enable live conversational reasoning across any custom question.*""",
        "source": "HeatScape Verified Knowledge Engine",
        "has_live_api": False,
        "suggested_followups": [
            "What is the cost breakdown of Tier 1 solutions?",
            "Why is living green roofs recommended for Manali?",
            "How does the Greedy Knapsack budget allocation work?"
        ]
    }
