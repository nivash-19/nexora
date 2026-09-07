"""
Tier 2 — AI-Suggested Ideas Engine
Generates creative, hyper-localized cooling interventions using Gemini Pro.
Strict Constraint: AI NEVER invents cost numbers. Every generated idea is classified
and mapped to the nearest verified Tier 1 cost category benchmark.
Always tagged with "AI-suggested, estimated".
"""

import os
import json
import re
from typing import Dict, Any, List
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Tier 1 Cost Category Benchmarks for Mapping
TIER1_COST_CATEGORIES = {
    "tree_planting": {
        "category_name": "Native Tree & Canopy Greening",
        "cost_display": "₹1,800 – ₹2,200 per tree",
        "cost_per_unit": 2000,
        "cost_unit": "₹ / tree",
        "est_impact": "-1.8°C to -2.5°C LST reduction"
    },
    "cool_roofs": {
        "category_name": "Cool Roofs & High-Albedo Surfaces",
        "cost_display": "₹120 – ₹180 per m²",
        "cost_per_unit": 150,
        "cost_unit": "₹ / m²",
        "est_impact": "-2.0°C to -3.5°C surface reduction"
    },
    "green_roofs": {
        "category_name": "Living Green Roofs & Vertical Vegetation",
        "cost_display": "₹1,800 – ₹3,000 per m²",
        "cost_per_unit": 2400,
        "cost_unit": "₹ / m²",
        "est_impact": "-2.5°C to -4.0°C microclimate reduction"
    },
    "misting_and_water_corridors": {
        "category_name": "Bioswales & Solar Evaporative Misting",
        "cost_display": "₹50,000 – ₹80,000 per unit (₹650/m² bioswale)",
        "cost_per_unit": 65000,
        "cost_unit": "₹ / unit",
        "est_impact": "-1.5°C to -2.2°C pedestrian corridor cooling"
    }
}

# Zone-specific contextual knowledge for resilient fallback
ZONE_COOLING_KNOWLEDGE = {
    "Manali": [
        {
            "title": "Industrial Reflective Roof Coatings & Buffer Tree Belt",
            "concept": "Retrofit large industrial warehouses and petrochemical storage roofs with high-solar-reflectance (SRI 104) elastomeric paint, backed by a casuarina & neem buffer belt along boundary walls.",
            "category": "cool_roofs",
            "rationale": "Manali's intense industrial roof surface heat radiation requires high-albedo coatings to cut thermal inertia."
        },
        {
            "title": "Microclimate Smog & Heat Sinks using Miyawaki Pocket Forests",
            "concept": "Deploy compact 200m² dense indigenous Miyawaki forests along transport corridors to trap particulate matter and form cool air sinks.",
            "category": "tree_planting",
            "rationale": "Dense canopy provides rapid shade and evaporative cooling in industrial zones."
        }
    ],
    "Koyambedu": [
        {
            "title": "Market Wholesale Shed Shading Canopies & Evaporative Misting",
            "concept": "Install tensile shade sails over open loading bays and pedestrian lanes at the wholesale fruit/flower market, augmented by solar-powered water misters.",
            "category": "misting_and_water_corridors",
            "rationale": "High footfall open asphalt areas in Koyambedu suffer severe ground-level radiant heat during peak market hours."
        },
        {
            "title": "Cool Parking Pavement & Permeable Interlocking Blocks",
            "concept": "Replace asphalt bus bays and truck parking with permeable light-colored concrete pavers that allow rainwater infiltration and prevent thermal soaking.",
            "category": "cool_roofs",
            "rationale": "Cuts surface temperatures by up to 15°C over standard bitumen asphalt."
        }
    ],
    "Ambattur": [
        {
            "title": "Industrial Estate Rooftop Solar-Cool Roof Synergy",
            "concept": "Pair white elastomeric roof coatings beneath elevated solar PV arrays on manufacturing sheds, boosting PV efficiency while dropping roof heat transfer.",
            "category": "cool_roofs",
            "rationale": "Reflective backing cools the panels, enhancing energy generation while chilling the factory floor."
        },
        {
            "title": "Roadside Bioswale Drainage & Dense Avenue Tree Corridors",
            "concept": "Re-engineer industrial stormwater drains into vegetated bioswales planted with bamboo and terminalia to intercept runoff and cool ambient air.",
            "category": "misting_and_water_corridors",
            "rationale": "Provides natural retention and ambient microclimate moisture in dry industrial zones."
        }
    ],
    "Anna Nagar": [
        {
            "title": "Residential Green Canopy Infill & Pocket Shade Arbors",
            "concept": "Targeted infill of intermediate-tier canopy trees (Crepe Myrtle, Tecoma) along commercial avenues, coupled with shaded pedestrian seating arbors.",
            "category": "tree_planting",
            "rationale": "Strengthens existing residential tree cover to close heat gaps along high-traffic commercial stretches."
        },
        {
            "title": "Terrace Green Roof Allotments for Apartment Complexes",
            "concept": "Incentivize resident welfare associations (RWAs) to install modular sedum and vegetable planter green roofs across high-density apartment blocks.",
            "category": "green_roofs",
            "rationale": "Multi-story residential heat absorption is drastically lowered by vegetative soil blankets."
        }
    ],
    "Teynampet": [
        {
            "title": "Commercial Boulevard Vertical Living Green Walls",
            "concept": "Affix modular vertical hydroponic trellis systems along flyover pillars and glass commercial facades on arterial corridors.",
            "category": "green_roofs",
            "rationale": "Mitigates vertical radiant heat bounce from modern glass-and-concrete corporate facades."
        },
        {
            "title": "Pedestrian Cool Transit Transit Corridors with High-Albedo Pavers",
            "concept": "Apply light grey solar-reflective coatings to sidewalks and transit stops near Metro stations with integrated misting pergolas.",
            "category": "cool_roofs",
            "rationale": "Shields commuters and pedestrians from high radiant heat between transit stops."
        }
    ],
    "Perungudi": [
        {
            "title": "Marshland Buffer Bioswales & Brackish Vegetation Corridors",
            "concept": "Restore peripheral drainage zones with brackish-tolerant reeds, mangrove associates, and bioswales buffering the IT corridor from the landfill micro-heat dome.",
            "category": "misting_and_water_corridors",
            "rationale": "Marshland moisture combined with vegetation suppresses the intense localized landfill/IT heat bubble."
        },
        {
            "title": "IT Park Rooftop Sedum Gardens & Shaded Terrace Lounges",
            "concept": "Convert expansive concrete IT park roofs into extensive green roofs featuring drought-hardy local succulents and permeable shading pergolas.",
            "category": "green_roofs",
            "rationale": "Replaces vast asphalt and concrete IT roof expanses with natural evaporative cooling surfaces."
        }
    ]
}

