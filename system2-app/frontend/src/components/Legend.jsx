import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Flame, Trees, Layers, Sparkles } from 'lucide-react';

export default function Legend({ viewMode = 'solutions', activeTelemetryLayer = 'diff' }) {
  const [collapsed, setCollapsed] = useState(false);

  // Configuration for each telemetry mode
  const LAYER_CONFIGS = {
    diff: {
      title: 'SURFACE ΔT DIFFERENCE SCALE',
      badge: '-3.5°C MAX RELIEF',
      badgeColor: '#4edea3',
      curveStroke: '#4edea3',
      curveFill: '#10b981',
      gradient: 'linear-gradient(90deg, #00e676 0%, #4edea3 25%, #00b2d0 50%, #ffb74d 75%, #ff5252 100%)',
      minTick: '-5°C (Cool Sink)',
      minColor: '#4edea3',
      midTick: '0°C Neutral',
      maxTick: '+7°C (Heat Trap)',
      maxColor: '#ff5252',
      leftLabel: 'Maritime / Parks Buffer',
      rightLabel: 'Industrial Heat Trap',
      categories: [
        { color: '#4edea3', label: 'Native Tree Canopy (-2.2°C)' },
        { color: '#4cd7f6', label: 'Cool Reflective Roofs (-2.8°C)' },
        { color: '#6ffbbe', label: 'Living Biosolar Roofs (-3.2°C)' },
        { color: '#00b2d0', label: 'Bioswales & Urban Misting (-1.8°C)' },
      ]
    },
    tirs: {
      title: 'LANDSAT-9 TIRS-2 THERMAL LST',
      badge: '43.1°C PEAK HEAT',
      badgeColor: '#ff5252',
      curveStroke: '#ff5252',
      curveFill: '#d50000',
      gradient: 'linear-gradient(90deg, #ffd600 0%, #ff9100 28%, #ff5252 60%, #d50000 85%, #880e4f 100%)',
      minTick: '< 37°C Baseline',
      minColor: '#ffd600',
      midTick: '40°C High Stress',
      maxTick: '43°C+ Severe Heat Dome',
      maxColor: '#ff1744',
      leftLabel: 'Coastal Baseline (34°C)',
      rightLabel: 'Refinery Peak (43.5°C)',
      categories: [
        { color: '#ff1744', label: '≥ 42.0°C Extreme Thermal Anomaly' },
        { color: '#ff5252', label: '40.0°C – 41.9°C High Heat Stress' },
        { color: '#ff9100', label: '38.0°C – 39.9°C Moderate UHI Island' },
        { color: '#ffd600', label: '< 38.0°C Elevated Baseline' },
      ]
    },
    ndvi: {
      title: 'CANOPY NDVI VEGETATION INDEX',
      badge: '0.14 SEVERE DEFICIT',
      badgeColor: '#d97706',
      curveStroke: '#84cc16',
      curveFill: '#84cc16',
      gradient: 'linear-gradient(90deg, #78350f 0%, #d97706 25%, #facc15 50%, #84cc16 75%, #10b981 100%)',
      minTick: '0.10 Barren / Impervious',
      minColor: '#d97706',
      midTick: '0.35 Sparse Shrub',
      maxTick: '0.75+ Dense Forest',
      maxColor: '#10b981',
      leftLabel: 'Zero Canopy / Asphalt',
      rightLabel: 'Guindy National Park',
      categories: [
        { color: '#d97706', label: 'NDVI < 0.20 Severe Canopy Void (-72%)' },
        { color: '#eab308', label: '0.20 – 0.32 Low Urban Shrub (-54%)' },
        { color: '#84cc16', label: '0.32 – 0.45 Moderate Vegetative Cover' },
        { color: '#10b981', label: '> 0.45 Preserved Canopy Reserve' },
      ]
    }
  };

  const config = LAYER_CONFIGS[activeTelemetryLayer] || LAYER_CONFIGS.diff;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '56px',
        left: '20px',
        zIndex: 1000,
        padding: collapsed ? '8px 14px' : '14px 16px',
        width: '330px',
        maxWidth: 'calc(100% - 40px)',
        fontSize: '12px',
        border: activeTelemetryLayer === 'tirs'
          ? '1px solid rgba(255, 82, 82, 0.45)'
          : (activeTelemetryLayer === 'ndvi' ? '1px solid rgba(132, 204, 22, 0.45)' : '1px solid rgba(78, 222, 163, 0.45)'),
        borderRadius: '14px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        background: 'rgba(10, 14, 24, 0.94)',
        transition: 'all 0.25s ease'
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dfe2f1', fontWeight: '700' }}>
            {config.title}
          </span>
          <span className="font-mono" style={{
            fontSize: '10px',
            color: config.badgeColor,
            fontWeight: '700',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '1px 6px',
            borderRadius: '4px',
            border: `1px solid ${config.badgeColor}40`
          }}>
            {config.badge}
          </span>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#86948a',
            cursor: 'pointer',
            padding: 0,
            display: 'flex'
          }}
        >
          {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {!collapsed && (
        <div style={{ marginTop: '10px' }}>
          {/* Distribution Histogram Mini Curve */}
          <div style={{ width: '100%', height: '22px', marginBottom: '6px', opacity: 0.85 }}>
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 18 Q 20 17, 30 14 T 45 10 T 60 4 T 75 8 T 90 2 T 100 1" fill="none" stroke={config.curveStroke} strokeWidth="1.5" />
              <path d="M0 18 Q 20 17, 30 14 T 45 10 T 60 4 T 75 8 T 90 2 T 100 1 L 100 20 L 0 20 Z" fill={config.curveFill} fillOpacity="0.2" />
            </svg>
          </div>

          {/* Chromatic Differential Gradient Bar */}
          <div
            style={{
              height: '8px',
              width: '100%',
              borderRadius: '9999px',
              background: config.gradient,
              boxShadow: `0 0 10px ${config.badgeColor}40`
            }}
          />

          {/* Tick Marks & Numerical Range */}
          <div className="font-mono" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', fontWeight: '600' }}>
            <span style={{ color: config.minColor, fontWeight: '700' }}>{config.minTick}</span>
            <span style={{ color: '#86948a' }}>{config.midTick}</span>
            <span style={{ color: config.maxColor, fontWeight: '700' }}>{config.maxTick}</span>
          </div>

          <div className="font-mono" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '6px',
            paddingTop: '6px',
            borderTop: '1px solid rgba(53, 57, 68, 0.4)',
            fontSize: '9px',
            color: '#86948a'
          }}>
            <span>{config.leftLabel}</span>
            <span style={{ color: config.badgeColor, fontWeight: '500' }}>{config.rightLabel}</span>
          </div>

          {/* Categories Overview */}
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(53, 57, 68, 0.4)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {config.categories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, boxShadow: `0 0 6px ${cat.color}` }} />
                <span style={{ color: '#dfe2f1', fontWeight: '500' }}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
