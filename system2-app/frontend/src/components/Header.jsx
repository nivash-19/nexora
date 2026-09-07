import React from 'react';
import { Flame, Calculator, Sparkles, MapPin, RefreshCw } from 'lucide-react';

const ZONES = ['All Zones', 'Manali', 'Koyambedu', 'Ambattur', 'Anna Nagar', 'Teynampet', 'Perungudi'];

export default function Header({
  selectedZone,
  onSelectZone,
  onOpenBudgetModal,
  hotspotCount,
  onRefresh,
  loading
}) {
  return (
    <header className="glass-panel" style={{ margin: '16px 20px', padding: '14px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)'
          }}>
            <Flame size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Heat<span style={{ color: '#ef4444' }}>Scape</span>
              </h1>
              <span className="glass-pill" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', color: '#10b981', fontWeight: '600' }}>
                System 2 • Live
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Chennai Urban Heat Island Platform • PS 13
            </p>
          </div>
        </div>

        {/* Zone Filter & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' }}>
            <MapPin size={15} color="var(--accent-amber)" />
            <select
              value={selectedZone}
              onChange={(e) => onSelectZone(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: '500',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {ZONES.map((z) => (
                <option key={z} value={z} style={{ background: '#111827', color: '#fff' }}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title="Refresh hotspots from API"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
            <span style={{ fontSize: '12px' }}>{hotspotCount} Hotspots</span>
          </button>

          {/* Budget Simulator Modal Trigger */}
          <button
            onClick={onOpenBudgetModal}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: 'var(--shadow-glow-purple)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Calculator size={15} />
            <span>Budget Optimizer</span>
          </button>
        </div>
      </div>
    </header>
  );
}
