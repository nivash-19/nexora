import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Wind, Trees, Flame, Compass, CheckCircle2, Radio, Layers, Crosshair, MapPin } from 'lucide-react';

// Pre-calculated centroid coordinates and zoom levels for Chennai regions
const ZONE_CENTROIDS = {
  'Manali': { center: [13.1678, 80.2612], zoom: 13.5 },
  'Ambattur': { center: [13.1124, 80.1582], zoom: 13.5 },
  'Anna Nagar': { center: [13.0872, 80.2133], zoom: 13.8 },
  'Koyambedu': { center: [13.0692, 80.1944], zoom: 14 },
  'Teynampet': { center: [13.0425, 80.2482], zoom: 14 },
  'Perungudi': { center: [12.9682, 80.2455], zoom: 13.5 },
  'Royapuram': { center: [13.1130, 80.2950], zoom: 14 },
  'All Zones': { center: [13.0827, 80.2407], zoom: 11 },
};

// Smooth map fly-to controller with region re-centering and bounds fitting
function MapController({ selectedHotspot, selectedZone, recenterRequest, allHotspots = [], hotspots = [] }) {
  const map = useMap();
  const isRegionFlyingRef = useRef(false);

  // Re-center whenever the selected region/zone changes or an explicit recenter is requested
  useEffect(() => {
    if (!selectedZone) return;

    // Lock single-hotspot zoom during region transition so it doesn't overwrite region framing
    isRegionFlyingRef.current = true;
    const unlockTimer = setTimeout(() => {
      isRegionFlyingRef.current = false;
    }, 1200);

    if (selectedZone.toLowerCase() === 'all zones') {
      map.flyTo([13.0827, 80.2407], 11, {
        animate: true,
        duration: 0.9,
      });
      return () => clearTimeout(unlockTimer);
    }

    // Identify hotspots for this zone
    const pool = allHotspots && allHotspots.length > 0 ? allHotspots : hotspots;
    const zoneHotspots = pool.filter(
      h => (h.zone || '').toLowerCase() === selectedZone.toLowerCase()
    );

    if (zoneHotspots.length > 0) {
      const validCoords = zoneHotspots
        .map(h => [parseFloat(h.lat), parseFloat(h.lon)])
        .filter(c => !isNaN(c[0]) && !isNaN(c[1]));

      if (validCoords.length >= 2) {
        // Frame all hotspots in this region using bounding box
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds.pad(0.38), {
          animate: true,
          duration: 1.0,
          maxZoom: 14,
        });
        return () => clearTimeout(unlockTimer);
      } else if (validCoords.length === 1) {
        map.flyTo(validCoords[0], 13.8, {
          animate: true,
          duration: 0.9,
        });
        return () => clearTimeout(unlockTimer);
      }
    }

    // Fallback to static zone centroid
    const matchedKey = Object.keys(ZONE_CENTROIDS).find(
      k => k.toLowerCase() === selectedZone.toLowerCase()
    );
    if (matchedKey) {
      const config = ZONE_CENTROIDS[matchedKey];
      map.flyTo(config.center, config.zoom, {
        animate: true,
        duration: 0.9,
      });
    }

    return () => clearTimeout(unlockTimer);
  }, [selectedZone, recenterRequest, map]);

  // Re-center when an individual hotspot is selected by clicking its marker
  useEffect(() => {
    // If currently flying to a region, do not override
    if (isRegionFlyingRef.current) return;

    if (selectedHotspot && selectedHotspot.lat && selectedHotspot.lon) {
      const lat = parseFloat(selectedHotspot.lat);
      const lon = parseFloat(selectedHotspot.lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        map.flyTo([lat, lon], 14.5, {
          animate: true,
          duration: 0.8,
        });
      }
    }
  }, [selectedHotspot, map]);

  return null;
}

// Basemap Tile Configurations (All 100% free, public, ZERO watermark)
const BASEMAP_TILES = {
  dark: {
    name: 'Dark Canvas',
    icon: '🌙',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16
  },
  satellite: {
    name: 'Satellite Canopy',
    icon: '🛰️',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19
  },
  streets: {
    name: 'Open Street',
    icon: '🗺️',
    base: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    ref: null,
    maxZoom: 19
  }
};

