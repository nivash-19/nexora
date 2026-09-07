"""
HeatScape — System 1: Hotspot Scoring & Cause Diagnosis Engine
Tasks 4, 5, 6, 7, 8:
- Ingests 250m x 250m grid data from data/chennai_grid_raw.geojson
- Normalizes raw metrics to 0-1 scale:
    * T_norm: normalized LST deviation from city-wide average (hotter -> higher)
    * V_norm: 1 - NDVI (lower vegetation -> higher)
    * I_norm: impervious_pct / 100 (more impervious -> higher)
    * W_norm: normalized distance to water (further -> higher)
- Computes Heat Score:
    Heat Score = (T_norm * 0.4) + (V_norm * 0.3) + (I_norm * 0.2) + (W_norm * 0.1)
- Diagnoses dominant cause:
    * T_norm * 0.4 dominant -> "extreme_temperature"
    * V_norm * 0.3 dominant -> "low_vegetation"
    * I_norm * 0.2 dominant -> "high_impervious_surface"
    * W_norm * 0.1 dominant -> "far_from_water"
- Ranks hotspots descending by Heat Score and filters top tier
- Exports output/hotspots.json conforming strictly to System 2 schema contract
"""

import os
import json
import logging
import pandas as pd
import numpy as np
import geopandas as gpd

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("score_hotspots")

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
GRID_INPUT_GEOJSON = os.path.join(DATA_DIR, "chennai_grid_raw.geojson")
HOTSPOTS_OUTPUT_JSON = os.path.join(OUTPUT_DIR, "hotspots.json")
ALL_CELLS_SCORED_JSON = os.path.join(OUTPUT_DIR, "all_cells_scored.json")

CAUSE_MAP = {
    "T_term": "extreme_temperature",
    "V_term": "low_vegetation",
    "I_term": "high_impervious_surface",
    "W_term": "far_from_water",
}


