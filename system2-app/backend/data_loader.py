"""
Hotspots Data Loader
Checks for real System 1 data in `system1-data-diagnosis/output/hotspots.json`.
If not yet present, seamlessly loads `backend/data/mock_hotspots.json`.
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Any

CURRENT_DIR = Path(__file__).parent
SYSTEM1_PATH = CURRENT_DIR.parent.parent / "system1-data-diagnosis" / "output" / "hotspots.json"
MOCK_DATA_PATH = CURRENT_DIR / "data" / "mock_hotspots.json"

def load_hotspots_raw() -> List[Dict[str, Any]]:
    """Load hotspots from System 1 output if available, else from mock file."""
    # Check if real System 1 file exists and is non-empty
    if SYSTEM1_PATH.exists() and SYSTEM1_PATH.is_file():
        try:
            with open(SYSTEM1_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception:
            pass  # Fall back to mock data if corrupt or partial

    # Fallback to local mock data
    if MOCK_DATA_PATH.exists():
        with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    return []

def get_data_source_status() -> Dict[str, Any]:
    """Report current data source state (Real System 1 vs Mock)."""
    has_system1 = SYSTEM1_PATH.exists() and SYSTEM1_PATH.is_file()
    return {
        "using_real_system1_data": has_system1,
        "system1_path": str(SYSTEM1_PATH),
        "mock_data_path": str(MOCK_DATA_PATH)
    }