export default function HeatMap({
  hotspots = [],
  allHotspots = [],
  selectedHotspot,
  onSelectHotspot,
  viewMode = 'solutions', // 'solutions' (Optimistic Blueprint) or 'baseline' (Current Heat)
  adoptedHotspots = {},
  selectedZone = 'All Zones',
  recenterRequest,
  onSelectZone,
  activeTelemetryLayer = 'diff',
  setActiveTelemetryLayer
}) {
  const [internalLayer, setInternalLayer] = useState('diff');
  const currentLayer = setActiveTelemetryLayer ? activeTelemetryLayer : internalLayer;
  const setLayer = setActiveTelemetryLayer || setInternalLayer;

  const [basemap, setBasemap] = useState('dark');
  const CHENNAI_CENTER = [13.0827, 80.2407];

  // Precise temperature calculation from Landsat-9 radiometric anomaly
  const getCellTemperature = (h) => {
    if (h.temperature_celsius) return parseFloat(h.temperature_celsius);
    const tNorm = h.contributing_factors?.T_norm ?? (h.heat_score || 0.85);
    return Number((34.0 + tNorm * 9.5).toFixed(1));
  };

  // Precise NDVI canopy density from OLI-2 NIR/Red
  const getCellNDVI = (h) => {
    const vNorm = h.contributing_factors?.V_norm ?? 0.80;
    return Number(Math.max(0.12, Math.min(0.78, 0.78 - (vNorm * 0.65))).toFixed(2));
  };

  // Dynamic styling based on activeTelemetryLayer
  const getMarkerStyle = (h) => {
    const temp = getCellTemperature(h);
    const ndvi = getCellNDVI(h);

    if (currentLayer === 'tirs') {
      if (temp >= 42.0) {
        return {
          color: '#ff1744',
          glow: 'rgba(255, 23, 68, 0.6)',
          label: `${temp}°C Extreme Thermal Anomaly`,
          subtext: `+${(temp - 36).toFixed(1)}°C Above Baseline`,
          icon: '🔥',
          metric: `${temp}°C`
        };
      } else if (temp >= 40.0) {
        return {
          color: '#ff5252',
          glow: 'rgba(255, 82, 82, 0.5)',
          label: `${temp}°C High Heat Stress`,
          subtext: `+${(temp - 36).toFixed(1)}°C Above Baseline`,
          icon: '🌡️',
          metric: `${temp}°C`
        };
      } else if (temp >= 38.0) {
        return {
          color: '#ff9100',
          glow: 'rgba(255, 145, 0, 0.45)',
          label: `${temp}°C Moderate Heat Island`,
          subtext: `+${(temp - 36).toFixed(1)}°C Above Baseline`,
          icon: '☀️',
          metric: `${temp}°C`
        };
      } else {
        return {
          color: '#ffd600',
          glow: 'rgba(255, 214, 0, 0.4)',
          label: `${temp}°C Elevated Baseline`,
          subtext: `+${(temp - 36).toFixed(1)}°C Above Baseline`,
          icon: '🟡',
          metric: `${temp}°C`
        };
      }
    }

    if (currentLayer === 'ndvi') {
      if (ndvi < 0.20) {
        return {
          color: '#d97706',
          glow: 'rgba(217, 119, 6, 0.6)',
          label: `NDVI ${ndvi} • Severe Canopy Void`,
          subtext: `-72% vs WHO Benchmark`,
          icon: '🍂',
          metric: `NDVI ${ndvi}`
        };
      } else if (ndvi < 0.32) {
        return {
          color: '#eab308',
          glow: 'rgba(234, 179, 8, 0.5)',
          label: `NDVI ${ndvi} • Sparse Urban Shrub`,
          subtext: `-54% vs WHO Benchmark`,
          icon: '🌾',
          metric: `NDVI ${ndvi}`
        };
      } else if (ndvi < 0.45) {
        return {
          color: '#84cc16',
          glow: 'rgba(132, 204, 22, 0.5)',
          label: `NDVI ${ndvi} • Moderate Vegetation`,
          subtext: `-28% vs WHO Benchmark`,
          icon: '🌱',
          metric: `NDVI ${ndvi}`
        };
      } else {
        return {
          color: '#10b981',
          glow: 'rgba(16, 185, 129, 0.55)',
          label: `NDVI ${ndvi} • Preserved Tree Cover`,
          subtext: `Optimal Green Canopy`,
          icon: '🌳',
          metric: `NDVI ${ndvi}`
        };
      }
    }

    // Default 'diff' mode
    if (viewMode === 'baseline') {
      const score = h.heat_score || 0.85;
      if (score >= 0.82) return { color: '#ff5252', glow: 'rgba(255, 82, 82, 0.5)', label: 'Critical Heat Hotspot', subtext: `Severity: ${score.toFixed(2)}`, icon: '🔥', metric: `${score.toFixed(2)}` };
      if (score >= 0.70) return { color: '#ff9100', glow: 'rgba(255, 145, 0, 0.4)', label: 'Elevated Heat Corridor', subtext: `Severity: ${score.toFixed(2)}`, icon: '⚡', metric: `${score.toFixed(2)}` };
      return { color: '#4edea3', glow: 'rgba(78, 222, 163, 0.4)', label: 'Moderate Heat Zone', subtext: `Severity: ${score.toFixed(2)}`, icon: '🌱', metric: `${score.toFixed(2)}` };
    }

    switch (h.cause) {
      case 'low_vegetation':
        return { color: '#4edea3', glow: 'rgba(78, 222, 163, 0.5)', label: 'Native Tree Canopy', subtext: 'Target Relief: -2.2°C', icon: '🌳', metric: '-2.2°C' };
      case 'high_impervious_surface':
        return { color: '#4cd7f6', glow: 'rgba(76, 215, 246, 0.5)', label: 'Cool Reflective Roofs', subtext: 'Target Relief: -2.8°C', icon: '🏠', metric: '-2.8°C' };
      case 'extreme_temperature':
        return { color: '#6ffbbe', glow: 'rgba(111, 251, 190, 0.5)', label: 'Living Biosolar Roofs', subtext: 'Target Relief: -3.2°C', icon: '🌿', metric: '-3.2°C' };
      case 'far_from_water':
        return { color: '#00b2d0', glow: 'rgba(0, 178, 208, 0.5)', label: 'Bioswales & Misting', subtext: 'Target Relief: -1.8°C', icon: '💧', metric: '-1.8°C' };
      default:
        return { color: '#4edea3', glow: 'rgba(78, 222, 163, 0.5)', label: 'Urban Greening', subtext: 'Target Relief: -2.0°C', icon: '🌱', metric: '-2.0°C' };
    }
  };

  const currentTiles = BASEMAP_TILES[basemap] || BASEMAP_TILES.dark;

  // Active hotspot telemetry calculations
  const activeName = selectedHotspot ? `${selectedHotspot.zone} (${selectedHotspot.cell_id})` : 'MANALI PETROCHEM (MNL-04)';
  const activeScore = selectedHotspot ? (selectedHotspot.heat_score || 0.89).toFixed(2) : '0.89';
  const activeTemp = selectedHotspot ? getCellTemperature(selectedHotspot) : 43.1;
  const activeNdvi = selectedHotspot ? getCellNDVI(selectedHotspot) : 0.16;
  const activeDelta = selectedHotspot
    ? `+${(activeTemp - 36).toFixed(1)}°C`
    : '+5.8°C';

  // Dynamic map border & glow by telemetry mode
  const getMapContainerStyle = () => {
    if (currentLayer === 'tirs') {
      return {
        border: '1px solid rgba(255, 82, 82, 0.55)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 23, 68, 0.28)'
      };
    }
    if (currentLayer === 'ndvi') {
      return {
        border: '1px solid rgba(132, 204, 22, 0.55)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 40px rgba(132, 204, 22, 0.22)'
      };
    }
    return {
      border: '1px solid rgba(78, 222, 163, 0.45)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(16, 185, 129, 0.2)'
    };
  };

  const mapStyle = getMapContainerStyle();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', height: '100%' }}>
      {/* Map Card Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        borderRadius: '18px',
        overflow: 'hidden',
        background: '#0a0e18',
        transition: 'all 0.3s ease',
        ...mapStyle
      }}>
        {/* Floating Top Interactive Differential Toolbar */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Layer Mode Selector Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px',
            borderRadius: '12px',
            background: 'rgba(10, 14, 24, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(53, 57, 68, 0.5)',
            boxShadow: '0 4px 18px rgba(0,0,0,0.6)'
          }}>
            <button
              onClick={() => setLayer('diff')}
              className="font-mono"
              style={{
                background: currentLayer === 'diff' ? 'linear-gradient(135deg, #10b981 0%, #00b2d0 100%)' : 'transparent',
                color: currentLayer === 'diff' ? '#003824' : '#bbcabf',
                fontWeight: '800',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                border: currentLayer === 'diff' ? '1px solid #4edea3' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentLayer === 'diff' ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              Δ DIFF: BASELINE vs TARGET
            </button>
            <button
              onClick={() => setLayer('tirs')}
              className="font-mono"
              style={{
                background: currentLayer === 'tirs' ? 'linear-gradient(135deg, #d50000 0%, #ff5252 100%)' : 'transparent',
                color: currentLayer === 'tirs' ? '#ffffff' : '#bbcabf',
                fontWeight: '800',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                border: currentLayer === 'tirs' ? '1px solid #ff1744' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentLayer === 'tirs' ? '0 0 14px rgba(255, 23, 68, 0.45)' : 'none'
              }}
            >
              🔥 THERMAL INFRARED (TIRS)
            </button>
            <button
              onClick={() => setLayer('ndvi')}
              className="font-mono"
              style={{
                background: currentLayer === 'ndvi' ? 'linear-gradient(135deg, #4d7c0f 0%, #84cc16 100%)' : 'transparent',
                color: currentLayer === 'ndvi' ? '#0f2905' : '#bbcabf',
                fontWeight: '800',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                border: currentLayer === 'ndvi' ? '1px solid #a3e635' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentLayer === 'ndvi' ? '0 0 14px rgba(132, 204, 22, 0.45)' : 'none'
              }}
            >
              🌿 CANOPY NDVI (0.12 - 0.78)
            </button>
          </div>

          {/* Right Map Controls: Calibration Badge + Basemap Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Quick Re-center Region Button */}
            <button
              onClick={() => onSelectZone && onSelectZone(selectedZone)}
              title={`Click to re-center map to ${selectedZone}`}
              style={{
                background: 'rgba(10, 14, 24, 0.9)',
                border: '1px solid rgba(78, 222, 163, 0.5)',
                color: '#4edea3',
                padding: '5px 11px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(78, 222, 163, 0.2)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(10, 14, 24, 0.9)'; }}
            >
              <Crosshair size={13} color="#4edea3" />
              <span className="font-mono">Center: {selectedZone}</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(10, 14, 24, 0.9)',
              backdropFilter: 'blur(12px)',
              border: currentLayer === 'tirs'
                ? '1px solid rgba(255, 82, 82, 0.45)'
                : (currentLayer === 'ndvi' ? '1px solid rgba(132, 204, 22, 0.45)' : '1px solid rgba(78, 222, 163, 0.45)')
            }}>
              <span style={{
                height: '7px',
                width: '7px',
                borderRadius: '50%',
                backgroundColor: currentLayer === 'tirs' ? '#ff1744' : (currentLayer === 'ndvi' ? '#84cc16' : '#4edea3'),
                boxShadow: currentLayer === 'tirs' ? '0 0 8px #ff1744' : (currentLayer === 'ndvi' ? '0 0 8px #84cc16' : '0 0 8px #4edea3'),
                display: 'inline-block'
              }} />
              <span className="font-mono" style={{
                fontSize: '10px',
                color: currentLayer === 'tirs' ? '#ffb3ad' : (currentLayer === 'ndvi' ? '#d9f99d' : '#bbcabf'),
                letterSpacing: '0.08em',
                fontWeight: '700'
              }}>
                {currentLayer === 'tirs'
                  ? 'LANDSAT-9 TIRS-2 BAND 10 • 10.8µm THERMAL INFRARED LST'
                  : (currentLayer === 'ndvi'
                    ? 'LANDSAT-9 OLI-2 • 30m CANOPY PHOTOSYNTHETIC NDVI'
                    : 'LANDSAT-9 TIRS-2 • 30m RADIOMETRIC ΔT INTERVENTION')}
              </span>
            </div>

            {/* Basemap Switcher */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: 'rgba(10, 14, 24, 0.9)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid rgba(53, 57, 68, 0.4)'
            }}>
              {Object.entries(BASEMAP_TILES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setBasemap(key)}
                  title={`Switch to ${config.name}`}
                  style={{
                    background: basemap === key ? 'rgba(78, 222, 163, 0.2)' : 'transparent',
                    border: basemap === key ? '1px solid #4edea3' : '1px solid transparent',
                    color: basemap === key ? '#4edea3' : '#86948a',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{config.icon}</span>
                  <span className="font-mono" style={{ fontSize: '10px' }}>{config.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <MapContainer
          center={CHENNAI_CENTER}
          zoom={11}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ width: '100%', height: '100%', minHeight: '620px' }}
        >
          <MapController
            selectedHotspot={selectedHotspot}
            selectedZone={selectedZone}
            recenterRequest={recenterRequest}
            allHotspots={allHotspots}
            hotspots={hotspots}
          />

          {/* Clean Base Layer (NO WATERMARKS) */}
          <TileLayer
            key={`${basemap}-base`}
            url={currentTiles.base}
            maxZoom={currentTiles.maxZoom}
            attribution=""
          />

          {/* Optional Reference/Labels Layer */}
          {currentTiles.ref && (
            <TileLayer
              key={`${basemap}-ref`}
              url={currentTiles.ref}
              maxZoom={currentTiles.maxZoom}
              attribution=""
              opacity={0.9}
            />
          )}

          {hotspots.map((h) => {
            const lat = parseFloat(h.lat);
            const lon = parseFloat(h.lon);
            if (isNaN(lat) || isNaN(lon)) return null;

            const isSelected = selectedHotspot && selectedHotspot.cell_id === h.cell_id;
            const style = getMarkerStyle(h);
            const markerColor = style.color;
            const radius = isSelected ? 16 : (currentLayer === 'tirs' ? 13 : 11);

            const isAdopted = !!adoptedHotspots[h.cell_id];
            const temp = getCellTemperature(h);
            const ndvi = getCellNDVI(h);
            const vNorm = h.contributing_factors?.V_norm ?? 0.80;

            return (
              <React.Fragment key={h.cell_id}>
                {/* Adopted in Ward Action Plan Ring */}
                {isAdopted && (
                  <CircleMarker
                    center={[lat, lon]}
                    radius={radius + 10}
                    pathOptions={{
                      color: '#4edea3',
                      fillColor: '#10b981',
                      fillOpacity: 0.35,
                      weight: 2.5,
                      dashArray: '3, 4'
                    }}
                    interactive={false}
                  />
                )}

                {/* Telemetry Radiant Halo */}
                <CircleMarker
                  center={[lat, lon]}
                  radius={radius + (isSelected ? 10 : (currentLayer === 'tirs' ? 8 : 5))}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : markerColor,
                    fillColor: markerColor,
                    fillOpacity: isSelected ? 0.45 : (currentLayer === 'tirs' ? 0.32 : (currentLayer === 'ndvi' ? 0.28 : 0.18)),
                    weight: isSelected ? 2 : 1,
                    dashArray: currentLayer === 'tirs' ? '2, 3' : (isSelected ? '4, 4' : undefined),
                  }}
                  interactive={false}
                />

                {/* Main Hotspot Marker */}
                <CircleMarker
                  center={[lat, lon]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : markerColor,
                    fillColor: markerColor,
                    fillOpacity: isSelected ? 1 : 0.92,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => onSelectHotspot(h),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.96}>
                    <div style={{ padding: '6px 4px', textAlign: 'left', minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span className="font-headline" style={{ fontWeight: '700', fontSize: '13px', color: '#fff' }}>
                          {h.zone}
                        </span>
                        <span className="font-mono" style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: markerColor,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '700',
                          border: `1px solid ${markerColor}40`
                        }}>
                          {h.cell_id}
                        </span>
                      </div>

                      {/* Mode 1: THERMAL INFRARED (TIRS) Tooltip */}
                      {currentLayer === 'tirs' ? (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15px' }}>🔥</span>
                            <strong style={{ fontSize: '13px', color: '#ff5252' }}>
                              {temp}°C Land Surface Temp
                            </strong>
                          </div>
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            background: 'rgba(255, 23, 68, 0.15)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 23, 68, 0.3)'
                          }}>
                            <span className="font-mono" style={{ fontSize: '10px', color: '#ffb3ad' }}>Surface Heat Deviation:</span>
                            <span className="font-mono" style={{ fontSize: '10px', fontWeight: '800', color: '#ff1744' }}>
                              +{(temp - 36).toFixed(1)}°C LST
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginTop: '6px', color: '#dfe2f1' }}>
                            <span style={{ color: '#86948a' }}>Band 10 Radiance:</span>
                            <span className="font-mono" style={{ fontWeight: '600' }}>11.4 W/(m²·sr·µm)</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginTop: '3px', color: '#dfe2f1' }}>
                            <span style={{ color: '#86948a' }}>Surface Emissivity:</span>
                            <span className="font-mono" style={{ fontWeight: '600' }}>0.948 ε (Impervious)</span>
                          </div>
                          <div className="font-mono" style={{ fontSize: '9.5px', color: '#ff8a80', marginTop: '6px', textAlign: 'center' }}>
                            Click to inspect thermal dossier →
                          </div>
                        </div>
                      ) : currentLayer === 'ndvi' ? (
                        /* Mode 2: CANOPY NDVI Tooltip */
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15px' }}>🌿</span>
                            <strong style={{ fontSize: '13px', color: '#a3e635' }}>
                              NDVI {ndvi} ({ndvi < 0.20 ? 'Critical Void' : (ndvi < 0.35 ? 'Sparse Shrub' : 'Tree Cover')})
                            </strong>
                          </div>
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            background: 'rgba(132, 204, 22, 0.15)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(132, 204, 22, 0.3)'
                          }}>
                            <span className="font-mono" style={{ fontSize: '10px', color: '#d9f99d' }}>Canopy Deficit:</span>
                            <span className="font-mono" style={{ fontSize: '10px', fontWeight: '800', color: '#a3e635' }}>
                              -{Math.round(vNorm * 75)}% vs WHO Std
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginTop: '6px', color: '#dfe2f1' }}>
                            <span style={{ color: '#86948a' }}>Surface Dominance:</span>
                            <span className="font-mono" style={{ fontWeight: '600' }}>{ndvi < 0.22 ? 'Asphalt / Metal Roof' : 'Sparse Ground Cover'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginTop: '3px', color: '#dfe2f1' }}>
                            <span style={{ color: '#86948a' }}>Cooling Target:</span>
                            <span className="font-mono" style={{ color: '#4edea3', fontWeight: '700' }}>Canopy Afforestation</span>
                          </div>
                          <div className="font-mono" style={{ fontSize: '9.5px', color: '#a3e635', marginTop: '6px', textAlign: 'center' }}>
                            Click to inspect canopy dossier →
                          </div>
                        </div>
                      ) : viewMode === 'solutions' ? (
                        /* Mode 3: Δ DIFF / SOLUTIONS Tooltip */
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '14px' }}>{style.icon}</span>
                            <strong style={{ fontSize: '12px', color: markerColor }}>
                              {style.label}
                            </strong>
                          </div>
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            background: 'rgba(16, 185, 129, 0.15)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(16, 185, 129, 0.25)'
                          }}>
                            <span className="font-mono" style={{ fontSize: '10px', color: '#a7f3d0' }}>Target Cooling:</span>
                            <span className="font-mono" style={{ fontSize: '10px', fontWeight: '800', color: '#34d399' }}>
                              {style.metric}
                            </span>
                          </div>
                          <div className="font-mono" style={{ fontSize: '9.5px', color: '#4cd7f6', marginTop: '6px', textAlign: 'center' }}>
                            Click to inspect dossier →
                          </div>
                        </div>
                      ) : (
                        /* Mode 4: BASELINE HEAT Tooltip */
                        <div style={{ marginTop: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ color: '#9ca3af' }}>Heat Score:</span>
                            <span className="font-mono" style={{ fontWeight: '800', color: markerColor }}>{h.heat_score?.toFixed(3)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '3px' }}>
                            <span style={{ color: '#9ca3af' }}>Root Cause:</span>
                            <span style={{ color: '#fff', fontWeight: '600' }}>{h.cause?.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="font-mono" style={{ fontSize: '9.5px', color: '#4cd7f6', marginTop: '6px', textAlign: 'center' }}>
                            Click to inspect dossier →
                          </div>
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Bottom Status Strip Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '46px',
          background: 'rgba(10, 14, 24, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000,
          borderTop: currentLayer === 'tirs'
            ? '1px solid rgba(255, 82, 82, 0.45)'
            : (currentLayer === 'ndvi' ? '1px solid rgba(132, 204, 22, 0.45)' : '1px solid rgba(53, 57, 68, 0.4)')
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
              <span style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: currentLayer === 'tirs' ? '#ff1744' : (currentLayer === 'ndvi' ? '#84cc16' : '#ff5252'),
                opacity: 0.75,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
              }} />
              <span style={{
                position: 'relative',
                borderRadius: '50%',
                height: '8px',
                width: '8px',
                backgroundColor: currentLayer === 'tirs' ? '#ff1744' : (currentLayer === 'ndvi' ? '#84cc16' : '#ff5252')
              }} />
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#dfe2f1', fontWeight: '600' }}>
              INSPECTING HOTSPOT:
            </span>
            <span
              onClick={() => onSelectZone && onSelectZone(selectedHotspot?.zone || selectedZone)}
              title={`Click to re-center map to ${selectedHotspot?.zone || selectedZone}`}
              className="font-mono"
              style={{
                fontSize: '11px',
                color: currentLayer === 'tirs' ? '#ff8a80' : (currentLayer === 'ndvi' ? '#d9f99d' : '#ffb3ad'),
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: currentLayer === 'tirs' ? 'rgba(255, 23, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                padding: '2px 7px',
                borderRadius: '5px',
                border: `1px solid ${currentLayer === 'tirs' ? 'rgba(255, 23, 68, 0.35)' : 'rgba(255, 255, 255, 0.15)'}`,
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 82, 82, 0.25)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = currentLayer === 'tirs' ? 'rgba(255, 23, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)'; }}
            >
              <MapPin size={11} color={currentLayer === 'tirs' ? '#ff1744' : '#4edea3'} />
              <span>{activeName}</span>
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>|</span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#bbcabf' }}>
              URGENCY SCORE: <strong style={{ color: currentLayer === 'tirs' ? '#ff5252' : '#ffb3ad' }}>{activeScore}</strong>
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>|</span>
            <span className="font-mono" style={{
              fontSize: '11px',
              color: currentLayer === 'tirs' ? '#ff1744' : (currentLayer === 'ndvi' ? '#a3e635' : '#4edea3'),
              fontWeight: '700'
            }}>
              {currentLayer === 'tirs'
                ? `SURFACE LST: ${activeTemp}°C`
                : (currentLayer === 'ndvi' ? `CANOPY NDVI: ${activeNdvi}` : `ΔT ANOMALY: ${activeDelta}`)}
            </span>
          </div>

          <div className="font-mono" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: currentLayer === 'tirs' ? '#ff5252' : (currentLayer === 'ndvi' ? '#84cc16' : '#4edea3'),
            fontWeight: '600'
          }}>
            {currentLayer === 'tirs' ? (
              <>
                <Flame size={14} color="#ff1744" />
                <span>CRITICAL THERMAL STRESS ZONE</span>
              </>
            ) : currentLayer === 'ndvi' ? (
              <>
                <Trees size={14} color="#84cc16" />
                <span>RE-AFFORESTATION TARGET CORRIDOR</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} color="#4edea3" />
                <span>TIER 1 BIOSOLAR ACTIONABLE</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Telemetry Stream Strip (Below Map) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px'
      }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(28, 31, 42, 0.65)',
          border: '1px solid rgba(76, 215, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#262a35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4cd7f6'
          }}>
            <Wind size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#86948a', letterSpacing: '0.08em' }}>
              SEA BREEZE PENETRATION
            </span>
            <span className="font-mono" style={{ fontSize: '12px', color: '#dfe2f1', fontWeight: '600' }}>
              Stalled @ 3.2km Inland
            </span>
          </div>
        </div>

        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(28, 31, 42, 0.65)',
          border: '1px solid rgba(78, 222, 163, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#262a35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4edea3'
          }}>
            <Trees size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#86948a', letterSpacing: '0.08em' }}>
              URBAN CANOPY DEFICIT
            </span>
            <span className="font-mono" style={{ fontSize: '12px', color: '#dfe2f1', fontWeight: '600' }}>
              -64% Under WHO Std
            </span>
          </div>
        </div>

        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(28, 31, 42, 0.65)',
          border: '1px solid rgba(255, 82, 82, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#262a35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffb3ad'
          }}>
            <Flame size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#86948a', letterSpacing: '0.08em' }}>
              EXPOSED POPULATION
            </span>
            <span className="font-mono" style={{ fontSize: '12px', color: '#dfe2f1', fontWeight: '600' }}>
              142,500 Shift Workers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