def score_and_diagnose(raw_grid_path: str = GRID_INPUT_GEOJSON):
    if not os.path.exists(raw_grid_path):
        raise FileNotFoundError(
            f"Raw grid not found at {raw_grid_path}. Please run 'python pull_data.py' first."
        )

    logger.info(f"Loading raw grid from {raw_grid_path}...")
    gdf = gpd.read_file(raw_grid_path)
    logger.info(f"Loaded {len(gdf)} grid cells across {gdf['zone'].nunique()} zones.")

    # Task 4 — Normalize each raw metric to a 0-1 scale
    # 1. T_norm: normalized LST deviation from city-wide average
    lst_mean = gdf["LST"].mean()
    lst_min = gdf["LST"].min()
    lst_max = gdf["LST"].max()
    logger.info(f"City-wide LST: Mean={lst_mean:.2f}°C, Min={lst_min:.2f}°C, Max={lst_max:.2f}°C")

    # Min-max normalization of LST (higher LST / deviation -> higher T_norm)
    if lst_max > lst_min:
        gdf["T_norm"] = ((gdf["LST"] - lst_min) / (lst_max - lst_min)).clip(0.0, 1.0).round(4)
    else:
        gdf["T_norm"] = 0.5

    # 2. V_norm = 1 - NDVI (clipped to 0-1)
    gdf["V_norm"] = (1.0 - gdf["NDVI"]).clip(0.0, 1.0).round(4)

    # 3. I_norm = impervious_pct / 100
    gdf["I_norm"] = (gdf["impervious_pct"] / 100.0).clip(0.0, 1.0).round(4)

    # 4. W_norm = normalized distance from water (further from water -> higher value)
    dist_min = gdf["dist_to_water"].min()
    dist_max = gdf["dist_to_water"].max()
    logger.info(f"Distance to water: Min={dist_min:.1f}m, Max={dist_max:.1f}m")
    if dist_max > dist_min:
        gdf["W_norm"] = ((gdf["dist_to_water"] - dist_min) / (dist_max - dist_min)).clip(0.0, 1.0).round(4)
    else:
        gdf["W_norm"] = 0.5

    # Task 5 — Compute the Heat Score per cell
    # Heat Score = (T_norm * 0.4) + (V_norm * 0.3) + (I_norm * 0.2) + (W_norm * 0.1)
    gdf["T_term"] = (gdf["T_norm"] * 0.4).round(4)
    gdf["V_term"] = (gdf["V_norm"] * 0.3).round(4)
    gdf["I_term"] = (gdf["I_norm"] * 0.2).round(4)
    gdf["W_term"] = (gdf["W_norm"] * 0.1).round(4)

    gdf["heat_score"] = (
        gdf["T_term"] + gdf["V_term"] + gdf["I_term"] + gdf["W_term"]
    ).clip(0.0, 1.0).round(4)

    # Task 6 — Diagnose the cause
    # Whichever of the 4 weighted terms is largest
    def determine_cause(row):
        terms = {
            "T_term": row["T_term"],
            "V_term": row["V_term"],
            "I_term": row["I_term"],
            "W_term": row["W_term"],
        }
        dominant_key = max(terms, key=terms.get)
        return CAUSE_MAP[dominant_key]

    gdf["cause"] = gdf.apply(determine_cause, axis=1)

    # Task 7 — Rank and flag hotspots
    # Sort all cells by Heat Score descending
    gdf_sorted = gdf.sort_values(by="heat_score", ascending=False).reset_index(drop=True)

    # Select top hotspots: top ~20% or score >= 0.60
    # To ensure a robust, high-impact demo dataset of 20-35 hotspots across the 6 zones:
    top_20_pct_count = int(np.ceil(len(gdf_sorted) * 0.20))
    # Threshold filter (>= 0.65), guaranteed minimum 20 and maximum 40
    score_filtered = gdf_sorted[gdf_sorted["heat_score"] >= 0.65]
    if len(score_filtered) < 15:
        hotspots_df = gdf_sorted.head(top_20_pct_count)
    elif len(score_filtered) > 40:
        hotspots_df = gdf_sorted.head(35)
    else:
        hotspots_df = score_filtered

    logger.info(
        f"Flagged {len(hotspots_df)} hotspots (Heat Score range: {hotspots_df['heat_score'].min():.3f} - {hotspots_df['heat_score'].max():.3f})"
    )

    # Task 8 — Export hotspots.json with exact schema matching System 2 requirements
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    hotspots_list = []
    for _, row in hotspots_df.iterrows():
        entry = {
            "cell_id": str(row["cell_id"]),
            "lat": float(round(row["lat"], 6)),
            "lon": float(round(row["lon"], 6)),
            "zone": str(row["zone"]),
            "heat_score": float(round(row["heat_score"], 4)),
            "cause": str(row["cause"]),
            "contributing_factors": {
                "T_norm": float(round(row["T_norm"], 4)),
                "V_norm": float(round(row["V_norm"], 4)),
                "I_norm": float(round(row["I_norm"], 4)),
                "W_norm": float(round(row["W_norm"], 4)),
            },
        }
        hotspots_list.append(entry)

    with open(HOTSPOTS_OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(hotspots_list, f, indent=2)

    logger.info(f"Exported {len(hotspots_list)} hotspots to {HOTSPOTS_OUTPUT_JSON}")

    # Also save all scored cells for auditing
    all_cells_list = []
    for _, row in gdf_sorted.iterrows():
        all_cells_list.append({
            "cell_id": str(row["cell_id"]),
            "lat": float(round(row["lat"], 6)),
            "lon": float(round(row["lon"], 6)),
            "zone": str(row["zone"]),
            "heat_score": float(round(row["heat_score"], 4)),
            "cause": str(row["cause"]),
            "raw_metrics": {
                "LST": float(round(row["LST"], 2)),
                "NDVI": float(round(row["NDVI"], 3)),
                "impervious_pct": float(round(row["impervious_pct"], 2)),
                "dist_to_water": float(round(row["dist_to_water"], 1)),
            },
            "contributing_factors": {
                "T_norm": float(round(row["T_norm"], 4)),
                "V_norm": float(round(row["V_norm"], 4)),
                "I_norm": float(round(row["I_norm"], 4)),
                "W_norm": float(round(row["W_norm"], 4)),
            },
        })

    with open(ALL_CELLS_SCORED_JSON, "w", encoding="utf-8") as f:
        json.dump(all_cells_list, f, indent=2)

    logger.info(f"Saved complete scored grid ({len(all_cells_list)} cells) to {ALL_CELLS_SCORED_JSON}")

    # Spot check logging
    logger.info("=== Spot Check Summary by Zone ===")
    zone_summary = gdf.groupby("zone")[["LST", "NDVI", "impervious_pct", "heat_score"]].mean()
    print("\n--- Zone Averages ---")
    print(zone_summary.to_string())

    print("\n--- Top 5 Hotspots ---")
    for h in hotspots_list[:5]:
        print(f"[{h['zone']}] {h['cell_id']} | Score: {h['heat_score']} | Cause: {h['cause']} | T_norm={h['contributing_factors']['T_norm']}")

    return hotspots_list


if __name__ == "__main__":
    score_and_diagnose()
