"""
HeatScape — Live Microclimate Telemetry Engine
Pulls real-time atmospheric and solar irradiance data for Chennai from Open-Meteo
and dynamically computes localized cell-level Land Surface Temperature (LST)
based on solar flux, impervious albedo, and canopy cover.
"""

import json
import time
import logging
import urllib.request
import urllib.error
from datetime import datetime, timezone
from typing import Dict, Any, Optional

logger = logging.getLogger("telemetry")

CHENNAI_LAT = 13.0827
CHENNAI_LON = 80.2707
CACHE_TTL_SECONDS = 90  # 1.5 minutes cache to prevent redundant API thrashing

_TELEMETRY_CACHE: Dict[str, Any] = {
    "data": None,
    "timestamp": 0.0
}

WMO_WEATHER_CODES = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Heavy Thunderstorm with Hail",
}


def _get_weather_condition(code: int) -> str:
    return WMO_WEATHER_CODES.get(code, "Clear / High Solar Irradiance")


def fetch_from_open_meteo() -> Dict[str, Any]:
    """Fetch live meteorological and solar data for Chennai from Open-Meteo."""
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={CHENNAI_LAT}&longitude={CHENNAI_LON}&"
        f"current=temperature_2m,relative_humidity_2m,apparent_temperature,"
        f"direct_normal_irradiance,surface_pressure,wind_speed_10m,weather_code"
    )

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "HeatScape-Nexora/3.4 (Chennai-Urban-Heat-Mitigation)"}
    )

    with urllib.request.urlopen(req, timeout=5) as response:
        if response.status != 200:
            raise RuntimeError(f"Open-Meteo returned status {response.status}")
        raw = json.loads(response.read().decode("utf-8"))

    current = raw.get("current", {})
    weather_code = int(current.get("weather_code", 0))

    return {
        "is_live": True,
        "source": "Open-Meteo Real-Time Telemetry API",
        "station_city": "Chennai, Tamil Nadu",
        "latitude": CHENNAI_LAT,
        "longitude": CHENNAI_LON,
        "temperature_2m": float(current.get("temperature_2m", 34.5)),
        "apparent_temperature": float(current.get("apparent_temperature", 38.5)),
        "relative_humidity_2m": float(current.get("relative_humidity_2m", 50)),
        "direct_normal_irradiance": float(current.get("direct_normal_irradiance", 650.0)),
        "surface_pressure": float(current.get("surface_pressure", 1006.0)),
        "wind_speed_10m": float(current.get("wind_speed_10m", 3.0)),
        "weather_code": weather_code,
        "weather_condition": _get_weather_condition(weather_code),
        "synced_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "synced_timestamp": time.time(),
    }


def get_offline_fallback() -> Dict[str, Any]:
    """Climatological fallback if network is completely unreachable."""
    return {
        "is_live": False,
        "source": "Chennai Climatological Baseline (Offline Mode)",
        "station_city": "Chennai, Tamil Nadu",
        "latitude": CHENNAI_LAT,
        "longitude": CHENNAI_LON,
        "temperature_2m": 35.0,
        "apparent_temperature": 39.5,
        "relative_humidity_2m": 55,
        "direct_normal_irradiance": 680.0,
        "surface_pressure": 1007.5,
        "wind_speed_10m": 3.2,
        "weather_code": 0,
        "weather_condition": "Peak Solar Irradiance (Clear)",
        "synced_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "synced_timestamp": time.time(),
    }


def get_live_telemetry(force_refresh: bool = False) -> Dict[str, Any]:
    """
    Get live Chennai telemetry, using 90-second cache unless force_refresh=True.
    """
    global _TELEMETRY_CACHE

    now = time.time()
    cached_data = _TELEMETRY_CACHE.get("data")
    cached_time = _TELEMETRY_CACHE.get("timestamp", 0.0)

    if not force_refresh and cached_data and (now - cached_time < CACHE_TTL_SECONDS):
        return cached_data

    try:
        telemetry = fetch_from_open_meteo()
        _TELEMETRY_CACHE["data"] = telemetry
        _TELEMETRY_CACHE["timestamp"] = now
        logger.info(f"Live telemetry refreshed: {telemetry['temperature_2m']}°C, {telemetry['direct_normal_irradiance']} W/m²")
        return telemetry
    except Exception as e:
        logger.warning(f"Unable to fetch live telemetry: {e}. Using cached/fallback.")
        if cached_data:
            return cached_data
        fallback = get_offline_fallback()
        _TELEMETRY_CACHE["data"] = fallback
        _TELEMETRY_CACHE["timestamp"] = now
        return fallback


def compute_live_cell_temperature(
    hotspot: Dict[str, Any],
    telemetry: Optional[Dict[str, Any]] = None
) -> float:
    """
    Computes cell-level Land Surface Temperature (LST) dynamically based on live solar flux,
    ambient air temperature, and the cell's physical impervious vs vegetation characteristics.
    
    Thermodynamics:
    - Base ambient air temperature (T_amb).
    - Direct Solar Irradiance (S in W/m²): Standard clear day in Chennai ~750 W/m².
    - High impervious fraction (asphalt/concrete roofs) absorbs radiation:
      delta_solar = (S / 700.0) * (2.2 + 8.2 * I_norm - 3.8 * (1.0 - V_norm))
    - Adds localized thermal anomaly (T_norm) from petrochemical/industrial waste heat.
    """
    if not telemetry:
        telemetry = get_live_telemetry()

    ambient_temp = float(telemetry.get("temperature_2m", 34.5))
    solar_flux = float(telemetry.get("direct_normal_irradiance", 650.0))

    factors = hotspot.get("contributing_factors", {})
    t_norm = float(factors.get("T_norm", 0.80))
    v_norm = float(factors.get("V_norm", 0.80))
    i_norm = float(factors.get("I_norm", 0.80))

    # Solar irradiance scaling factor (clamped between 0.35 for cloudy and 1.35 for intense direct sun)
    solar_ratio = max(0.35, min(1.35, solar_flux / 700.0))

    # Surface radiative heating delta based on material characteristics:
    # High impervious (I_norm) absorbs heat; high vegetation (low V_norm) dissipates heat via evapotranspiration
    surface_heating = solar_ratio * (2.0 + (8.5 * i_norm) - (4.0 * (1.0 - v_norm)))

    # Industrial/anthropogenic heat contribution (Manali / Ambattur foundries)
    anthropogenic_boost = t_norm * 2.2

    lst = ambient_temp + surface_heating + anthropogenic_boost

    # Realistic urban heat island boundary for Chennai (33.5°C to 47.5°C)
    clamped_lst = round(max(33.5, min(47.5, lst)), 1)
    return clamped_lst