def map_to_tier1_cost(category_or_text: str) -> Dict[str, Any]:
    """Map any text or category string to the nearest Tier 1 cost category."""
    text_lower = (category_or_text or "").lower()
    
    if any(k in text_lower for k in ["tree", "plant", "forest", "canopy", "miyawaki", "foliage", "afforest"]):
        category = "tree_planting"
    elif any(k in text_lower for k in ["green roof", "living wall", "vertical", "sedum", "vegetated roof", "facade"]):
        category = "green_roofs"
    elif any(k in text_lower for k in ["mist", "bioswale", "water", "fountain", "wetland", "swale", "pond", "evaporat"]):
        category = "misting_and_water_corridors"
    elif any(k in text_lower for k in ["cool roof", "pavement", "coating", "reflective", "albedo", "white roof", "paver"]):
        category = "cool_roofs"
    else:
        category = "cool_roofs"
        
    benchmark = TIER1_COST_CATEGORIES[category]
    return {
        "category_id": category,
        "category_name": benchmark["category_name"],
        "cost_display": benchmark["cost_display"],
        "cost_per_unit": benchmark["cost_per_unit"],
        "cost_unit": benchmark["cost_unit"],
        "est_impact": benchmark["est_impact"],
        "cost_mapping_rule": "Mapped strictly to verified Tier 1 cost benchmark (AI does not invent cost)"
    }

def generate_tier2_fallback(zone: str, cause: str) -> List[Dict[str, Any]]:
    """Intelligent localized fallback generator matching zone and cause."""
    zone_ideas = ZONE_COOLING_KNOWLEDGE.get(zone, ZONE_COOLING_KNOWLEDGE["Anna Nagar"])
    
    ideas = []
    for idea in zone_ideas:
        mapped_cost = map_to_tier1_cost(idea["category"])
        ideas.append({
            "title": idea["title"],
            "concept": idea["concept"],
            "rationale": idea["rationale"],
            "tier": 2,
            "badge": "AI-suggested, estimated",
            "status": "Exploratory / Unverified",
            "mapped_cost": mapped_cost
        })
    return ideas

