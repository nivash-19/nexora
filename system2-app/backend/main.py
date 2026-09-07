"""
FastAPI Backend — HeatScape System 2
Exposes endpoints for hotspot inspection, Tier 1 verified recommendations,
Tier 2 AI suggestions (Gemini Pro), and budget optimization.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from tier1 import attach_tier1
from tier2 import generate_tier2_recommendations
from data_loader import load_hotspots_raw, get_data_source_status
from optimizer import optimize_budget_allocation

app = FastAPI(
    title="HeatScape API — System 2",
    description="Urban Heat Island hotspot diagnostics, Tier 1 verified cooling interventions, and Tier 2 Gemini AI recommendations for Chennai.",
    version="1.0.0"
)

# Enable CORS for all origins (local dev + deployed Vercel frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BudgetRequest(BaseModel):
    budget: float = Field(..., description="Total budget in INR (e.g. 500000)", example=500000)
    zone: Optional[str] = Field(None, description="Optional Chennai zone name filter (e.g. 'Manali')")

@app.get("/")
def root():
    return {
        "service": "HeatScape System 2 API",
        "status": "online",
        "city": "Chennai",
        "endpoints": [
            "/api/hotspots",
            "/api/grid/{id}",
            "/api/tier2/{grid_id}",
            "/api/optimize-budget",
            "/api/health"
        ]
    }

@app.get("/api/health")
def health_check():
    status = get_data_source_status()
    raw = load_hotspots_raw()
    return {
        "status": "healthy",
        "hotspots_count": len(raw),
        "data_source": status
    }

@app.get("/api/hotspots")
def get_all_hotspots(zone: Optional[str] = None):
    """
    Returns all hotspots enriched with heat_score, cause, and verified Tier 1 recommendations.
    """
    raw_hotspots = load_hotspots_raw()
    if not raw_hotspots:
        return []
    
    enriched = [attach_tier1(h) for h in raw_hotspots]
    
    if zone:
        enriched = [h for h in enriched if h.get("zone", "").lower() == zone.lower()]
        
    return enriched

@app.get("/api/grid/{grid_id}")
def get_single_grid_cell(grid_id: str):
    """
    Returns full detail for a single cell by its cell_id.
    """
    raw_hotspots = load_hotspots_raw()
    matching = None
    for h in raw_hotspots:
        if h.get("cell_id", "").lower() == grid_id.lower():
            matching = h
            break
            
    if not matching:
        raise HTTPException(
            status_code=404,
            detail=f"Hotspot cell '{grid_id}' not found."
        )
        
    return attach_tier1(matching)

@app.get("/api/tier2/{grid_id}")
def get_tier2_recommendations_endpoint(grid_id: str):
    """
    Triggers Gemini Pro call (with localized fallback) to generate Tier 2 creative cooling ideas
    for the specified hotspot cell. Strictly maps ideas to Tier 1 cost categories.
    """
    raw_hotspots = load_hotspots_raw()
    matching = None
    for h in raw_hotspots:
        if h.get("cell_id", "").lower() == grid_id.lower():
            matching = h
            break
            
    if not matching:
        raise HTTPException(
            status_code=404,
            detail=f"Hotspot cell '{grid_id}' not found."
        )
        
    return generate_tier2_recommendations(matching)

@app.post("/api/optimize-budget")
def optimize_budget_endpoint(req: BudgetRequest):
    """
    Calculates cost-effective intervention allocation across hotspots for a municipal budget.
    """
    raw_hotspots = load_hotspots_raw()
    enriched = [attach_tier1(h) for h in raw_hotspots]
    
    return optimize_budget_allocation(
        hotspots=enriched,
        total_budget=req.budget,
        zone=req.zone
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
