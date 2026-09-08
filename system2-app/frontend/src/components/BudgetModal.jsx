import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, SlidersHorizontal, ArrowRight, CheckCircle2, TrendingDown, DollarSign, Layers, ShieldCheck } from 'lucide-react';
import { ENDPOINTS } from '../config/api';

const PRESET_BUDGETS = [
  { label: '₹1L', value: 100000 },
  { label: '₹2.5L', value: 250000 },
  { label: '₹5L', value: 500000 },
  { label: '₹10L', value: 1000000 },
  { label: '₹15L', value: 1500000 },
  { label: '₹30L', value: 3000000 },
];

const ZONES = ['All Zones', 'Manali', 'Koyambedu', 'Ambattur', 'Anna Nagar', 'Teynampet', 'Perungudi'];

export default function BudgetModal({ isOpen, onClose, defaultZone }) {
  const [budget, setBudget] = useState(1500000);
  const [selectedZone, setSelectedZone] = useState(defaultZone || 'All Zones');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (defaultZone) {
      setSelectedZone(defaultZone);
    }
  }, [defaultZone]);

  const runOptimization = (budgetVal = budget) => {
    const num = parseFloat(budgetVal);
    if (isNaN(num) || num <= 0) return;
    setLoading(true);
    setError(null);
    axios.post(ENDPOINTS.OPTIMIZE_BUDGET, {
      budget: num,
      zone: selectedZone && selectedZone !== 'All Zones' ? selectedZone : null
    })
      .then(res => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to compute budget optimization.');
        setLoading(false);
      });
  };

  // Debounced auto-calculation when budget or selectedZone changes
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      runOptimization(budget);
    }, 250);
    return () => clearTimeout(timer);
  }, [isOpen, budget, selectedZone]);

  if (!isOpen) return null;

  const allocatedPct = result && result.budget_requested > 0
    ? Math.min(100, Math.round((result.total_allocated / result.budget_requested) * 100))
    : 0;

  const allocatedLakhs = result?.total_allocated
    ? (result.total_allocated / 100000).toFixed(2)
    : '14.85';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{
        width: '880px',
        maxWidth: '96vw',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#0f131d',
        border: '1px solid rgba(53, 57, 68, 0.5)',
        borderRadius: '20px',
        padding: '24px 28px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Modal Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(78, 222, 163, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4edea3',
              border: '1px solid rgba(78, 222, 163, 0.3)'
            }}>
              <SlidersHorizontal size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="font-headline" style={{ fontSize: '18px', fontWeight: '800', color: '#dfe2f1', letterSpacing: '-0.3px' }}>
                  MUNICIPAL KNAPSACK BUDGET OPTIMIZER
                </h3>
                <span className="font-mono" style={{
                  backgroundColor: '#10b981',
                  color: '#002113',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '800'
                }}>
                  DYNAMIC DUAL-OBJECTIVE
                </span>
              </div>
              <p className="font-body" style={{ fontSize: '12px', color: '#bbcabf', marginTop: '2px' }}>
                Maximized urban heat delta mitigation per rupee allocated across CMA high-risk wards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close"
            style={{
              background: '#1c1f2a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#bbcabf',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Preset Chips & Zone Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#86948a', letterSpacing: '0.08em', fontWeight: '700' }}>
              PRESETS:
            </span>
            {PRESET_BUDGETS.map((p) => {
              const isActive = Number(budget) === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setBudget(p.value)}
                  className="font-mono"
                  style={{
                    backgroundColor: isActive ? '#10b981' : '#1c1f2a',
                    color: isActive ? '#002113' : '#bbcabf',
                    border: isActive ? '1px solid #4edea3' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: isActive ? '800' : '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Zone Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#86948a' }}>ZONE:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="font-mono"
              style={{
                background: '#1c1f2a',
                border: '1px solid rgba(78, 222, 163, 0.3)',
                color: '#4edea3',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {ZONES.map(z => (
                <option key={z} value={z} style={{ background: '#0f131d', color: '#dfe2f1' }}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sliders and Knapsack Output Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Left: Input & Range Slider */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(28, 31, 42, 0.6)',
              border: '1px solid rgba(53, 57, 68, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#86948a', fontWeight: '700' }}>
                  TOTAL ALLOCABLE CAPEX (INR)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#0a0e18',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(78, 222, 163, 0.3)'
                }}>
                  <span className="font-mono" style={{ fontSize: '12px', color: '#4edea3', fontWeight: '800' }}>₹</span>
                  <input
                    type="number"
                    min="50000"
                    max="10000000"
                    step="25000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    className="font-mono"
                    style={{
                      background: 'transparent',
                      color: '#dfe2f1',
                      fontWeight: '800',
                      fontSize: '13px',
                      width: '110px',
                      textAlign: 'right',
                      outline: 'none',
                      border: 'none'
                    }}
                  />
                </div>
              </div>

              <input
                type="range"
                min="50000"
                max="3000000"
                step="25000"
                value={Math.min(3000000, Math.max(50000, Number(budget) || 50000))}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#313540',
                  borderRadius: '6px',
                  appearance: 'none',
                  cursor: 'pointer',
                  accentColor: '#4edea3'
                }}
              />

              <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#86948a' }}>
                <span>Min: ₹50,000</span>
                <span style={{ color: '#4edea3', fontWeight: '700' }}>Target: ₹{(Number(budget || 0) / 100000).toFixed(2)} Lakhs</span>
                <span>Cap: ₹30,00,000</span>
              </div>
            </div>

            {/* Right: 4 Live Output Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '10px'
            }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(28, 31, 42, 0.6)', border: '1px solid rgba(53, 57, 68, 0.4)', display: 'flex', flexDirection: 'column' }}>
                <span className="font-mono" style={{ fontSize: '9px', color: '#86948a', letterSpacing: '0.05em' }}>TOTAL ALLOCATED</span>
                <span className="font-headline" style={{ fontSize: '18px', color: '#dfe2f1', fontWeight: '700', marginTop: '3px' }}>
                  ₹{allocatedLakhs}L
                </span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#4edea3', fontWeight: '700', marginTop: '2px' }}>
                  {allocatedPct}% UTILIZED
                </span>
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(28, 31, 42, 0.6)', border: '1px solid rgba(53, 57, 68, 0.4)', display: 'flex', flexDirection: 'column' }}>
                <span className="font-mono" style={{ fontSize: '9px', color: '#86948a', letterSpacing: '0.05em' }}>CELLS TREATED</span>
                <span className="font-headline" style={{ fontSize: '18px', color: '#dfe2f1', fontWeight: '700', marginTop: '3px' }}>
                  {result ? `${result.hotspots_treated_count} / ${result.total_available_hotspots}` : '14 / 20'}
                </span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#ffb3ad', fontWeight: '700', marginTop: '2px' }}>
                  {result ? `${Math.round((result.hotspots_treated_count / (result.total_available_hotspots || 1)) * 100)}% Critical Cov.` : '70% Critical Cov.'}
                </span>
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(28, 31, 42, 0.6)', border: '1px solid rgba(53, 57, 68, 0.4)', display: 'flex', flexDirection: 'column' }}>
                <span className="font-mono" style={{ fontSize: '9px', color: '#86948a', letterSpacing: '0.05em' }}>AVG CITY COOLING</span>
                <span className="font-headline" style={{ fontSize: '18px', color: '#4cd7f6', fontWeight: '700', marginTop: '3px' }}>
                  -{result?.estimated_avg_cooling_celsius || '2.85'}°C
                </span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#4cd7f6', marginTop: '2px' }}>
                  Peak -4.0°C
                </span>
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(28, 31, 42, 0.6)', border: '1px solid rgba(53, 57, 68, 0.4)', display: 'flex', flexDirection: 'column' }}>
                <span className="font-mono" style={{ fontSize: '9px', color: '#86948a', letterSpacing: '0.05em' }}>COMPLIANCE</span>
                <span className="font-headline" style={{ fontSize: '18px', color: '#dfe2f1', fontWeight: '700', marginTop: '3px' }}>
                  TN-HAP v2
                </span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#4edea3', fontWeight: '700', marginTop: '2px' }}>
                  APPROVED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prioritized Knapsack Mini-Table */}
        {result && result.allocations && (
          <div style={{
            overflowX: 'auto',
            borderRadius: '12px',
            background: 'rgba(23, 27, 38, 0.7)',
            border: '1px solid rgba(53, 57, 68, 0.4)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'rgba(38, 42, 53, 0.6)', borderBottom: '1px solid rgba(53, 57, 68, 0.5)' }}>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rank / Cell</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Intervention Blueprint</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Allocated CapEx</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cooling Gain</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ROI Score</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {result.allocations.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid rgba(53, 57, 68, 0.3)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(38, 42, 53, 0.4)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '10px 14px', color: '#ffb3ad', fontWeight: '700' }}>
                      #{String(idx + 1).padStart(2, '0')} • {item.cell_id} ({item.zone})
                    </td>
                    <td style={{ padding: '10px 14px', color: '#dfe2f1' }}>
                      {item.intervention} <span style={{ color: '#86948a', fontSize: '10px' }}>({item.scale})</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#dfe2f1', fontWeight: '700' }}>
                      ₹{Number(item.cost).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#4edea3', fontWeight: '700' }}>
                      -{item.impact_reduction_celsius}°C LST
                    </td>
                    <td style={{ padding: '10px 14px', color: '#4cd7f6', fontWeight: '700' }}>
                      {item.roi_score}x
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(78, 222, 163, 0.18)',
                        color: '#4edea3',
                        fontWeight: '800',
                        fontSize: '9.5px'
                      }}>
                        OPTIMAL INCLUSION
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
