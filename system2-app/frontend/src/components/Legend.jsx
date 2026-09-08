import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';

export default function Legend({ viewMode = 'solutions' }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        zIndex: 1000,
        padding: collapsed ? '8px 14px' : '14px 18px',
        maxWidth: '320px',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '14px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(15, 23, 42, 0.88)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {viewMode === 'solutions' ? (
            <Sparkles size={14} color="#34d399" />
          ) : (
            <Layers size={14} color="var(--accent-amber)" />
          )}
          <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px', letterSpacing: '-0.2px' }}>
            {viewMode === 'solutions' ? 'Cooling Solutions Legend' : 'Heat Score Index'}
          </span>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex'
          }}
        >
          {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {!collapsed && (
        <div style={{ marginTop: '12px' }}>
          {viewMode === 'solutions' ? (
            /* Optimistic Solutions Color Legend */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                <div>
                  <span style={{ color: '#a7f3d0', fontWeight: '600' }}>Native Tree Canopy</span>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}> (-2.2°C relief)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block', boxShadow: '0 0 8px #06b6d4' }} />
                <div>
                  <span style={{ color: '#a5f3fc', fontWeight: '600' }}>Cool High-Albedo Roofs</span>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}> (-2.8°C relief)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#8b5cf6', display: 'inline-block', boxShadow: '0 0 8px #8b5cf6' }} />
                <div>
                  <span style={{ color: '#ddd6fe', fontWeight: '600' }}>Living Green Roofs</span>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}> (-3.2°C relief)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 8px #f59e0b' }} />
                <div>
                  <span style={{ color: '#fde68a', fontWeight: '600' }}>Bioswales & Misting</span>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}> (-1.8°C relief)</span>
                </div>
              </div>
            </div>
          ) : (
            /* Baseline Heat Legend */
            <div>
              <div style={{
                height: '6px',
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 55%, #ef4444 100%)',
                marginBottom: '10px'
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }} />
                  <span style={{ color: '#fca5a5', fontWeight: '500' }}>&ge; 0.82 — Critical Hotspot</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 6px #f59e0b' }} />
                  <span style={{ color: '#fde68a', fontWeight: '500' }}>0.70 – 0.81 — Moderate Hotspot</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                  <span style={{ color: '#a7f3d0', fontWeight: '500' }}>&lt; 0.70 — Low Heat Risk</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '10px', paddingTop: '8px', fontSize: '11px', color: '#9ca3af', lineHeight: 1.4 }}>
            Click markers to view actionable Tier 1 interventions & Tier 2 AI suggestions.
          </div>
        </div>
      )}
    </div>
  );
}
