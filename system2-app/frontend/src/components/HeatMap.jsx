import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';

// Internal controller to smoothly fly to selected hotspot
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

export default function HeatMap({ hotspots = [], selectedHotspot, onSelectHotspot }) {
  // Chennai Center Coordinates
  const CHENNAI_CENTER = [13.0827, 80.2407];

  const getColor = (score) => {
    if (score >= 0.82) return '#ef4444';
    if (score >= 0.70) return '#f59e0b';
    return '#10b981';
  };

  const getRadius = (score, isSelected) => {
    const base = score >= 0.82 ? 14 : score >= 0.70 ? 11 : 9;
    return isSelected ? base + 4 : base;
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '520px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
    }}>
      <MapContainer
        center={CHENNAI_CENTER}
        zoom={11}
        scrollWheelZoom={true}
        attributionControl={false}
        style={{ width: '100%', height: '100%', minHeight: '520px' }}
      >
        <MapController selectedHotspot={selectedHotspot} />

        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {hotspots.map((h) => {
          const lat = parseFloat(h.lat);
          const lon = parseFloat(h.lon);
          if (isNaN(lat) || isNaN(lon)) return null;

          const isSelected = selectedHotspot && selectedHotspot.cell_id === h.cell_id;
          const isCritical = (h.heat_score || 0) >= 0.82;
          const color = getColor(h.heat_score);
          const radius = getRadius(h.heat_score, isSelected);

          return (
            <React.Fragment key={h.cell_id}>
              {/* Pulsing Outer Halo for Selected or Critical Hotspots */}
              {(isSelected || isCritical) && (
                <CircleMarker
                  center={[lat, lon]}
                  radius={radius + (isSelected ? 10 : 6)}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.25 : 0.12,
                    weight: isSelected ? 2 : 1,
                    dashArray: isSelected ? '4, 4' : undefined,
                  }}
                  interactive={false}
                />
              )}

              {/* Main Hotspot Marker */}
              <CircleMarker
                center={[lat, lon]}
                radius={radius}
                pathOptions={{
                  color: isSelected ? '#ffffff' : color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.95 : 0.78,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onSelectHotspot(h),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.96}>
                  <div style={{ padding: '6px 4px', textAlign: 'left', minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '13px', color: '#fff' }}>
                        {h.zone}
                      </span>
                      <span style={{
                        background: isCritical ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                        color: isCritical ? '#ef4444' : '#9ca3af',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace'
                      }}>
                        {h.cell_id}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Heat Score:</span>
                      <span style={{
                        fontWeight: '800',
                        color: color,
                        fontSize: '13px'
                      }}>
                        {h.heat_score?.toFixed(3)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Cause:</span>
                      <span style={{ fontSize: '11px', color: '#e5e7eb', fontWeight: '600' }}>
                        {h.cause?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '10px',
                      color: '#38bdf8',
                      marginTop: '6px',
                      paddingTop: '4px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      Click to inspect cooling interventions →
                    </div>
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
