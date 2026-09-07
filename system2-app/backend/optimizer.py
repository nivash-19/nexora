"""
Municipal Budget Optimization Engine (Stretch Goal)
Prioritizes and selects hotspot interventions to maximize temperature reduction impact
within an allocated municipal budget constraint.
"""

from typing import List, Dict, Any, Optional

def optimize_budget_allocation(
    hotspots: List[Dict[str, Any]],
    total_budget: float,
    zone: Optional[str] = None
) -> Dict[str, Any]:
    """
    Greedy knapsack optimization prioritizing hotspots with highest (heat_score * impact) / cost ratio.
    """
    filtered = [h for h in hotspots if not zone or h.get("zone", "").lower() == zone.lower()]
    
    # Intervention typical application scale per cell:
    # low_veg: 50 trees (~₹100,000)
    # high_impervious: 500 m² cool roof (~₹75,000)
    # extreme_temp: 100 m² green roof (~₹240,000)
    # far_from_water: 1 misting unit (~₹65,000)
    SCALE_DEFAULTS = {
        "low_vegetation": {"units": 50, "unit_name": "trees", "total_cost": 100000},
        "high_impervious_surface": {"units": 500, "unit_name": "m² cool roof", "total_cost": 75000},
        "extreme_temperature": {"units": 100, "unit_name": "m² green roof", "total_cost": 240000},
        "far_from_water": {"units": 1, "unit_name": "solar misting pavilion", "total_cost": 65000}
    }
    
    candidates = []
    for h in filtered:
        cause = h.get("cause", "low_vegetation")
        scale = SCALE_DEFAULTS.get(cause, SCALE_DEFAULTS["low_vegetation"])
        tier1 = h.get("tier1_recommendation", {})
        impact = tier1.get("impact_reduction_celsius", 2.0)
        heat_score = h.get("heat_score", 0.7)
        cost = scale["total_cost"]
        
        # Priority score: heat urgency * impact per rupee
        roi = (heat_score * impact * 100000) / cost
        
        candidates.append({
            "cell_id": h.get("cell_id"),
            "zone": h.get("zone"),
            "cause": cause,
            "heat_score": heat_score,
            "intervention": tier1.get("intervention"),
            "scale": f"{scale['units']} {scale['unit_name']}",
            "cost": cost,
            "impact_reduction_celsius": impact,
            "roi_score": round(roi, 2)
        })
        
    # Sort descending by ROI
    candidates.sort(key=lambda x: x["roi_score"], reverse=True)
    
    allocated = []
    current_spent = 0.0
    
    for c in candidates:
        if current_spent + c["cost"] <= total_budget:
            allocated.append(c)
            current_spent += c["cost"]
            
    avg_impact = sum(c["impact_reduction_celsius"] for c in allocated) / len(allocated) if allocated else 0.0
    
    return {
        "budget_requested": total_budget,
        "total_allocated": current_spent,
        "remaining_budget": total_budget - current_spent,
        "hotspots_treated_count": len(allocated),
        "total_available_hotspots": len(filtered),
        "estimated_avg_cooling_celsius": round(avg_impact, 2),
        "allocations": allocated
    }