def generate_tier2_recommendations(hotspot: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate 2-3 creative cooling suggestions using Gemini Pro or intelligent fallback,
    strictly mapping costs to Tier 1 benchmarks.
    """
    cell_id = hotspot.get("cell_id", "UNKNOWN")
    zone = hotspot.get("zone", "Chennai")
    cause = hotspot.get("cause", "extreme_temperature")
    heat_score = hotspot.get("heat_score", 0.8)
    factors = hotspot.get("contributing_factors", {})
    
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    if not api_key or api_key == "your_key_here":
        # Return fallback with clear tag
        ideas = generate_tier2_fallback(zone, cause)
        return {
            "cell_id": cell_id,
            "zone": zone,
            "source": "Gemini Fallback Knowledge Engine (Set GEMINI_API_KEY for live AI prompts)",
            "badge": "AI-suggested, estimated",
            "tier": 2,
            "ideas": ideas
        }
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        prompt = f"""You are an expert urban climatologist and landscape architect designing cooling interventions for Chennai, India.
Generate 2-3 creative, innovative, and highly localized cooling intervention ideas for the following urban heat hotspot:

- Zone: {zone}, Chennai
- Cell ID: {cell_id}
- Heat Score (0-1): {heat_score}
- Diagnosed Root Cause: {cause}
- Contributing Factors: Temperature Index (T_norm: {factors.get('T_norm', 'N/A')}), Vegetation Index (V_norm: {factors.get('V_norm', 'N/A')}), Impervious Surface Index (I_norm: {factors.get('I_norm', 'N/A')}), Water Proximity (W_norm: {factors.get('W_norm', 'N/A')})

STRICT INSTRUCTIONS:
1. Ideas must be customized to {zone}'s specific urban fabric (e.g. market, industrial, residential, transit, coastal/marshland).
2. For each idea, categorize it into EXACTLY ONE of these 4 standard benchmark categories:
   - "tree_planting"
   - "cool_roofs"
   - "green_roofs"
   - "misting_and_water_corridors"
3. DO NOT invent cost numbers. The system maps your category to verified municipal benchmarks.
4. Output valid JSON array with objects containing:
   - "title": concise creative title
   - "concept": 2-3 sentences explaining the idea
   - "rationale": 1 sentence explaining why this suits {zone}
   - "category": one of ["tree_planting", "cool_roofs", "green_roofs", "misting_and_water_corridors"]

Return ONLY the raw JSON array.
"""
        model_names = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro"]
        response_text = ""
        for m_name in model_names:
            try:
                model = genai.GenerativeModel(m_name)
                response = model.generate_content(prompt)
                if response and response.text:
                    response_text = response.text
                    break
            except Exception:
                continue

        if not response_text:
            raise RuntimeError("Empty response from Gemini API models")

        # Parse response
        clean_json = response_text.strip()
        if clean_json.startswith("```"):
            clean_json = re.sub(r"^```[a-zA-Z]*\n", "", clean_json)
            clean_json = re.sub(r"\n```$", "", clean_json)
            
        parsed_data = json.loads(clean_json)
        if isinstance(parsed_data, dict) and "ideas" in parsed_data:
            parsed_data = parsed_data["ideas"]
            
        formatted_ideas = []
        for item in parsed_data:
            cat = item.get("category", "cool_roofs")
            mapped_cost = map_to_tier1_cost(cat)
            formatted_ideas.append({
                "title": item.get("title", "Localized Cooling Intervention"),
                "concept": item.get("concept", ""),
                "rationale": item.get("rationale", ""),
                "tier": 2,
                "badge": "AI-suggested, estimated",
                "status": "Exploratory / Unverified",
                "mapped_cost": mapped_cost
            })
            
        return {
            "cell_id": cell_id,
            "zone": zone,
            "source": "Gemini Generative AI Engine",
            "badge": "AI-suggested, estimated",
            "tier": 2,
            "ideas": formatted_ideas
        }

    except Exception as exc:
        # Graceful fallback so demo never breaks
        ideas = generate_tier2_fallback(zone, cause)
        return {
            "cell_id": cell_id,
            "zone": zone,
            "source": f"Gemini Fallback Engine (API error fallback: {str(exc)[:60]})",
            "badge": "AI-suggested, estimated",
            "tier": 2,
            "ideas": ideas
        }
