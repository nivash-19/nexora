import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function Legend() {
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
        maxWidth: '300px',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '14px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
          <Layers size={14} color="var(--accent-amber)" />
          <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px', letterSpacing: '-0.2px' }}>
            Heat Score Index
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
          {/* Continuous gradient bar */}
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

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '10px', paddingTop: '8px', fontSize: '11px', color: '#9ca3af', lineHeight: 1.4 }}>
            Click markers to view verified Tier 1 interventions & Tier 2 AI suggestions.
          </div>
        </div>
      )}
    </div>
  );
}
