import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Layers, Sparkles, Trees, ShieldCheck, Droplets } from 'lucide-react';

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
  const CHENNAI_CENTER = [13.0827, 80.2407];

  // Optimistic solution coloring: maps intervention category to vibrant cooling colors
  const getSolutionColor = (cause) => {
    switch (cause) {
      case 'low_vegetation':
        return { color: '#10b981', label: 'Native Tree Canopy', impact: '-2.2°C', icon: '🌳' };
      case 'high_impervious_surface':
        return { color: '#06b6d4', label: 'Cool Reflective Roofs', impact: '-2.8°C', icon: '🏠' };
      case 'extreme_temperature':
        return { color: '#8b5cf6', label: 'Living Green Roofs', impact: '-3.2°C', icon: '🌿' };
      case 'far_from_water':
        return { color: '#f59e0b', label: 'Bioswales & Misting', impact: '-1.8°C', icon: '💧' };
      default:
        return { color: '#10b981', label: 'Urban Greening', impact: '-2.0°C', icon: '🌱' };
    }
  };

  // Baseline heat coloring
  const getBaselineColor = (score) => {
    if (score >= 0.82) return '#ef4444';
    if (score >= 0.70) return '#f59e0b';
    return '#10b981';
  };

  const currentTiles = BASEMAP_TILES[basemap] || BASEMAP_TILES.dark;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '530px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Floating Basemap Style Switcher */}
      <div style={{
        position: 'absolute',
        top: '18px',
        right: '18px',
        zIndex: 1000,
        display: 'flex',
        gap: '6px',
        background: 'rgba(15, 23, 42, 0.85)',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
      }}>
        {Object.entries(BASEMAP_TILES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setBasemap(key)}
            title={`Switch to ${config.name}`}
            style={{
              background: basemap === key ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              border: basemap === key ? '1px solid #10b981' : '1px solid transparent',
              color: basemap === key ? '#34d399' : '#9ca3af',
              padding: '5px 10px',
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
            <span>{config.name}</span>
          </button>
        ))}
      </div>

      <MapContainer
        center={CHENNAI_CENTER}
        zoom={11}
        scrollWheelZoom={true}
        attributionControl={false}
        style={{ width: '100%', height: '100%', minHeight: '530px' }}
      >
        <MapController selectedHotspot={selectedHotspot} />

        {/* Clean Base Layer (NO WATERMARKS) */}
        <TileLayer
          key={`${basemap}-base`}
          url={currentTiles.base}
          maxZoom={currentTiles.maxZoom}
          attribution=""
        />

        {/* Optional Reference/Labels Layer for Dark Canvas & Satellite */}
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
                radius={radius + (isSelected ? 8 : 4)}
                pathOptions={{
                  color: isSelected ? '#ffffff' : markerColor,
                  fillColor: markerColor,
                  fillOpacity: isSelected ? 0.35 : (viewMode === 'solutions' ? 0.2 : 0.1),
                  weight: isSelected ? 2 : 1,
                  dashArray: isSelected ? '3, 3' : undefined,
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
                  fillOpacity: isSelected ? 0.95 : 0.85,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onSelectHotspot(h),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.96}>
                  <div style={{ padding: '6px 4px', textAlign: 'left', minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#fff' }}>
                        {h.zone}
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#d1d5db',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace'
                      }}>
                        {h.cell_id}
                      </span>
                    </div>

                    {viewMode === 'solutions' ? (
                      /* Optimistic Solution Tooltip */
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
                          <span style={{ fontSize: '11px', color: '#a7f3d0' }}>Target Cooling:</span>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#34d399' }}>
                            {solution.impact} reduction
                          </span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '6px', textAlign: 'center' }}>
                          Click to inspect full cooling blueprint →
                        </div>
                      </div>
                    ) : (
                      /* Baseline Diagnostic Tooltip */
                      <div style={{ marginTop: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                          <span style={{ color: '#9ca3af' }}>Heat Score:</span>
                          <span style={{ fontWeight: '800', color: markerColor }}>{h.heat_score?.toFixed(3)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '3px' }}>
                          <span style={{ color: '#9ca3af' }}>Root Cause:</span>
                          <span style={{ color: '#fff', fontWeight: '600' }}>{h.cause?.replace(/_/g, ' ')}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '6px', textAlign: 'center' }}>
                          Click to inspect interventions →
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
    </div>
  );
}
