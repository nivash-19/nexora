import React from 'react';

export default function Legend() {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        zIndex: 1000,
        padding: '12px 16px',
        maxWidth: '280px',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}
    >
      <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', fontSize: '13px' }}>
        Heat Score Index (0 – 1.0)
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }} />
          <span>&ge; 0.82 — Critical / Severe Hotspot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
          <span>0.70 – 0.81 — Moderate Hotspot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>&lt; 0.70 — Low Heat Risk</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '10px', paddingTop: '8px', fontSize: '11px' }}>
        Click any cell marker on the map to inspect verified Tier 1 interventions & generate Tier 2 AI ideas.
      </div>
    </div>
  );
}
