"""
Tier 1 — Verified Recommendations Engine
Fixed research-backed lookup table mapping urban heat causes to verified cooling interventions,
standardized implementation costs (INR), and temperature reduction impact.

Sources:
- Greater Chennai Corporation (GCC) Urban Greening & Miyawaki Afforestation Benchmarks (2022-2024)
- Bureau of Energy Efficiency (BEE) & India Cooling Action Plan (ICAP) Cool Roof Guidelines
- C40 Cities Urban Heat Island Mitigation & Cool Cities Network (Chennai Case Studies)
- Lawrence Berkeley National Laboratory (LBNL) Heat Island Group Roof & Pavement Albedo Studies
"""

from typing import Dict, Any

TIER1_LOOKUP: Dict[str, Dict[str, Any]] = {
    "low_vegetation": {
        "intervention": "Native Tree Planting & Canopy Expansion",
        "category": "tree_planting",
        "description": "Planting high-canopy native species (Neem, Pungai, Indian Cork Tree) with drip irrigation and 2-year protective maintenance.",
        "cost_per_unit": 2000,
        "cost_unit": "₹ / tree",
        "cost_display": "₹1,800 – ₹2,200 per tree",
        "impact_reduction_celsius": 2.2,
        "impact_display": "-1.8°C to -2.5°C Land Surface Temperature (LST)",
        "source": "GCC Urban Forestry & C40 Cool Cities Benchmark (Chennai)",
        "tier": 1,
        "verified": True,
        "co_benefits": ["Air filtration (PM2.5 absorption)", "Stormwater infiltration", "Pedestrian shade"]
    },
    "high_impervious_surface": {
        "intervention": "Cool Roofs & High-Albedo Reflective Pavements",
        "category": "cool_roofs",
        "description": "Application of high solar-reflectance index (SRI > 100) coating on flat commercial/residential roofs and porous cool pavements.",
        "cost_per_unit": 150,
        "cost_unit": "₹ / m²",
        "cost_display": "₹120 – ₹180 per m²",
        "impact_reduction_celsius": 2.8,
        "impact_display": "-2.0°C to -3.5°C surface reduction (-1.2°C ambient)",
        "source": "India Cooling Action Plan (ICAP) & BEE Cool Roof Guidelines",
        "tier": 1,
        "verified": True,
        "co_benefits": ["20-30% indoor cooling energy savings", "Reduced grid peak demand"]
    },
    "extreme_temperature": {
        "intervention": "Extensive Green Roofs & Vertical Living Walls",
        "category": "green_roofs",
        "description": "Retrofitting rooftops with lightweight sedum/drought-tolerant native vegetation mats and building facade vertical green screens.",
        "cost_per_unit": 2400,
        "cost_unit": "₹ / m²",
        "cost_display": "₹1,800 – ₹3,000 per m²",
        "impact_reduction_celsius": 3.2,
        "impact_display": "-2.5°C to -4.0°C microclimate reduction",
        "source": "C40 Cities Green Infrastructure & TERI Urban Heat Studies",
        "tier": 1,
        "verified": True,
        "co_benefits": ["Thermal building insulation", "Rainwater runoff retention", "Urban biodiversity"]
    },
    "far_from_water": {
        "intervention": "Urban Bioswales & Solar Misting Corridors",
        "category": "misting_and_water_corridors",
        "description": "Constructing vegetative bioswales for retention cooling paired with solar-powered ultra-fine misting pavilions along high-traffic pedestrian corridors.",
        "cost_per_unit": 65000,
        "cost_unit": "₹ / unit",
        "cost_display": "₹50,000 – ₹80,000 per misting unit (₹650/m² bioswale)",
        "impact_reduction_celsius": 1.8,
        "impact_display": "-1.5°C to -2.2°C pedestrian corridor cooling",
        "source": "Singapore & Ahmedabad Heat Action Plan Evaporative Benchmarks",
        "tier": 1,
        "verified": True,
        "co_benefits": ["Instant heat relief for pedestrians & vendors", "Groundwater recharge"]
    }
}

DEFAULT_TIER1 = TIER1_LOOKUP["low_vegetation"]

def get_tier1_recommendation(cause: str) -> Dict[str, Any]:
    """Retrieve verified Tier 1 recommendation by cause."""
    normalized_cause = cause.strip().lower() if cause else ""
    return TIER1_LOOKUP.get(normalized_cause, DEFAULT_TIER1)

def attach_tier1(hotspot: Dict[str, Any]) -> Dict[str, Any]:
    """Attach verified Tier 1 recommendation to a hotspot dictionary."""
    cause = hotspot.get("cause", "low_vegetation")
    enriched = dict(hotspot)
    enriched["tier1_recommendation"] = get_tier1_recommendation(cause)
    return enriched
