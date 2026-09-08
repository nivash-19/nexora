import React from 'react';
import { Sparkles, Calculator, MapPin, RefreshCw, Leaf, Thermometer } from 'lucide-react';

const ZONES = ['All Zones', 'Manali', 'Koyambedu', 'Ambattur', 'Anna Nagar', 'Teynampet', 'Perungudi'];

export default function Header({
  selectedZone,
  onSelectZone,
  onOpenBudgetModal,
  hotspotCount,
  onRefresh,
  loading,
  viewMode,
  onToggleViewMode
}) {
  return (
    <header className="glass-panel" style={{
      margin: '16px 20px',
      padding: '14px 24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(15, 23, 42, 0.85)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Leaf size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Heat<span style={{ color: '#10b981' }}>Scape</span>
              </h1>
              <span className="glass-pill" style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '12px',
                color: '#34d399',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                CoolCity Solutions • Live
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Chennai Urban Heat Island Intelligence & Positive Cooling Platform
            </p>
          </div>
        </div>

        {/* View Mode & Zone Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Optimistic Blueprint vs Baseline Mode Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => onToggleViewMode('solutions')}
              style={{
                background: viewMode === 'solutions' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                border: 'none',
                color: viewMode === 'solutions' ? '#fff' : '#9ca3af',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={13} />
              <span>Cooling Blueprint</span>
            </button>
            <button
              onClick={() => onToggleViewMode('baseline')}
              style={{
                background: viewMode === 'baseline' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                border: viewMode === 'baseline' ? '1px solid #ef4444' : 'none',
                color: viewMode === 'baseline' ? '#fca5a5' : '#9ca3af',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              <Thermometer size={13} />
              <span>Heat Baseline</span>
            </button>
          </div>

          {/* Zone Selector Pill */}
          <div className="glass-pill" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <MapPin size={15} color="#38bdf8" />
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
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
            <span style={{ fontSize: '12px' }}>{hotspotCount} Sites</span>
          </button>

          {/* Budget Simulator Modal Trigger */}
          <button
            onClick={onOpenBudgetModal}
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '10px',
              padding: '8px 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '700',
              boxShadow: 'var(--shadow-glow-emerald)',
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
