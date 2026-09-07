"""
Automated Test Suite for HeatScape System 2 Backend
Validates all endpoints, Tier 1 matching, Tier 2 cost mapping & fallback, and Budget Optimizer.
"""

from fastapi.testclient import TestClient
from main import app
from data_loader import load_hotspots_raw, get_data_source_status

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "HeatScape System 2 API"
    print("PASS: Root endpoint")

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["hotspots_count"] > 0
    print(f"PASS: Health check ({data['hotspots_count']} hotspots loaded, using_real_system1_data={data['data_source']['using_real_system1_data']})")

def test_get_hotspots():
    response = client.get("/api/hotspots")
    assert response.status_code == 200
    hotspots = response.json()
    assert len(hotspots) > 0
    for h in hotspots:
        assert "cell_id" in h
        assert "heat_score" in h
        assert "cause" in h
        assert "tier1_recommendation" in h
        t1 = h["tier1_recommendation"]
        assert t1["verified"] is True
        assert t1["tier"] == 1
        assert "cost_display" in t1
        assert "impact_display" in t1
        assert "intervention" in t1
    print(f"PASS: /api/hotspots verified for {len(hotspots)} items with Tier 1")

def test_get_hotspots_zone_filter():
    raw = load_hotspots_raw()
    target_zone = raw[0].get("zone", "Manali")
    expected_count = len([h for h in raw if h.get("zone", "").lower() == target_zone.lower()])
    
    response = client.get(f"/api/hotspots?zone={target_zone}")
    assert response.status_code == 200
    hotspots = response.json()
    assert len(hotspots) == expected_count
    for h in hotspots:
        assert h["zone"].lower() == target_zone.lower()
    print(f"PASS: /api/hotspots?zone={target_zone} returned {len(hotspots)} hotspots")

def test_get_single_grid_cell():
    raw = load_hotspots_raw()
    target_id = raw[0]["cell_id"]
    response = client.get(f"/api/grid/{target_id}")
    assert response.status_code == 200
    cell = response.json()
    assert cell["cell_id"] == target_id
    assert "tier1_recommendation" in cell
    print(f"PASS: /api/grid/{target_id} full detail verified")

def test_get_single_grid_cell_404():
    response = client.get("/api/grid/CHN-NONEXISTENT-9999")
    assert response.status_code == 404
    print("PASS: /api/grid/404 handled gracefully")

def test_get_tier2_recommendations():
    raw = load_hotspots_raw()
    target_id = raw[0]["cell_id"]
    response = client.get(f"/api/tier2/{target_id}")
    assert response.status_code == 200
    tier2 = response.json()
    assert tier2["cell_id"] == target_id
    assert tier2["badge"] == "AI-suggested, estimated"
    assert tier2["tier"] == 2
    assert "ideas" in tier2
    assert len(tier2["ideas"]) >= 2
    for idea in tier2["ideas"]:
        assert idea["badge"] == "AI-suggested, estimated"
        assert "mapped_cost" in idea
        mc = idea["mapped_cost"]
        assert "cost_display" in mc
        assert "est_impact" in mc
        assert "cost_mapping_rule" in mc
    print(f"PASS: /api/tier2/{target_id} returned {len(tier2['ideas'])} AI ideas mapped to Tier 1 cost")

def test_optimize_budget():
    payload = {"budget": 500000, "zone": None}
    response = client.post("/api/optimize-budget", json=payload)
    assert response.status_code == 200
    result = response.json()
    assert result["budget_requested"] == 500000
    assert result["total_allocated"] <= 500000
    assert result["hotspots_treated_count"] > 0
    assert len(result["allocations"]) == result["hotspots_treated_count"]
    print(f"PASS: /api/optimize-budget allocated INR {result['total_allocated']:,} across {result['hotspots_treated_count']} hotspots")

if __name__ == "__main__":
    print("\n--- RUNNING BACKEND TESTS ---")
    test_root()
    test_health()
    test_get_hotspots()
    test_get_hotspots_zone_filter()
    test_get_single_grid_cell()
    test_get_single_grid_cell_404()
    test_get_tier2_recommendations()
    test_optimize_budget()
    print("\n>>> ALL BACKEND TESTS PASSED! <<<\n")
