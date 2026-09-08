import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Wind, Trees, Flame, Compass, CheckCircle2, Radio, Layers } from 'lucide-react';

// Smooth map fly-to controller
function MapController({ selectedHotspot }) {
  const map = useMap();

  useEffect(() => {
    if (selectedHotspot && selectedHotspot.lat && selectedHotspot.lon) {
      const lat = parseFloat(selectedHotspot.lat);
      const lon = parseFloat(selectedHotspot.lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        map.flyTo([lat, lon], 14, {
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
  selectedHotspot,
  onSelectHotspot,
  viewMode = 'solutions' // 'solutions' (Optimistic Blueprint) or 'baseline' (Current Heat)
}) {
  const [basemap, setBasemap] = useState('dark');
  const [activeTelemetryLayer, setActiveTelemetryLayer] = useState('diff'); // 'diff' | 'tirs' | 'ndvi'
  const CHENNAI_CENTER = [13.0827, 80.2407];

  // Optimistic solution coloring: maps intervention category to vibrant cooling colors
  const getSolutionColor = (cause) => {
    switch (cause) {
      case 'low_vegetation':
        return { color: '#4edea3', label: 'Native Tree Canopy', impact: '-2.2°C', icon: '🌳' };
      case 'high_impervious_surface':
        return { color: '#4cd7f6', label: 'Cool Reflective Roofs', impact: '-2.8°C', icon: '🏠' };
      case 'extreme_temperature':
        return { color: '#6ffbbe', label: 'Living Biosolar Roofs', impact: '-3.2°C', icon: '🌿' };
      case 'far_from_water':
        return { color: '#00b2d0', label: 'Bioswales & Misting', impact: '-1.8°C', icon: '💧' };
      default:
        return { color: '#4edea3', label: 'Urban Greening', impact: '-2.0°C', icon: '🌱' };
    }
  };

  // Baseline heat coloring
  const getBaselineColor = (score) => {
    if (score >= 0.82) return '#ff5252';
    if (score >= 0.70) return '#ff9100';
    return '#4edea3';
  };

  const currentTiles = BASEMAP_TILES[basemap] || BASEMAP_TILES.dark;

  // Active hotspot telemetry calculations
  const activeName = selectedHotspot ? `${selectedHotspot.zone} (${selectedHotspot.cell_id})` : 'MANALI PETROCHEM (MNL-04)';
  const activeScore = selectedHotspot ? (selectedHotspot.heat_score || 0.89).toFixed(2) : '0.89';
  const activeDelta = selectedHotspot
    ? `+${((selectedHotspot.temperature_celsius || 42) - 36).toFixed(1)}°C`
    : '+5.8°C';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', height: '100%' }}>
      {/* Map Card Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid rgba(53, 57, 68, 0.4)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
        background: '#0a0e18'
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
            gap: '4px',
            padding: '3px',
            borderRadius: '12px',
            background: 'rgba(10, 14, 24, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(53, 57, 68, 0.4)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
          }}>
            <button
              onClick={() => setActiveTelemetryLayer('diff')}
              className="font-mono"
              style={{
                background: activeTelemetryLayer === 'diff' ? '#10b981' : 'transparent',
                color: activeTelemetryLayer === 'diff' ? '#003824' : '#bbcabf',
                fontWeight: '700',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Δ DIFF: BASELINE vs TARGET
            </button>
            <button
              onClick={() => setActiveTelemetryLayer('tirs')}
              className="font-mono"
              style={{
                background: activeTelemetryLayer === 'tirs' ? '#93000a' : 'transparent',
                color: activeTelemetryLayer === 'tirs' ? '#ffb3ad' : '#bbcabf',
                fontWeight: '600',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              THERMAL INFRARED (TIRS)
            </button>
            <button
              onClick={() => setActiveTelemetryLayer('ndvi')}
              className="font-mono"
              style={{
                background: activeTelemetryLayer === 'ndvi' ? '#00b2d0' : 'transparent',
                color: activeTelemetryLayer === 'ndvi' ? '#003640' : '#bbcabf',
                fontWeight: '600',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              CANOPY NDVI (0.12 - 0.78)
            </button>
          </div>

          {/* Right Map Controls: Calibration Badge + Basemap Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(10, 14, 24, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(53, 57, 68, 0.4)'
            }}>
              <span style={{ height: '7px', width: '7px', borderRadius: '50%', backgroundColor: '#4edea3', display: 'inline-block' }} />
              <span className="font-mono" style={{ fontSize: '10px', color: '#86948a', letterSpacing: '0.08em', fontWeight: '700' }}>
                LANDSAT-9 TIRS-2 • 30m RADIOMETRIC ΔT
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
          <MapController selectedHotspot={selectedHotspot} />

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
            const solution = getSolutionColor(h.cause);
            const markerColor = viewMode === 'solutions' ? solution.color : getBaselineColor(h.heat_score);
            const radius = isSelected ? 16 : (viewMode === 'solutions' ? 12 : 10);

            return (
              <React.Fragment key={h.cell_id}>
                {/* Optimistic Cooling Halo */}
                <CircleMarker
                  center={[lat, lon]}
                  radius={radius + (isSelected ? 10 : 5)}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : markerColor,
                    fillColor: markerColor,
                    fillOpacity: isSelected ? 0.4 : (viewMode === 'solutions' ? 0.22 : 0.12),
                    weight: isSelected ? 2 : 1,
                    dashArray: isSelected ? '4, 4' : undefined,
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
                    fillOpacity: isSelected ? 1 : 0.88,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => onSelectHotspot(h),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.96}>
                    <div style={{ padding: '6px 4px', textAlign: 'left', minWidth: '210px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span className="font-headline" style={{ fontWeight: '700', fontSize: '13px', color: '#fff' }}>
                          {h.zone}
                        </span>
                        <span className="font-mono" style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#4edea3',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '700'
                        }}>
                          {h.cell_id}
                        </span>
                      </div>

                      {viewMode === 'solutions' ? (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '14px' }}>{solution.icon}</span>
                            <strong style={{ fontSize: '12px', color: markerColor }}>
                              {solution.label}
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
                              {solution.impact}
                            </span>
                          </div>
                          <div className="font-mono" style={{ fontSize: '9.5px', color: '#4cd7f6', marginTop: '6px', textAlign: 'center' }}>
                            Click to inspect dossier →
                          </div>
                        </div>
                      ) : (
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
          borderTop: '1px solid rgba(53, 57, 68, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
              <span style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: '#ff5252',
                opacity: 0.75,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
              }} />
              <span style={{
                position: 'relative',
                borderRadius: '50%',
                height: '8px',
                width: '8px',
                backgroundColor: '#ff5252'
              }} />
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#dfe2f1', fontWeight: '600' }}>
              INSPECTING HOTSPOT:
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#ffb3ad', fontWeight: '700' }}>
              {activeName}
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>|</span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#bbcabf' }}>
              URGENCY SCORE: <strong style={{ color: '#ffb3ad' }}>{activeScore}</strong>
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>|</span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#4edea3', fontWeight: '700' }}>
              ΔT ANOMALY: {activeDelta}
            </span>
          </div>

          <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4edea3', fontWeight: '600' }}>
            <CheckCircle2 size={14} />
            <span>TIER 1 BIOSOLAR ACTIONABLE</span>
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
