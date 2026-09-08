import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calculator, ArrowRight, CheckCircle2, TrendingDown, DollarSign, Layers } from 'lucide-react';
import { ENDPOINTS } from '../config/api';

const PRESET_BUDGETS = [
  { label: '₹1L', value: 100000 },
  { label: '₹2.5L', value: 250000 },
  { label: '₹5L', value: 500000 },
  { label: '₹7.5L', value: 750000 },
  { label: '₹10L', value: 1000000 },
  { label: '₹15L', value: 1500000 },
  { label: '₹20L', value: 2000000 },
  { label: '₹30L', value: 3000000 },
];

const ZONES = ['All Zones', 'Manali', 'Koyambedu', 'Ambattur', 'Anna Nagar', 'Teynampet', 'Perungudi'];

export default function BudgetModal({ isOpen, onClose, defaultZone }) {
  const [budget, setBudget] = useState(500000);
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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '740px',
        maxWidth: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.25))',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <Calculator size={24} color="var(--accent-purple)" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.3px' }}>
                Municipal Budget Optimizer
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Knapsack ROI allocation maximizing cooling impact per rupee spent (Chennai PS 13)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '18px',
          marginBottom: '20px'
        }}>
          {/* Zone Selector Inside Modal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              Target Municipal Zone:
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {ZONES.map(z => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    background: selectedZone === z ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedZone === z ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: selectedZone === z ? '#fff' : 'var(--text-secondary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Budget Controls: Text/Number Input + Interactive Slider */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#fff', display: 'block' }}>
                  Allocated Municipal Budget:
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Type an exact amount or drag the slider
                </span>
              </div>

              {/* Direct Numeric Input Box with Currency Symbol */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '8px',
                padding: '5px 12px',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.15)',
                transition: 'border-color 0.2s'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#34d399', marginRight: '6px' }}>
                  ₹
                </span>
                <input
                  type="number"
                  min="50000"
                  max="10000000"
                  step="10000"
                  value={budget}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value);
                    setBudget(val);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runOptimization(budget);
                  }}
                  placeholder="Enter budget..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '800',
                    width: '140px',
                    fontFamily: 'var(--font-heading)'
                  }}
                />
              </div>
            </div>

            {/* Range Slider in sync with input */}
            <div style={{ position: 'relative', paddingTop: '4px', paddingBottom: '4px' }}>
              <input
                type="range"
                min="50000"
                max="3000000"
                step="25000"
                value={Math.min(3000000, Math.max(50000, Number(budget) || 50000))}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#10b981',
                  cursor: 'pointer',
                  height: '6px',
                  borderRadius: '3px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>₹50,000 (Min)</span>
                <span style={{ color: '#34d399', fontWeight: '700' }}>
                  ₹{Number(budget || 0).toLocaleString('en-IN')}
                </span>
                <span>₹30,00,000 (₹30 Lakhs)</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick Presets:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {PRESET_BUDGETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setBudget(p.value)}
                  style={{
                    background: budget === p.value ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: budget === p.value ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: budget === p.value ? '#34d399' : '#9ca3af',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              ⚡ Real-time Knapsack ROI calculation active
            </span>
            <button
              onClick={() => runOptimization(budget)}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#fff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.15s'
              }}
            >
              {loading ? 'Optimizing...' : 'Calculate Optimal Allocation'}
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {result && (
          <div>
            {/* Allocation Meter */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Budget Utilization ({allocatedPct}%)</span>
                <span>₹{Number(result.total_allocated).toLocaleString('en-IN')} allocated / ₹{Number(result.budget_requested).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${allocatedPct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px', transition: 'width 0.4s ease-out' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                  Total Allocated
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                  ₹{Number(result.total_allocated).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Leftover: ₹{Number(result.remaining_budget).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: '#ddd6fe', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                  Treated Hotspots
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#c084fc', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                  {result.hotspots_treated_count} of {result.total_available_hotspots}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {Math.round((result.hotspots_treated_count / (result.total_available_hotspots || 1)) * 100)}% Coverage
                </div>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                  Mean Cooling Impact
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#22d3ee', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                  -{result.estimated_avg_cooling_celsius}°C
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Average microclimate drop
                </div>
              </div>
            </div>

            {/* Allocation List */}
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Prioritized Interventions ({result.allocations?.length || 0} funded)</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>Ranked by (Heat × Impact / Cost) ROI</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {result.allocations?.map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {item.cell_id}
                      </span>
                      <strong style={{ fontSize: '13px', color: '#fff' }}>{item.zone}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontWeight: '700' }}>
                        Score: {item.heat_score}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#c084fc',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        ROI {item.roi_score}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      {item.intervention} • <span style={{ color: '#d1d5db' }}>{item.scale}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>
                      ₹{Number(item.cost).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>
                      -{item.impact_reduction_celsius}°C cooling
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
