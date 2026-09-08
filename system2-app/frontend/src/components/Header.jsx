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
    <header className="glass-panel" style={{
      margin: '16px 20px',
      padding: '14px 24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Flame size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Heat<span style={{ color: '#ef4444' }}>Scape</span>
              </h1>
              <span className="glass-pill" style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '12px',
                color: '#10b981',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                System 2 • Live
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Chennai Urban Heat Island Intelligence Platform • PS 13
            </p>
          </div>
        </div>

        {/* Zone Filter & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Zone Selector Pill */}
          <div className="glass-pill" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
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
                fontWeight: '600',
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
              borderRadius: '10px',
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
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
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '10px',
              padding: '8px 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '700',
              boxShadow: 'var(--shadow-glow-purple)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
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
