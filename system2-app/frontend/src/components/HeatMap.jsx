import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';

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
    return isSelected ? base + 5 : base;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={CHENNAI_CENTER}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '520px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {hotspots.map((h) => {
          const lat = parseFloat(h.lat);
          const lon = parseFloat(h.lon);
          if (isNaN(lat) || isNaN(lon)) return null;

          const isSelected = selectedHotspot && selectedHotspot.cell_id === h.cell_id;
          const color = getColor(h.heat_score);
          const radius = getRadius(h.heat_score, isSelected);

          return (
            <CircleMarker
              key={h.cell_id}
              center={[lat, lon]}
              radius={radius}
              pathOptions={{
                color: isSelected ? '#ffffff' : color,
                fillColor: color,
                fillOpacity: isSelected ? 0.95 : 0.75,
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelectHotspot(h),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                <div style={{ padding: '4px', textAlign: 'left' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#fff' }}>
                    {h.zone} <span style={{ fontSize: '11px', color: '#9ca3af' }}>({h.cell_id})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{
                      fontWeight: '700',
                      color: color,
                      fontSize: '12px'
                    }}>
                      Heat Score: {h.heat_score?.toFixed(3)}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '2px' }}>
                    Cause: <strong>{h.cause?.replace(/_/g, ' ')}</strong>
                  </div>
                  <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '4px' }}>
                    Click marker to inspect interventions &rarr;
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
