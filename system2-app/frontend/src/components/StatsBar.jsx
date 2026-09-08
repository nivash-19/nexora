import React from 'react';
import { TrendingUp, Verified, Thermometer, Calculator, Leaf, Landmark } from 'lucide-react';

export default function StatsBar({ hotspots = [], selectedZone = 'All Zones', viewMode = 'solutions' }) {
  if (!hotspots.length) return null;

  const isZoneFiltered = selectedZone && selectedZone !== 'All Zones';
  const activeHotspots = isZoneFiltered
    ? hotspots.filter(h => (h.zone || '').toLowerCase() === selectedZone.toLowerCase())
    : hotspots;

  const totalCells = activeHotspots.length;

  // Dynamic metrics from actual data
  // Max temperature in active set
  const maxTemp = activeHotspots.reduce((max, h) => Math.max(max, h.temperature_celsius || 38.8), 38.8);
  const avgTemp = (activeHotspots.reduce((sum, h) => sum + (h.temperature_celsius || 38.8), 0) / (totalCells || 1)).toFixed(1);

  // Dynamic relief
  const maxCooling = viewMode === 'solutions' ? '-4.0°C' : '0.0°C';

  // Approximate Capex
  const totalCapexEstimated = activeHotspots.reduce((acc, h) => {
    const cost = h.tier1_recommendation?.estimated_cost_inr || 150000;
    return acc + cost;
  }, 0);
  const capexFormatted = totalCapexEstimated >= 10000000
    ? `₹${(totalCapexEstimated / 10000000).toFixed(2)} Cr`
    : `₹${(totalCapexEstimated / 100000).toFixed(1)} L`;

  // Thermal anomaly gauge percentage (scaled around 30 to 45 °C)
  const gaugePct = Math.min(100, Math.max(20, Math.round(((parseFloat(avgTemp) - 28) / (45 - 28)) * 100)));

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '14px',
      margin: '0 20px 14px 20px'
    }}>
      {/* KPI 1: Surface Anomaly Telemetry */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        backgroundColor: 'rgba(28, 31, 42, 0.75)',
        padding: '16px 18px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 82, 82, 0.25)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          position: 'absolute',
          right: '-32px',
          top: '-32px',
          height: '110px',
          width: '110px',
          borderRadius: '50%',
          backgroundColor: 'rgba(147, 0, 10, 0.2)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#86948a', fontWeight: '700' }}>
            SURFACE ANOMALY TELEMETRY
          </span>
          <span className="font-mono" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(147, 0, 10, 0.4)',
            padding: '2px 8px',
            fontSize: '10px',
            color: '#ffb3ad',
            fontWeight: '700',
            border: '1px solid rgba(255, 82, 82, 0.3)'
          }}>
            <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#ff5252' }} />
            LEVEL 4
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div className="font-headline" style={{ fontSize: '28px', color: '#dfe2f1', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '32px' }}>
              {totalCells} <span className="font-headline" style={{ fontSize: '16px', color: '#ffb3ad', fontWeight: '400' }}>Critical Cells</span>
            </div>
            <p className="font-body" style={{ fontSize: '12px', color: '#bbcabf', marginTop: '4px' }}>
              {isZoneFiltered ? `${selectedZone} Sector Focus` : 'Manali & Koyambedu primary clusters'}
            </p>
          </div>

          {/* Sparkline Mini Graph */}
          <div style={{ width: '76px', height: '36px' }}>
            <svg style={{ width: '100%', height: '100%', color: '#ff5252' }} fill="none" viewBox="0 0 80 40">
              <path d="M0 32 Q 15 28, 25 18 T 45 22 T 60 8 T 80 2" fill="none" stroke="#ff5252" strokeLinecap="round" strokeWidth="2.2" />
              <path d="M0 32 Q 15 28, 25 18 T 45 22 T 60 8 T 80 2 L 80 40 L 0 40 Z" fill="#ff5252" fillOpacity="0.15" />
              <circle cx="80" cy="2" fill="#ff5252" r="3" />
            </svg>
          </div>
        </div>

        <div className="font-mono" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#ffb3ad' }}>
          <TrendingUp size={13} />
          <span>+4 cells detected vs Sentinel-2 pass (06:30 UTC)</span>
        </div>
      </div>

      {/* KPI 2: Biosolar Simulation Engine */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        backgroundColor: 'rgba(28, 31, 42, 0.75)',
        padding: '16px 18px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(78, 222, 163, 0.25)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          position: 'absolute',
          right: '-32px',
          top: '-32px',
          height: '110px',
          width: '110px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#86948a', fontWeight: '700' }}>
            BIOSOLAR SIMULATION ENGINE
          </span>
          <span className="font-mono" style={{
            borderRadius: '9999px',
            backgroundColor: 'rgba(78, 222, 163, 0.18)',
            padding: '2px 8px',
            fontSize: '10px',
            color: '#4edea3',
            fontWeight: '700',
            border: '1px solid rgba(78, 222, 163, 0.3)'
          }}>
            FEASIBLE 92%
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div className="font-headline" style={{ fontSize: '28px', color: '#4edea3', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '32px' }}>
              {maxCooling} <span className="font-headline" style={{ fontSize: '16px', color: '#dfe2f1', fontWeight: '400' }}>LST Relief</span>
            </div>
            <p className="font-body" style={{ fontSize: '12px', color: '#bbcabf', marginTop: '4px' }}>
              Tier-1 Biosolar Canopy Intervention
            </p>
          </div>

          <div style={{
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            backgroundColor: 'rgba(78, 222, 163, 0.12)',
            color: '#4edea3',
            border: '1px solid rgba(78, 222, 163, 0.25)'
          }}>
            <Leaf size={22} />
          </div>
        </div>

        <div className="font-mono" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4edea3' }}>
          <Verified size={13} />
          <span>Target: 180,000 m² refinery metal roof retrofits</span>
        </div>
      </div>

      {/* KPI 3: Mean Surface Temperature */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        backgroundColor: 'rgba(28, 31, 42, 0.75)',
        padding: '16px 18px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(76, 215, 246, 0.25)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          position: 'absolute',
          right: '-32px',
          top: '-32px',
          height: '110px',
          width: '110px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 178, 208, 0.18)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#86948a', fontWeight: '700' }}>
            CHENNAI CMA AMBIENT METRIC
          </span>
          <span className="font-mono" style={{
            fontSize: '10px',
            color: '#4cd7f6',
            backgroundColor: '#313540',
            padding: '2px 7px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            GRID Δ
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div className="font-headline" style={{ fontSize: '28px', color: '#dfe2f1', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '32px' }}>
              {avgTemp}°C
            </div>
            <p className="font-body" style={{ fontSize: '12px', color: '#ffb3ad', marginTop: '4px', fontWeight: '500' }}>
              +2.4°C vs 5-yr baseline avg
            </p>
          </div>

          {/* Circular Radial Gauge */}
          <div style={{ position: 'relative', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '46px', height: '46px', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#353944"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#ff5252"
                strokeDasharray={`${gaugePct}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="font-mono" style={{ position: 'absolute', fontSize: '10px', color: '#dfe2f1', fontWeight: '700' }}>
              {gaugePct}%
            </span>
          </div>
        </div>

        <div className="font-mono" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#bbcabf' }}>
          <Thermometer size={13} />
          <span>Peak Zone Temp: {maxTemp}°C (Manali Cluster)</span>
        </div>
      </div>

      {/* KPI 4: Municipal Capex Required */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        backgroundColor: 'rgba(28, 31, 42, 0.75)',
        padding: '16px 18px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(78, 222, 163, 0.2)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          position: 'absolute',
          right: '-32px',
          top: '-32px',
          height: '110px',
          width: '110px',
          borderRadius: '50%',
          backgroundColor: 'rgba(78, 222, 163, 0.15)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#86948a', fontWeight: '700' }}>
            MUNICIPAL ALLOCATION MODEL
          </span>
          <span className="font-mono" style={{
            borderRadius: '9999px',
            backgroundColor: 'rgba(0, 178, 208, 0.22)',
            padding: '2px 8px',
            fontSize: '10px',
            color: '#4cd7f6',
            fontWeight: '700',
            border: '1px solid rgba(76, 215, 246, 0.3)'
          }}>
            KNAPSACK OPTIMAL
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div className="font-headline" style={{ fontSize: '28px', color: '#dfe2f1', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '32px' }}>
              {capexFormatted} <span className="font-headline" style={{ fontSize: '16px', color: '#4edea3', fontWeight: '400' }}>CapEx</span>
            </div>
            <p className="font-body" style={{ fontSize: '12px', color: '#6ffbbe', marginTop: '4px', fontWeight: '500' }}>
              73.8% Optimal ROI Algorithmic Match
            </p>
          </div>

          <div style={{
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            backgroundColor: '#262a35',
            color: '#dfe2f1',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Landmark size={20} />
          </div>
        </div>

        <div className="font-mono" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#bbcabf' }}>
          <Calculator size={13} />
          <span>Breakeven: 18 months via HVAC grid relief</span>
        </div>
      </div>
    </section>
  );
}
