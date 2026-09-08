import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X,
  ShieldCheck,
  Sparkles,
  Thermometer,
  DollarSign,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ENDPOINTS } from '../config/api';

export default function DetailPanel({ hotspot, onClose }) {
  const [tier2Data, setTier2Data] = useState(null);
  const [loadingTier2, setLoadingTier2] = useState(false);
  const [tier2Error, setTier2Error] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Fetch Tier 2 on-demand ONLY when the hotspot is selected / opened
  useEffect(() => {
    if (!hotspot || !hotspot.cell_id) return;

    let isMounted = true;
    setTier2Data(null);
    setTier2Error(null);
    setLoadingTier2(true);

    axios.get(ENDPOINTS.TIER2_AI(hotspot.cell_id))
      .then(res => {
        if (isMounted) {
          setTier2Data(res.data);
          setLoadingTier2(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setTier2Error('Failed to fetch AI recommendations. Check API connection.');
          setLoadingTier2(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hotspot?.cell_id]);

  if (!hotspot) return null;

  const t1 = hotspot.tier1_recommendation || {};
  const factors = hotspot.contributing_factors || {};
  const heatScore = hotspot.heat_score || 0;

  const getHeatBadgeColor = (score) => {
    if (score >= 0.82) return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ef4444', label: 'Severe' };
    if (score >= 0.70) return { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', text: '#f59e0b', label: 'Moderate' };
    return { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', text: '#10b981', label: 'Low' };
  };

  const badge = getHeatBadgeColor(heatScore);

  const factorItems = [
    { label: 'Surface Temperature (T)', val: factors.T_norm ?? 0, color: '#ef4444' },
    { label: 'Vegetation Deficit (V)', val: factors.V_norm ?? 0, color: '#10b981' },
    { label: 'Impervious Surface (I)', val: factors.I_norm ?? 0, color: '#8b5cf6' },
    { label: 'Water Distance (W)', val: factors.W_norm ?? 0, color: '#06b6d4' },
  ];

  // Minimized docked view
  if (isMinimized) {
    return (
      <div
        className="glass-panel animate-fade-in"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 1100,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: badge.text,
            boxShadow: `0 0 8px ${badge.text}`
          }} />
          <strong style={{ fontSize: '13px', color: '#fff' }}>{hotspot.zone}</strong>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>({hotspot.cell_id})</span>
        </div>

        <div style={{ fontSize: '12px', fontWeight: '700', color: badge.text }}>
          Score: {heatScore.toFixed(3)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(false)}
            title="Expand panel"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px'
            }}
          >
            <Maximize2 size={13} />
            <span>Expand</span>
          </button>

          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#9ca3af',
              borderRadius: '6px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel animate-slide-in"
      style={{
        width: '460px',
        maxWidth: '92vw',
        height: 'calc(100vh - 140px)',
        overflowY: 'auto',
        position: 'fixed',
        right: '24px',
        top: '104px',
        zIndex: 1100,
        padding: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.75)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#d1d5db',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {hotspot.cell_id}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              {hotspot.zone}, Chennai
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', marginTop: '6px', letterSpacing: '-0.3px' }}>
            Hotspot Diagnostics
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize panel"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#9ca3af',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Minimize2 size={14} />
          </button>

          <button
            onClick={onClose}
            title="Close panel"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Heat Score & Contributing Factors Banner */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Heat Score Index
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: badge.text }}>
              {heatScore.toFixed(3)}
            </div>
          </div>
          <div style={{
            background: badge.bg,
            border: `1px solid ${badge.border}`,
            color: badge.text,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            {badge.label} Severity
          </div>
        </div>

        {/* Contributing Factors Visual Bars */}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Diagnostic Breakdown:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {factorItems.map((item, idx) => {
            const pct = Math.min(100, Math.max(0, Math.round(item.val * 100)));
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: '700', color: '#fff' }}>{item.val} ({pct}%)</span>
                </div>
                <div style={{
                  height: '5px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '3px',
                    transition: 'width 0.4s ease-out'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          TIER 1 SECTION — VERIFIED RECOMMENDATIONS
      ======================================================== */}
      <div style={{
        background: 'var(--bg-tier1)',
        border: '1px solid var(--border-tier1)',
        borderRadius: '14px',
        padding: '18px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '8px' }}>
              <ShieldCheck size={18} color="var(--accent-emerald)" />
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                Tier 1 Recommendation
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                Verified Standardized Intervention
              </div>
            </div>
          </div>
          <span style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-emerald)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            fontSize: '9px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px',
            letterSpacing: '0.4px'
          }}>
            MUNICIPAL BENCHMARK
          </span>
        </div>

        {/* Diagnosed Cause */}
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Root Cause: <strong style={{ color: '#fff' }}>{hotspot.cause?.replace(/_/g, ' ').toUpperCase()}</strong>
        </div>

        {/* Recommended Intervention */}
        <div style={{
          fontSize: '15px',
          fontWeight: '700',
          color: '#34d399',
          marginBottom: '6px',
          fontFamily: 'var(--font-heading)'
        }}>
          {t1.intervention || 'Native Canopy Tree Planting'}
        </div>

        <p style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.5, marginBottom: '14px' }}>
          {t1.description}
        </p>

        {/* Cost & Impact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <DollarSign size={12} color="var(--accent-emerald)" /> Standard Cost
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginTop: '3px' }}>
              {t1.cost_display}
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownRight size={12} color="var(--accent-emerald)" /> Est. Cooling Impact
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#34d399', marginTop: '3px' }}>
              {t1.impact_display}
            </div>
          </div>
        </div>

        {/* Co-Benefits */}
        {t1.co_benefits && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {t1.co_benefits.map((b, i) => (
              <span key={i} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                fontSize: '10px',
                color: '#9ca3af',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                ✓ {b}
              </span>
            ))}
          </div>
        )}

        {/* Research Citation */}
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px' }}>
          Benchmark Source: {t1.source}
        </div>
      </div>

      {/* ========================================================
          TIER 2 SECTION — AI-SUGGESTED IDEAS
      ======================================================== */}
      <div style={{
        background: 'var(--bg-tier2)',
        border: '1px solid var(--border-tier2)',
        borderRadius: '14px',
        padding: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.25)', padding: '6px', borderRadius: '8px' }}>
              <Sparkles size={18} color="var(--accent-purple)" />
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--accent-purple)', fontWeight: '700' }}>
                Tier 2 AI Suggestions
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                Gemini Pro Creative Ideas
              </div>
            </div>
          </div>

          <span style={{
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#c084fc',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            fontSize: '9px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            AI-suggested, estimated
          </span>
        </div>

        <p style={{ fontSize: '11px', color: '#a78bfa', marginBottom: '12px', lineHeight: 1.4 }}>
          Creative area-specific ideas generated via LLM. Costs are strictly bound to Tier 1 municipal benchmarks (never invented by AI).
        </p>

        {/* Loading Skeleton */}
        {loadingTier2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="skeleton" style={{ height: '74px' }} />
            <div className="skeleton" style={{ height: '74px' }} />
          </div>
        )}

        {/* Error Fallback */}
        {tier2Error && !loadingTier2 && (
          <div style={{ fontSize: '12px', color: '#ef4444', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
            {tier2Error}
          </div>
        )}

        {/* AI Ideas Render */}
        {tier2Data && tier2Data.ideas && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tier2Data.ideas.map((idea, idx) => {
              const mc = idea.mapped_cost || {};
              return (
                <div key={idx} style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '10px',
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#e9d5ff' }}>
                      {idea.title}
                    </div>
                    <span style={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#d8b4fe',
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      AI-suggested, estimated
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.4, marginBottom: '8px' }}>
                    {idea.concept}
                  </p>

                  {idea.rationale && (
                    <div style={{ fontSize: '11px', color: '#c084fc', marginBottom: '8px', fontStyle: 'italic' }}>
                      Context: {idea.rationale}
                    </div>
                  )}

                  {/* Strictly Mapped Tier 1 Cost Benchmark */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed rgba(139, 92, 246, 0.3)',
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '11px'
                  }}>
                    <div style={{ color: '#c084fc', fontWeight: '600', marginBottom: '2px', fontSize: '10px' }}>
                      Mapped Benchmark: {mc.category_name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e5e7eb', fontSize: '11px' }}>
                      <span>Unit Cost: <strong>{mc.cost_display}</strong></span>
                      <span>Impact: <strong style={{ color: '#34d399' }}>{mc.est_impact}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
