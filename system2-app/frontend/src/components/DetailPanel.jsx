import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X,
  ShieldCheck,
  Sparkles,
  Thermometer,
  DollarSign,
  ArrowDownRight,
  TrendingDown,
  Trees,
  Droplets,
  SunMedium,
  Wind,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Leaf,
  Lightbulb,
  Target,
  Users,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ENDPOINTS } from '../config/api';

export default function DetailPanel({ hotspot, onClose }) {
  const [tier2Data, setTier2Data] = useState(null);
  const [loadingTier2, setLoadingTier2] = useState(false);
  const [tier2Error, setTier2Error] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAreaJustification, setShowAreaJustification] = useState(true);

  // Fetch Tier 2 on-demand ONLY when the hotspot is selected
  useEffect(() => {
    if (!hotspot || !hotspot.cell_id) return;

    let isMounted = true;
    setTier2Data(null);
    setTier2Error(null);
    setLoadingTier2(true);
    setShowAreaJustification(true);

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
  const coolingImpact = t1.impact_reduction_celsius || 2.5;
  const areaJustification = t1.area_justification || {
    headline: `Targeted Intervention for ${hotspot.zone || 'Chennai'}`,
    why_it_solves: `Directly counters localized microclimate heat stress in ${hotspot.zone || 'this area'} based on diagnosed surface thermal dynamics.`,
    scientific_mechanism: `Reduces surface radiation accumulation through enhanced albedo or vegetative evapotranspirative cooling.`,
    local_beneficiaries: `Local residents, commuters, and workforce in ${hotspot.zone || 'this area'}.`,
    key_metric_countered: `Primary Factor: ${(hotspot.cause || 'Heat concentration').replace(/_/g, ' ')}`
  };

  const factorItems = [
    { label: 'Surface Heat Index (T)', val: factors.T_norm ?? 0, color: '#f59e0b' },
    { label: 'Vegetation Deficit (V)', val: factors.V_norm ?? 0, color: '#10b981' },
    { label: 'Impervious Surface (I)', val: factors.I_norm ?? 0, color: '#06b6d4' },
    { label: 'Water Buffer Distance (W)', val: factors.W_norm ?? 0, color: '#8b5cf6' },
  ];

  // Minimized docked pill
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
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.92)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }} />
          <strong style={{ fontSize: '13px', color: '#fff' }}>{hotspot.zone}</strong>
          <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '700' }}>
            -{coolingImpact}°C Cooling Potential
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(false)}
            title="Expand solution blueprint"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            <Maximize2 size={13} />
            <span>View Blueprint</span>
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
        width: '470px',
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
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '18px',
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#34d399',
              fontWeight: '700'
            }}>
              {hotspot.cell_id}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              {hotspot.zone}, Chennai
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', marginTop: '6px', letterSpacing: '-0.3px', color: '#f9fafb' }}>
            Urban Cooling Blueprint
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize to dock"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#9ca3af',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            <Minimize2 size={14} />
          </button>

          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
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
      </div>

      {/* Optimistic Cooling Potential Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '14px',
        padding: '16px',
        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
              Target Cooling Impact
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#34d399' }}>
              -{coolingImpact}°C <span style={{ fontSize: '14px', fontWeight: '500', color: '#a7f3d0' }}>relief</span>
            </div>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.25)',
            border: '1px solid #10b981',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Sparkles size={12} color="#34d399" />
            High Action Potential
          </div>
        </div>

        {/* Before vs After Visual Transformation */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>Baseline Severity: </span>
            <strong style={{ color: '#f59e0b' }}>{heatScore.toFixed(3)}</strong>
          </div>
          <div style={{ color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>→ Post-Intervention:</span>
            <span style={{ color: '#fff', background: 'rgba(16, 185, 129, 0.3)', padding: '1px 6px', borderRadius: '4px' }}>
              {(Math.max(0.2, heatScore - 0.35)).toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Urban Climatology Diagnostic Breakdown */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '14px'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Microclimate Factor Breakdown:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {factorItems.map((item, idx) => {
            const pct = Math.min(100, Math.max(0, Math.round(item.val * 100)));
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: '700', color: '#fff' }}>{pct}%</span>
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
          TIER 1 — VERIFIED MUNICIPAL COOLING TOOLKIT
      ======================================================== */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '14px',
        padding: '18px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.25)', padding: '6px', borderRadius: '8px' }}>
              <ShieldCheck size={18} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#34d399', fontWeight: '800' }}>
                Tier 1 Verified Intervention
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                Standardized Municipal Blueprint
              </div>
            </div>
          </div>
          <span style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            fontSize: '9px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '12px',
            letterSpacing: '0.4px'
          }}>
            DEFENSIBLE BENCHMARK
          </span>
        </div>

        {/* Recommended Intervention Header with Separate Justification Icon */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#34d399',
            fontFamily: 'var(--font-heading)'
          }}>
            {t1.intervention || 'Native Canopy Tree Planting'}
          </div>

          {/* Dedicated Separate Icon Button justifying why solution fits this area */}
          <button
            type="button"
            id="tier1-area-justification-toggle-btn"
            onClick={() => setShowAreaJustification(prev => !prev)}
            title={`Click to view why this solution solves ${hotspot.zone}'s heat problem`}
            style={{
              background: showAreaJustification
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.28), rgba(5, 150, 105, 0.35))'
                : 'rgba(255, 255, 255, 0.06)',
              border: showAreaJustification
                ? '1px solid #34d399'
                : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: showAreaJustification ? '#34d399' : '#cbd5e1',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              boxShadow: showAreaJustification ? '0 0 12px rgba(52, 211, 153, 0.3)' : 'none'
            }}
          >
            <Lightbulb size={13} color="#34d399" />
            <span>Why it solves {hotspot.zone}</span>
            {showAreaJustification ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.5, marginBottom: '14px' }}>
          {t1.description}
        </p>

        {/* ========================================================
            AREA-SPECIFIC PROBLEM & SOLUTION JUSTIFICATION CARD
            (Dedicated to Tier 1 solution set alone)
        ======================================================== */}
        {showAreaJustification && areaJustification && (
          <div
            id="tier1-area-justification-panel"
            className="animate-fade-in"
            style={{
              background: 'linear-gradient(145deg, rgba(6, 78, 59, 0.38) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.45)',
              borderRadius: '12px',
              padding: '13px 14px',
              marginBottom: '14px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient subtle glow accent */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Headline and Zone Tag */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                background: 'rgba(52, 211, 153, 0.2)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                borderRadius: '6px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <Target size={14} color="#34d399" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#6ee7b7', lineHeight: 1.3 }}>
                  {areaJustification.headline}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={10} color="#34d399" /> Zone: <strong style={{ color: '#fff' }}>{hotspot.zone}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Diagnosed Stressor: <strong style={{ color: '#f59e0b' }}>{(hotspot.cause || 'Heat concentration').replace(/_/g, ' ')}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Why it solves this area's problem */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '9px 11px',
              marginBottom: '9px',
              borderLeft: '3px solid #34d399'
            }}>
              <div style={{
                fontSize: '9.5px',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#34d399',
                fontWeight: '800',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Lightbulb size={11} color="#34d399" /> Why this solves {hotspot.zone}'s problem:
              </div>
              <p style={{ fontSize: '11.5px', color: '#f1f5f9', lineHeight: 1.55, margin: 0 }}>
                {areaJustification.why_it_solves}
              </p>
            </div>

            {/* Scientific Mechanism */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '7px',
              padding: '7px 10px',
              marginBottom: '9px',
              border: '1px solid rgba(52, 211, 153, 0.18)',
              fontSize: '11px',
              color: '#cbd5e1',
              lineHeight: 1.45
            }}>
              <span style={{ color: '#34d399', fontWeight: '700' }}>🔬 Scientific Mechanism: </span>
              {areaJustification.scientific_mechanism}
            </div>

            {/* Metric Countered & Beneficiaries Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ fontSize: '8.5px', textTransform: 'uppercase', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Target size={9} color="#f59e0b" /> Countered Metric
                </div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#fcd34d', marginTop: '2px', lineHeight: 1.3 }}>
                  {areaJustification.key_metric_countered}
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ fontSize: '8.5px', textTransform: 'uppercase', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={9} color="#38bdf8" /> Beneficiaries
                </div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#bae6fd', marginTop: '2px', lineHeight: 1.3 }}>
                  {areaJustification.local_beneficiaries}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost & Impact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <DollarSign size={12} color="#34d399" /> Standard Cost
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '3px' }}>
              {t1.cost_display}
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownRight size={12} color="#34d399" /> Cooling Impact
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#34d399', marginTop: '3px' }}>
              {t1.impact_display}
            </div>
          </div>
        </div>

        {/* Co-Benefits Chips */}
        {t1.co_benefits && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {t1.co_benefits.map((b, i) => (
              <span key={i} style={{
                background: 'rgba(16, 185, 129, 0.12)',
                fontSize: '10px',
                color: '#a7f3d0',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={11} color="#34d399" /> {b}
              </span>
            ))}
          </div>
        )}

        <div style={{ fontSize: '10px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px' }}>
          Government Source: {t1.source}
        </div>
      </div>

      {/* ========================================================
          TIER 2 — AI-SUGGESTED CREATIVE COOLING IDEAS
      ======================================================== */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '14px',
        padding: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.25)', padding: '6px', borderRadius: '8px' }}>
              <Sparkles size={18} color="var(--accent-purple)" />
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--accent-purple)', fontWeight: '800' }}>
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
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            AI-suggested, estimated
          </span>
        </div>

        <p style={{ fontSize: '11px', color: '#a78bfa', marginBottom: '12px', lineHeight: 1.4 }}>
          Creative hyper-localized cooling interventions. Costs mapped strictly to verified municipal benchmarks.
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
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#e9d5ff' }}>
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

                  <p style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.45, marginBottom: '8px' }}>
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
                    border: '1px dashed rgba(139, 92, 246, 0.35)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '11px'
                  }}>
                    <div style={{ color: '#c084fc', fontWeight: '700', marginBottom: '3px', fontSize: '10px' }}>
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
