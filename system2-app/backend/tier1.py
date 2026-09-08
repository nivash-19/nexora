"""
Tier 1 — Verified Recommendations Engine
Fixed research-backed lookup table mapping urban heat causes to verified cooling interventions,
standardized implementation costs (INR), and temperature reduction impact.
Enriched with localized scientific justifications explaining WHY each solution resolves the
specific microclimatic challenge of that particular Chennai zone.

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

# Scientific & spatial justifications tailored to each Chennai zone's urban typology
ZONE_CAUSE_JUSTIFICATIONS: Dict[tuple, Dict[str, Any]] = {
    ("Manali", "extreme_temperature"): {
        "headline": "Neutralizes Petrochemical & Industrial Thermal Inertia",
        "why_it_solves": "Manali's heavy petrochemical refineries and metal manufacturing sheds absorb massive amounts of radiant solar energy, creating an intense localized heat dome (LST > 41°C). Retrofitting living green roofs and vertical vegetation blankets acts as a biological heat sink, shielding the metal structure and preventing heat from re-radiating into nearby worker quarters.",
        "scientific_mechanism": "Vegetative shading and soil insulation reduce thermal conduction across metal roofs by up to 65%, dropping surface temperatures by 15°C and reducing ambient microclimate heat by 2.5°C to 4.0°C.",
        "local_beneficiaries": "Industrial shift workers, refinery technicians, and adjacent residential hamlets along the Manali expressway.",
        "key_metric_countered": "LST Thermal Deviation (T_norm > 0.94)"
    },
    ("Manali", "high_impervious_surface"): {
        "headline": "Inverts Industrial Metal Roof Solar Absorption",
        "why_it_solves": "Manali has expansive unshaded corrugated metal warehouse roofs and bitumen tanker bays. Applying high-albedo cool roof coatings (SRI > 100) reflects solar radiation immediately back to the atmosphere rather than storing it as heat.",
        "scientific_mechanism": "High Solar Reflectance Index (SRI 104) cuts roof surface temperature from 58°C down to 36°C, eliminating continuous convective warming of the industrial boundary layer.",
        "local_beneficiaries": "Factory workers, logistics personnel, and transport operators.",
        "key_metric_countered": "Impervious Surface Fraction (I_norm > 0.88)"
    },
    ("Manali", "low_vegetation"): {
        "headline": "Forms an Evaporative & Smog-Filtering Green Belt",
        "why_it_solves": "Manali has less than 8% tree canopy cover, leaving ground surfaces exposed to unfiltered sun while trapping industrial emissions. Planting dense native canopy trees (Neem, Pungai, Casuarina) establishes an evaporative cooling buffer.",
        "scientific_mechanism": "Deep-root native canopy trees release over 350 liters of water vapor daily per tree through evapotranspiration, creating a natural microclimate cooling zone of -1.8°C to -2.5°C.",
        "local_beneficiaries": "Local residents and pedestrian commuters along industrial arterial roads.",
        "key_metric_countered": "Vegetation Canopy Deficit (V_norm > 0.85)"
    },
    ("Koyambedu", "high_impervious_surface"): {
        "headline": "Cools Expansive Market Asphalt & Loading Bays",
        "why_it_solves": "As Asia's largest wholesale perishable market hub, Koyambedu has vast continuous bitumen asphalt loading bays and concrete parking lots that absorb solar heat and reach surface temperatures above 48°C. Applying cool reflective pavements and high-albedo coatings cuts pavement heat storage.",
        "scientific_mechanism": "Permeable and high-albedo paving reflects 75% of solar radiation, lowering ground radiant temperature and reducing ambient air warming across pedestrian trading aisles.",
        "local_beneficiaries": "Over 50,000 daily wholesale vegetable, fruit, and flower vendors, headload workers, and bus commuters at CMBT.",
        "key_metric_countered": "Impervious Pavement Ratio (I_norm > 0.90)"
    },
    ("Koyambedu", "low_vegetation"): {
        "headline": "Provides Essential Shade for Outdoor Market Operations",
        "why_it_solves": "Koyambedu wholesale market operates under open skies with almost zero shade trees. Planting high-canopy native shade trees (Neem, Pungai) provides natural overhead protection for thousands of daily open-air vendors.",
        "scientific_mechanism": "Broadleaf tree canopies intercept up to 85% of direct solar irradiance, reducing Mean Radiant Temperature (MRT) by 10-14°C at head height.",
        "local_beneficiaries": "Street vendors, cart-pullers, market porters, and wholesale buyers.",
        "key_metric_countered": "Vegetation Canopy Deficit (V_norm > 0.80)"
    },
    ("Ambattur", "high_impervious_surface"): {
        "headline": "Cuts Factory Shed Heat Transfer & Energy Demand",
        "why_it_solves": "Ambattur Industrial Estate contains over 1,500 manufacturing sheds with dark asbestos and tin roofs that act as thermal radiators. Cool roof coatings (SRI > 100) reflect sunlight before it conducts into the work floor.",
        "scientific_mechanism": "Reflective elastomeric membranes lower indoor factory floor temperatures by 3-5°C, reducing mechanical fan/AC power load by 20-30% without continuous operating costs.",
        "local_beneficiaries": "Over 100,000 manufacturing technicians, machine operators, and MSME workers.",
        "key_metric_countered": "Impervious Surface Ratio (I_norm > 0.88)"
    },
    ("Ambattur", "low_vegetation"): {
        "headline": "Breaks Industrial Street Canyon Thermal Trapping",
        "why_it_solves": "Ambattur's manufacturing avenues lack greenery, causing heat to bounce between metallic factory walls. Dense native tree avenues provide continuous linear shade and evaporative cooling.",
        "scientific_mechanism": "Avenue tree canopies shade road surfaces and absorb airborne particulates, producing a 2.0°C to 2.5°C reduction in ambient corridor temperatures.",
        "local_beneficiaries": "Cyclists, factory commuters, and shift workers.",
        "key_metric_countered": "Vegetation Canopy Deficit (V_norm > 0.80)"
    },
    ("Teynampet", "high_impervious_surface"): {
        "headline": "Reverses Commercial Transit Corridor Heat Soaking",
        "why_it_solves": "Teynampet along Anna Salai is a high-density commercial corridor with multistory corporate towers and wide asphalt streets that trap heat. Cool coatings on rooftops and reflective sidewalk pavers break the street canyon heat trap.",
        "scientific_mechanism": "High-albedo surfaces prevent daytime heat absorption, dramatically lowering evening re-radiation into pedestrian walkways and bus stops.",
        "local_beneficiaries": "Office workers, bus and Metro transit commuters, and street-level retail pedestrians.",
        "key_metric_countered": "Impervious Surface Fraction (I_norm > 0.85)"
    },
    ("Teynampet", "extreme_temperature"): {
        "headline": "Intercepts Vertical Facade Heat Reflection on Anna Salai",
        "why_it_solves": "Commercial high-rises along Anna Salai feature extensive glass and concrete facades that re-radiate intense solar heat into the street. Retrofitting living green walls and extensive green roofs intercepts this vertical heat bounce.",
        "scientific_mechanism": "Vertical hydroponic living screens absorb radiant energy and cool surrounding air through plant transpiration, reducing building skin temperature by up to 12°C.",
        "local_beneficiaries": "Pedestrians walking arterial corridors, transit users, and office occupants.",
        "key_metric_countered": "Extreme Surface Temperature (T_norm > 0.86)"
    },
    ("Perungudi", "far_from_water"): {
        "headline": "Re-establishes Evaporative Cooling Buffers on OMR",
        "why_it_solves": "Perungudi sits between the OMR IT expressway and the municipal landfill, where dense asphalt cut off the natural cooling moisture of the adjacent Pallikaranai marshland. Constructing vegetative bioswales and solar misting pavilions re-introduces localized evaporative cooling.",
        "scientific_mechanism": "Micro-misting pavilions evaporate ultra-fine water droplets, instantly cooling ambient air by 1.8°C to 2.2°C along pedestrian transit walkways while recharging groundwater.",
        "local_beneficiaries": "IT tech park commuters, transit passengers, and residents near the OMR corridor.",
        "key_metric_countered": "Water Buffer Distance (W_norm > 0.70)"
    },
    ("Perungudi", "extreme_temperature"): {
        "headline": "Neutralizes IT Tech Park Concrete Heat Bubbles",
        "why_it_solves": "Expansive concrete IT park roofs in Perungudi create large localized heat bubbles. Lightweight sedum green roofs replace heat-absorbing concrete expanses with living biological cooling blankets.",
        "scientific_mechanism": "Green roof soil mats dissipate solar radiation through natural plant transpiration, cutting roof surface heat from 55°C to 28°C.",
        "local_beneficiaries": "Tech workforce, facility operations, and adjacent residential communities.",
        "key_metric_countered": "Extreme Surface Temperature (T_norm > 0.85)"
    },
    ("Anna Nagar", "low_vegetation"): {
        "headline": "Closes Avenue Canopy Gaps in Planned Residential Grid",
        "why_it_solves": "Anna Nagar's grid system has wide avenues with gaps in the canopy where direct sun penetrates to the asphalt. Infill planting of mature native shade trees completes the continuous green canopy.",
        "scientific_mechanism": "Interconnected tree canopy increases continuous vegetative cover above 40%, creating an interconnected cool microclimate corridor that lowers localized temperatures by up to 2.5°C.",
        "local_beneficiaries": "Neighborhood residents, school children, senior citizens, and neighborhood pedestrians.",
        "key_metric_countered": "Vegetation Canopy Deficit (V_norm > 0.75)"
    },
    ("Anna Nagar", "extreme_temperature"): {
        "headline": "Shields Residential Concrete Terraces from Heat Soaking",
        "why_it_solves": "Anna Nagar's dense commercial shopping streets and residential blocks store excessive radiant heat in concrete roof slabs, re-radiating heat well past midnight. Installing extensive green roofs and living vertical screens insulates rooftop slabs from direct solar radiation.",
        "scientific_mechanism": "Vegetated substrate and sedum cover prevent heat conduction into structural concrete, maintaining surface temperatures within 3°C of ambient air and lowering localized nighttime temperatures by up to 3.2°C.",
        "local_beneficiaries": "Residential families, ground-level retail shop owners, and pedestrians along 2nd Avenue.",
        "key_metric_countered": "Extreme Surface Temperature (T_norm > 0.82)"
    },
    ("Koyambedu", "extreme_temperature"): {
        "headline": "Insulates Wholesale Market Sheds & CMBT Transit Hub",
        "why_it_solves": "Koyambedu wholesale market sheds and the adjacent bus terminus feature enormous uninsulated corrugated sheet metal roofing that heats up beyond 50°C under Chennai's midday sun. Extensive green roofs and vertical living facade trellises convert solar heat into plant evapotranspiration.",
        "scientific_mechanism": "Living vegetation mats absorb up to 80% of solar radiation for biological growth, dissipating thermal load via evapotranspiration and reducing under-roof temperatures by 8°C to 12°C.",
        "local_beneficiaries": "Wholesale vegetable, fruit, and flower vendors, headload workers, and transit passengers at CMBT.",
        "key_metric_countered": "Extreme Surface Temperature (T_norm > 0.88)"
    },
    ("Ambattur", "extreme_temperature"): {
        "headline": "Eliminates Radiant Heat Transfer Across Industrial Sheds",
        "why_it_solves": "Ambattur's industrial manufacturing units and foundries have low-pitch metal roofs that absorb direct sunlight and conduct intense heat directly onto the factory work floors. Extensive sedum green roofs and vertical green screens provide thermal buffering.",
        "scientific_mechanism": "Soil and plant foliage create a thermal barrier that reduces thermal transmittance (U-value) by 60%, dampening peak heat transfer and dropping the indoor microclimate by 3.0°C to 4.2°C.",
        "local_beneficiaries": "Industrial machinists, fabrication technicians, and small-scale enterprise workers.",
        "key_metric_countered": "Extreme Surface Temperature (T_norm > 0.90)"
    },
    ("Perungudi", "low_vegetation"): {
        "headline": "Restores Native Shading Corridors Along the IT Expressway",
        "why_it_solves": "Rapid infrastructure expansion along OMR stripped native tree cover, leaving open soil and wide roadways exposed to severe solar radiation. Planting native high-canopy trees (Neem, Pungai, Indian Cork) restores continuous vegetative shade across pedestrian walkways.",
        "scientific_mechanism": "High-transpiration native tree canopies intercept 80% of solar irradiance and release ambient moisture, cooling microclimate air by 2.0°C to 2.5°C within a 15-meter radius.",
        "local_beneficiaries": "IT tech park professionals, daily bus commuters, and local neighborhood residents.",
        "key_metric_countered": "Vegetation Canopy Deficit (V_norm > 0.82)"
    }
}

def get_area_justification(zone: str, cause: str, intervention: str) -> Dict[str, Any]:
    """Retrieve zone- and cause-specific scientific justification."""
    normalized_zone = zone.strip() if zone else "Chennai"
    normalized_cause = cause.strip().lower() if cause else "low_vegetation"
    
    key = (normalized_zone, normalized_cause)
    if key in ZONE_CAUSE_JUSTIFICATIONS:
        return ZONE_CAUSE_JUSTIFICATIONS[key]
    
    # Generic fallback that specifically references zone and intervention
    return {
        "headline": f"Targeted {intervention} for {normalized_zone}",
        "why_it_solves": f"This intervention directly addresses {normalized_zone}'s diagnosed root cause ({normalized_cause.replace('_', ' ')}) by modifying the urban surface energy balance and thermal retention characteristics.",
        "scientific_mechanism": "Reduces localized surface temperature by elevating albedo or introducing vegetative evapotranspiration, mitigating heat accumulation across the microclimate.",
        "local_beneficiaries": f"Local residents, pedestrians, and workforce in {normalized_zone}.",
        "key_metric_countered": f"Diagnosed Cause: {normalized_cause.replace('_', ' ')}"
    }

def get_tier1_recommendation(cause: str) -> Dict[str, Any]:
    """Retrieve verified Tier 1 recommendation by cause."""
    normalized_cause = cause.strip().lower() if cause else ""
    return TIER1_LOOKUP.get(normalized_cause, DEFAULT_TIER1)

def attach_tier1(hotspot: Dict[str, Any]) -> Dict[str, Any]:
    """Attach verified Tier 1 recommendation enriched with area-specific justification."""
    cause = hotspot.get("cause", "low_vegetation")
    zone = hotspot.get("zone", "Chennai")
    enriched = dict(hotspot)
    t1 = dict(get_tier1_recommendation(cause))
    t1["area_justification"] = get_area_justification(zone, cause, t1.get("intervention", ""))
    enriched["tier1_recommendation"] = t1
    return enriched
