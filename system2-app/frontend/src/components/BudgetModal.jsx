import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calculator, ArrowRight, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';
import { ENDPOINTS } from '../config/api';

export default function BudgetModal({ isOpen, onClose, defaultZone }) {
  const [budget, setBudget] = useState(500000);
  const [selectedZone, setSelectedZone] = useState(defaultZone || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runOptimization = () => {
    setLoading(true);
    setError(null);
    axios.post(ENDPOINTS.OPTIMIZE_BUDGET, {
      budget: parseFloat(budget),
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

  useEffect(() => {
    if (isOpen) {
      runOptimization();
    }
  }, [isOpen, selectedZone]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '720px',
        maxWidth: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '10px' }}>
              <Calculator size={22} color="var(--accent-purple)" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                Municipal Budget Optimizer
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Algorithmic allocation maximizing cooling impact per rupee spent (Chennai PS 13)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              Allocated Municipal Budget:
            </label>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
              ₹{Number(budget).toLocaleString('en-IN')}
            </span>
          </div>

          <input
            type="range"
            min="100000"
            max="2000000"
            step="50000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', height: '6px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>₹1.0 Lakh</span>
            <span>₹10 Lakhs</span>
            <span>₹20 Lakhs</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              onClick={runOptimization}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Optimizing...' : 'Re-calculate Allocation'}
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {result && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#a7f3d0' }}>Allocated / Budget</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
                  ₹{Number(result.total_allocated).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Leftover: ₹{Number(result.remaining_budget).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#ddd6fe' }}>Treated Hotspots</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#c084fc', marginTop: '4px' }}>
                  {result.hotspots_treated_count} of {result.total_available_hotspots}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Cells Funded</div>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#a5f3fc' }}>Mean Cooling Impact</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#22d3ee', marginTop: '4px' }}>
                  -{result.estimated_avg_cooling_celsius}°C
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Average Reduction</div>
              </div>
            </div>

            {/* Allocation List */}
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
              Prioritized Implementation Schedule
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {result.allocations?.map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {item.cell_id}
                      </span>
                      <strong style={{ fontSize: '13px', color: '#fff' }}>{item.zone}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontWeight: '600' }}>
                        Score: {item.heat_score}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      {item.intervention} ({item.scale})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>
                      ₹{Number(item.cost).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#38bdf8' }}>
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
