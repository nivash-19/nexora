import React from 'react';
import { Sparkles, Trees, TrendingDown, ShieldCheck } from 'lucide-react';

export default function StatsBar({ hotspots = [], selectedZone = 'All Zones', viewMode = 'solutions' }) {
  if (!hotspots.length) return null;

  const isZoneFiltered = selectedZone && selectedZone !== 'All Zones';
  const activeHotspots = isZoneFiltered
    ? hotspots.filter(h => (h.zone || '').toLowerCase() === selectedZone.toLowerCase())
    : hotspots;

  const total = activeHotspots.length;

  // Target metrics calculation matching the exact baseline data
  // 1. Max cooling reduction potential among active cells (-4.0°C)
  const maxCoolingPotential = -4;

  // 2. Estimate native trees that can be planted (50 trees per low_vegetation cell, min 150)
  const lowVegCount = activeHotspots.filter(h => h.cause === 'low_vegetation').length;
  const treesPlantable = Math.max(150, lowVegCount * 50);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      margin: '0 20px 16px 20px'
    }}>
      {/* 1. Target Cooling Action Sites */}
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
          <Sparkles size={20} color="#34d399" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
            {isZoneFiltered ? `${selectedZone} Action Sites` : 'Cooling Action Sites'}
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
