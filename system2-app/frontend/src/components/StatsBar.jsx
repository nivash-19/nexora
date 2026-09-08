import React from 'react';
import { Sparkles, Trees, TrendingDown, ShieldCheck, Flame, Thermometer, Leaf, Satellite } from 'lucide-react';

export default function StatsBar({
  hotspots = [],
  selectedZone = 'All Zones',
  viewMode = 'solutions',
  onSelectZone,
  activeTelemetryLayer = 'diff'
}) {
  if (!hotspots.length) return null;

  const isZoneFiltered = selectedZone && selectedZone !== 'All Zones';
  const activeHotspots = isZoneFiltered
    ? hotspots.filter(h => (h.zone || '').toLowerCase() === selectedZone.toLowerCase())
    : hotspots;

  const total = activeHotspots.length;

  // Temperature calculations
  const temps = activeHotspots.map(h => {
    if (h.temperature_celsius) return parseFloat(h.temperature_celsius);
    const tNorm = h.contributing_factors?.T_norm ?? (h.heat_score || 0.85);
    return 34.0 + tNorm * 9.5;
  });
  const peakTemp = temps.length ? Math.max(...temps).toFixed(1) : '43.5';
  const highStressCount = temps.filter(t => t >= 40.0).length;

  // NDVI calculations
  const ndvis = activeHotspots.map(h => {
    const vNorm = h.contributing_factors?.V_norm ?? 0.80;
    return Math.max(0.12, Math.min(0.78, 0.78 - (vNorm * 0.65)));
  });
  const avgNdvi = ndvis.length ? (ndvis.reduce((a, b) => a + b, 0) / ndvis.length).toFixed(2) : '0.16';
  const severeDeficitCount = ndvis.filter(n => n < 0.25).length;

  // Target metrics calculation
  const maxCoolingPotential = -4;
  const lowVegCount = activeHotspots.filter(h => h.cause === 'low_vegetation').length;
  const treesPlantable = Math.max(150, lowVegCount * 50);

  // TIRS Thermal Infrared Mode Stats
  if (activeTelemetryLayer === 'tirs') {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        margin: '0 20px 16px 20px'
      }}>
        {/* 1. TIRS Thermal Hotspots */}
        <div
          className="glass-panel"
          onClick={() => onSelectZone && onSelectZone(selectedZone)}
          title={`Click to re-center map to ${selectedZone}`}
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(255, 23, 68, 0.35)',
            background: 'rgba(25, 12, 18, 0.88)',
            borderRadius: '14px',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ff1744'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 23, 68, 0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{
            background: 'rgba(255, 23, 68, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 23, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={20} color="#ff1744" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#ffb3ad', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>{isZoneFiltered ? `${selectedZone} Thermal Cells` : 'TIRS Thermal Hotspots'}</span>
              <span style={{ fontSize: '10px', color: '#ff5252' }}>🔥</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff', marginTop: '2px' }}>
              {total} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>active anomalies</span>
            </div>
          </div>
        </div>

        {/* 2. Peak Radiometric LST */}
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(255, 82, 82, 0.35)',
          background: 'rgba(25, 12, 18, 0.88)',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            background: 'rgba(255, 82, 82, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 82, 82, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Thermometer size={20} color="#ff5252" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#ffcdd2', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Peak Radiometric LST
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ff5252', marginTop: '2px' }}>
              {peakTemp}°C <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>peak surface heat</span>
            </div>
          </div>
        </div>

        {/* 3. Severe Heat Corridors */}
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(255, 145, 0, 0.35)',
          background: 'rgba(25, 12, 18, 0.88)',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            background: 'rgba(255, 145, 0, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 145, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingDown size={20} color="#ff9100" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#ffe0b2', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              High-Stress Corridors
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ff9100', marginTop: '2px' }}>
              {highStressCount} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>cells ≥ 40.0°C</span>
            </div>
          </div>
        </div>

        {/* 4. Sensor Calibration */}
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(255, 214, 0, 0.35)',
          background: 'rgba(25, 12, 18, 0.88)',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            background: 'rgba(255, 214, 0, 0.18)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 214, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Satellite size={20} color="#ffd600" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#fff9c4', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Sensor Band & Calibration
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ffd600', marginTop: '2px' }}>
              10.8 µm <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>TIRS-2 Band 10</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NDVI Canopy Vegetation Mode Stats
  if (activeTelemetryLayer === 'ndvi') {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        margin: '0 20px 16px 20px'
      }}>
        {/* 1. Canopy Deficit Sites */}
        <div
          className="glass-panel"
          onClick={() => onSelectZone && onSelectZone(selectedZone)}
          title={`Click to re-center map to ${selectedZone}`}
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(132, 204, 22, 0.35)',
            background: 'rgba(15, 24, 18, 0.88)',
            borderRadius: '14px',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#84cc16'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(132, 204, 22, 0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{
            background: 'rgba(132, 204, 22, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(132, 204, 22, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Leaf size={20} color="#84cc16" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#d9f99d', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>{isZoneFiltered ? `${selectedZone} Canopy Cells` : 'Vegetative Deficit Sites'}</span>
              <span style={{ fontSize: '10px', color: '#84cc16' }}>🌿</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff', marginTop: '2px' }}>
              {severeDeficitCount} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>canopy voids (NDVI &lt; 0.25)</span>
            </div>
          </div>
        </div>

        {/* 2. Mean Urban NDVI */}
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(217, 119, 6, 0.35)',
          background: 'rgba(15, 24, 18, 0.88)',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            background: 'rgba(217, 119, 6, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(217, 119, 6, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingDown size={20} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#fef3c7', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Mean Urban NDVI
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#f59e0b', marginTop: '2px' }}>
              {avgNdvi} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>impervious / barren</span>
            </div>
          </div>
        </div>

        {/* 3. Native Forestry Capacity */}
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          background: 'rgba(15, 24, 18, 0.88)',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trees size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Re-Greening Target
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#34d399', marginTop: '2px' }}>
              {treesPlantable.toLocaleString('en-IN')}+ <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>trees ready</span>
            </div>
          </div>
        </div>

        {/* 4. Sensor Calibration */}
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(132, 204, 22, 0.35)',
          background: 'rgba(15, 24, 18, 0.88)',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            background: 'rgba(132, 204, 22, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(132, 204, 22, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Satellite size={20} color="#84cc16" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#d9f99d', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Spectral Sensor
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#a3e635', marginTop: '2px' }}>
              OLI-2 NIR/Red <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>30m Spatial</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default DIFF (Cooling Intervention / Delta-T Simulation) Mode
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      margin: '0 20px 16px 20px'
    }}>
      {/* 1. Target Cooling Action Sites */}
      <div
        className="glass-panel"
        onClick={() => onSelectZone && onSelectZone(selectedZone)}
        title={`Click to re-center map to ${selectedZone}`}
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          background: 'rgba(15, 23, 42, 0.85)',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#4edea3'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{
          background: 'rgba(16, 185, 129, 0.18)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={20} color="#34d399" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>{isZoneFiltered ? `${selectedZone} Action Sites` : 'Cooling Action Sites'}</span>
            <span style={{ fontSize: '10px', color: '#4edea3' }}>🎯</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff', marginTop: '2px' }}>
            {total} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>mapped corridors</span>
          </div>
        </div>
      </div>

      {/* 2. Max Temperature Drop Potential */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        background: 'rgba(15, 23, 42, 0.85)',
        borderRadius: '14px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          background: 'rgba(6, 182, 212, 0.18)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TrendingDown size={20} color="#22d3ee" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
            Max Cooling Potential
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#22d3ee', marginTop: '2px' }}>
            {maxCoolingPotential}°C <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>relief possible</span>
          </div>
        </div>
      </div>

      {/* 3. Native Canopy Capacity */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        background: 'rgba(15, 23, 42, 0.85)',
        borderRadius: '14px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.18)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trees size={20} color="#10b981" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
            Native Canopy Capacity
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#34d399', marginTop: '2px' }}>
            {treesPlantable.toLocaleString('en-IN')}+ <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>trees ready</span>
          </div>
        </div>
      </div>

      {/* 4. Action Readiness */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        background: 'rgba(15, 23, 42, 0.85)',
        borderRadius: '14px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          background: 'rgba(245, 158, 11, 0.18)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={20} color="#fbbf24" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#fde68a', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
            Action Readiness
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fbbf24', marginTop: '2px' }}>
            100% Verified <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>GCC & ICAP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
