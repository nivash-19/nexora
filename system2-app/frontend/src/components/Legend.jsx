import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';

export default function Legend({ viewMode = 'solutions' }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '56px',
        left: '20px',
        zIndex: 1000,
        padding: collapsed ? '8px 14px' : '14px 16px',
        width: '320px',
        maxWidth: 'calc(100% - 40px)',
        fontSize: '12px',
        border: '1px solid rgba(53, 57, 68, 0.5)',
        borderRadius: '14px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        background: 'rgba(10, 14, 24, 0.92)',
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
          <span className="font-mono" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#86948a', fontWeight: '700' }}>
            SURFACE ΔT DIFFERENCE SCALE
          </span>
          <span className="font-mono" style={{ fontSize: '10px', color: '#ffb3ad', fontWeight: '700' }}>
            +6.8°C MAX
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
              <path d="M0 18 Q 20 17, 30 14 T 45 10 T 60 4 T 75 8 T 90 2 T 100 1" fill="none" stroke="#ffb3ad" strokeWidth="1.5" />
              <path d="M0 18 Q 20 17, 30 14 T 45 10 T 60 4 T 75 8 T 90 2 T 100 1 L 100 20 L 0 20 Z" fill="#ff5252" fillOpacity="0.2" />
            </svg>
          </div>

          {/* Chromatic Differential Gradient Bar */}
          <div
            style={{
              height: '8px',
              width: '100%',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #00e676 0%, #4edea3 22%, #00b2d0 42%, #e0e0e0 52%, #ffb74d 68%, #ff3d00 85%, #d50000 100%)'
            }}
          />

          {/* Tick Marks & Numerical Range */}
          <div className="font-mono" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', fontWeight: '600' }}>
            <span style={{ color: '#4edea3', fontWeight: '700' }}>-5°C (Cool Sink)</span>
            <span style={{ color: '#86948a' }}>0°C Neutral</span>
            <span style={{ color: '#ffb3ad', fontWeight: '700' }}>+7°C (Heat Trap)</span>
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
            <span>Guindy & Maritime Buffer</span>
            <span style={{ color: '#ffb3ad', fontWeight: '500' }}>Industrial Tin Roofs</span>
          </div>

          {/* Solution Categories Overview */}
          {viewMode === 'solutions' && (
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(53, 57, 68, 0.4)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4edea3', boxShadow: '0 0 6px #4edea3' }} />
                <span style={{ color: '#dfe2f1', fontWeight: '500' }}>Native Biosolar Canopy (-3.2°C)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4cd7f6', boxShadow: '0 0 6px #4cd7f6' }} />
                <span style={{ color: '#dfe2f1', fontWeight: '500' }}>Cool Roof Albedo Retrofit (-2.8°C)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
