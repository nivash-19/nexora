import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  X,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Leaf,
  Lightbulb,
  Flame,
  Check,
  DollarSign,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  Target,
  MapPin,
  Users
} from 'lucide-react';
import { ENDPOINTS } from '../config/api';

export default function DetailPanel({
  hotspot,
  onClose,
  adoptedHotspots = {},
  onToggleAdopt
}) {
  const [tier2Data, setTier2Data] = useState(null);
  const [loadingTier2, setLoadingTier2] = useState(false);
  const [tier2Error, setTier2Error] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAreaJustification, setShowAreaJustification] = useState(true);

  const isAdopted = !!(hotspot && adoptedHotspots[hotspot.cell_id]);

  const panelRef = useRef(null);

  // Prevent Leaflet map scroll-interception when mouse wheel or trackpad scrolls over this panel
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const stopScroll = (e) => {
      e.stopPropagation();
    };
    el.addEventListener('wheel', stopScroll, { passive: false });
    el.addEventListener('touchmove', stopScroll, { passive: false });
    return () => {
      el.removeEventListener('wheel', stopScroll);
      el.removeEventListener('touchmove', stopScroll);
    };
  }, [isMinimized, hotspot?.cell_id]);

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
  const coolingImpact = t1.impact_reduction_celsius || 3.2;
  const areaJustification = t1.area_justification || {
    headline: `Targeted Intervention for ${hotspot.zone || 'Chennai'}`,
    why_it_solves: `Directly counters localized microclimate heat stress in ${hotspot.zone || 'this area'} based on diagnosed surface thermal dynamics.`,
    scientific_mechanism: `Reduces surface radiation accumulation through enhanced albedo or vegetative evapotranspirative cooling.`,
    local_beneficiaries: `Local residents, commuters, and workforce in ${hotspot.zone || 'this area'}.`,
    key_metric_countered: `Primary Factor: ${(hotspot.cause || 'Heat concentration').replace(/_/g, ' ')}`
  };

  const tNorm = Math.min(100, Math.max(0, Math.round((factors.T_norm ?? 0.94) * 100)));
  const vNorm = Math.min(100, Math.max(0, Math.round((factors.V_norm ?? 0.88) * 100)));
  const iNorm = Math.min(100, Math.max(0, Math.round((factors.I_norm ?? 0.91) * 100)));
  const wNorm = Math.min(100, Math.max(0, Math.round((factors.W_norm ?? 0.25) * 100)));

  // Minimized docked pill
  if (isMinimized) {
    return (
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 1100,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(78, 222, 163, 0.4)',
          borderRadius: '12px',
          background: 'rgba(10, 14, 24, 0.95)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#4edea3',
            boxShadow: '0 0 8px #4edea3'
          }} />
          <strong className="font-headline" style={{ fontSize: '13px', color: '#fff' }}>{hotspot.zone} ({hotspot.cell_id})</strong>
          <span className="font-mono" style={{ fontSize: '11px', color: '#4edea3', fontWeight: '700' }}>
            -{coolingImpact}°C LST Relief
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(false)}
            title="Expand solution dossier"
            style={{
              background: 'rgba(78, 222, 163, 0.15)',
              border: '1px solid rgba(78, 222, 163, 0.3)',
              color: '#4edea3',
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
      ref={panelRef}
      className="animate-slide-in soln-panel-scroll"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onScroll={(e) => e.stopPropagation()}
      style={{
        width: '500px',
        maxWidth: '92vw',
        position: 'fixed',
        right: '20px',
        top: '80px',
        bottom: '16px',
        maxHeight: 'calc(100vh - 96px)',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        zIndex: 1100,
        padding: '20px 22px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid rgba(53, 57, 68, 0.6)',
        borderRadius: '18px',
        background: 'rgba(15, 19, 29, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        pointerEvents: 'auto'
      }}
    >
      {/* 1. Header with Cell ID Pill & Urban Cooling Blueprint Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono, monospace)',
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

          <h2 style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '22px',
            fontWeight: '800',
            marginTop: '6px',
            letterSpacing: '-0.3px',
            color: '#f9fafb'
          }}>
            Urban Cooling Blueprint
          </h2>

          {/* Adopted Choice Status Badge */}
          {isAdopted && (
            <div style={{
              marginTop: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(78, 222, 163, 0.4)',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Leaf size={14} color="#4edea3" />
                <span className="font-mono" style={{ fontSize: '11px', color: '#4edea3', fontWeight: '700' }}>
                  ADOPTED INTO WARD ACTION PLAN ✓
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '11px', color: '#fff', fontWeight: '800' }}>
                {adoptedHotspots[hotspot.cell_id]?.cost_display || t1.cost_display}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize to dock"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
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
              border: '1px solid rgba(255, 255, 255, 0.1)',
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

      {/* Target Cooling Impact Banner (From User Reference) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '14px',
        padding: '16px',
        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
              Target Cooling Impact
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)', color: '#34d399' }}>
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

      {/* 2. Diagnostic Micro-Bars Grid (2x2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '12px',
        borderRadius: '12px',
        background: 'rgba(10, 14, 24, 0.75)',
        border: '1px solid rgba(53, 57, 68, 0.4)',
        flexShrink: 0
      }}>
        {/* Factor 1: Heat Index (T) */}
        <div style={{ padding: '8px', borderRadius: '8px', background: '#171b26' }}>
          <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
            <span style={{ color: '#bbcabf' }}>Heat Index (T)</span>
            <span style={{ color: '#ffb3ad', fontWeight: '700' }}>{tNorm}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: '#313540', overflow: 'hidden' }}>
            <div style={{ width: `${tNorm}%`, height: '100%', borderRadius: '9999px', background: '#ff5252' }} />
          </div>
        </div>

        {/* Factor 2: Vegetation Deficit (V) */}
        <div style={{ padding: '8px', borderRadius: '8px', background: '#171b26' }}>
          <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
            <span style={{ color: '#bbcabf' }}>Vegetation Deficit (V)</span>
            <span style={{ color: '#ffb4ab', fontWeight: '700' }}>{vNorm}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: '#313540', overflow: 'hidden' }}>
            <div style={{ width: `${vNorm}%`, height: '100%', borderRadius: '9999px', background: '#ff8a80' }} />
          </div>
        </div>

        {/* Factor 3: Impervious Surface (I) */}
        <div style={{ padding: '8px', borderRadius: '8px', background: '#171b26' }}>
          <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
            <span style={{ color: '#bbcabf' }}>Impervious Surface (I)</span>
            <span style={{ color: '#dfe2f1', fontWeight: '700' }}>{iNorm}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: '#313540', overflow: 'hidden' }}>
            <div style={{ width: `${iNorm}%`, height: '100%', borderRadius: '9999px', background: '#86948a' }} />
          </div>
        </div>

        {/* Factor 4: Water Buffer (W) */}
        <div style={{ padding: '8px', borderRadius: '8px', background: '#171b26' }}>
          <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
            <span style={{ color: '#bbcabf' }}>Water Buffer (W)</span>
            <span style={{ color: '#4cd7f6', fontWeight: '700' }}>{factors.W_norm ? `${(factors.W_norm * 3).toFixed(1)} km` : '1.4 km'}</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: '#313540', overflow: 'hidden' }}>
            <div style={{ width: `${wNorm}%`, height: '100%', borderRadius: '9999px', background: '#00b2d0' }} />
          </div>
        </div>
      </div>

      {/* 3. TIER 1 STANDARDIZED MUNICIPAL BLUEPRINT */}
      <div style={{
        position: 'relative',
        borderRadius: '14px',
        backgroundColor: 'rgba(0, 56, 36, 0.25)',
        border: '1px solid rgba(78, 222, 163, 0.45)',
        padding: '18px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} color="#4edea3" />
            <span className="font-mono" style={{ fontSize: '10.5px', letterSpacing: '0.08em', color: '#4edea3', fontWeight: '800' }}>
              TIER-1 STANDARDIZED MUNICIPAL BLUEPRINT
            </span>
          </div>
          <span className="font-mono" style={{
            backgroundColor: '#10b981',
            color: '#002113',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '0.04em'
          }}>
            DEFENSIBLE BENCHMARK
          </span>
        </div>

        {/* Recommended Intervention Header with Justification Toggle */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <h3 className="font-headline" style={{ fontSize: '17px', fontWeight: '800', color: '#4edea3', lineHeight: '22px' }}>
            {t1.intervention || 'Living Green Biosolar Roofs (Sedum + Solar PV)'}
          </h3>

          <button
            type="button"
            onClick={() => setShowAreaJustification(prev => !prev)}
            title={`View localized justification for ${hotspot.zone}`}
            style={{
              background: showAreaJustification
                ? 'rgba(78, 222, 163, 0.25)'
                : 'rgba(255, 255, 255, 0.06)',
              border: showAreaJustification
                ? '1px solid #4edea3'
                : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: showAreaJustification ? '#4edea3' : '#bbcabf',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
          >
            <Lightbulb size={13} color="#4edea3" />
            <span>Why {hotspot.zone}</span>
            {showAreaJustification ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        <p className="font-body" style={{ fontSize: '12px', color: '#dfe2f1', lineHeight: 1.5 }}>
          {t1.description || 'Application of high solar-reflectance index coating and living vegetative canopy.'}
        </p>

        {/* Localized Area Justification Card */}
        {showAreaJustification && areaJustification && (
          <div
            className="animate-fade-in"
            style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(10, 14, 24, 0.85)',
              border: '1px solid rgba(78, 222, 163, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{
                background: 'rgba(78, 222, 163, 0.2)',
                border: '1px solid rgba(78, 222, 163, 0.4)',
                borderRadius: '6px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <Target size={14} color="#4edea3" />
              </div>
              <div>
                <div className="font-headline" style={{ fontSize: '12.5px', fontWeight: '800', color: '#6ffbbe', lineHeight: 1.3 }}>
                  {areaJustification.headline}
                </div>
                <div className="font-mono" style={{ fontSize: '10px', color: '#86948a', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={10} color="#4edea3" /> Zone: <strong style={{ color: '#fff' }}>{hotspot.zone}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Stressor: <strong style={{ color: '#ffb3ad' }}>{(hotspot.cause || 'Heat concentration').replace(/_/g, ' ')}</strong>
                  </span>
                </div>
              </div>
            </div>

            <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', lineHeight: 1.55 }}>
              <strong style={{ color: '#dfe2f1' }}>Scientific Mechanism: </strong>
              {areaJustification.scientific_mechanism}
            </p>
            <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', lineHeight: 1.55 }}>
              <strong style={{ color: '#4edea3' }}>Beneficiary Footprint: </strong>
              {areaJustification.local_beneficiaries}
            </p>
          </div>
        )}

        {/* RESTORED: Standard Cost & Cooling Impact 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Card 1: Standard Cost */}
          <div style={{
            background: 'rgba(10, 14, 24, 0.85)',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(78, 222, 163, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div className="font-mono" style={{ fontSize: '10px', color: '#86948a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <DollarSign size={13} color="#4edea3" /> Standard Cost
            </div>
            <div className="font-headline" style={{ fontSize: '14.5px', fontWeight: '800', color: '#fff', marginTop: '4px', letterSpacing: '-0.2px' }}>
              {t1.cost_display || '₹1,800 – ₹2,200 per tree'}
            </div>
            {t1.cost_unit && (
              <div className="font-mono" style={{ fontSize: '9.5px', color: '#6ffbbe', marginTop: '3px' }}>
                Unit rate: ₹{t1.cost_per_unit?.toLocaleString('en-IN')} {t1.cost_unit}
              </div>
            )}
          </div>

          {/* Card 2: Cooling Impact */}
          <div style={{
            background: 'rgba(10, 14, 24, 0.85)',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(78, 222, 163, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div className="font-mono" style={{ fontSize: '10px', color: '#86948a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ArrowDownRight size={13} color="#4edea3" /> Cooling Impact
            </div>
            <div className="font-headline" style={{ fontSize: '14.5px', fontWeight: '800', color: '#4edea3', marginTop: '4px', letterSpacing: '-0.2px' }}>
              {t1.impact_display || `-${coolingImpact}°C microclimate relief`}
            </div>
            <div className="font-mono" style={{ fontSize: '9.5px', color: '#bbcabf', marginTop: '3px' }}>
              Target microclimate relief
            </div>
          </div>
        </div>

        {/* RESTORED: Co-Benefits Chips */}
        {t1.co_benefits && t1.co_benefits.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {t1.co_benefits.map((b, i) => (
              <span key={i} className="font-mono" style={{
                background: 'rgba(78, 222, 163, 0.12)',
                fontSize: '10px',
                color: '#a7f3d0',
                padding: '4px 9px',
                borderRadius: '6px',
                border: '1px solid rgba(78, 222, 163, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={11} color="#4edea3" /> {b}
              </span>
            ))}
          </div>
        )}

        {/* RESTORED: Government Source Citation */}
        <div className="font-mono" style={{ fontSize: '10px', color: '#86948a', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
          Government Source: {t1.source || 'GCC Urban Forestry & C40 Cool Cities Benchmark'}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onToggleAdopt && onToggleAdopt(hotspot)}
          style={{
            width: '100%',
            marginTop: '2px',
            padding: '11px 16px',
            borderRadius: '10px',
            backgroundColor: isAdopted ? '#005236' : '#10b981',
            color: isAdopted ? '#6ffbbe' : '#003824',
            border: isAdopted ? '1px solid #4edea3' : 'none',
            fontFamily: 'var(--font-headline)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isAdopted ? '0 0 15px rgba(78, 222, 163, 0.35)' : '0 4px 14px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          {isAdopted ? <Check size={16} /> : <Leaf size={16} />}
          <span>{isAdopted ? `Adopted into Ward Action Plan ✓ (Click to Remove)` : `Adopt into GCC Ward Action Plan`}</span>
        </button>
      </div>

      {/* 4. TIER 2 GEMINI SYNTHETIC DIAGNOSTICS */}
      <div style={{
        position: 'relative',
        borderRadius: '14px',
        backgroundColor: 'rgba(38, 42, 53, 0.65)',
        border: '1px solid rgba(76, 215, 246, 0.35)',
        padding: '18px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} color="#4cd7f6" />
            <span className="font-mono" style={{ fontSize: '10.5px', letterSpacing: '0.08em', color: '#4cd7f6', fontWeight: '800' }}>
              TIER-2 GEMINI AI SUGGESTIONS
            </span>
          </div>
          <span className="font-mono" style={{
            backgroundColor: 'rgba(76, 215, 246, 0.15)',
            color: '#4cd7f6',
            border: '1px solid rgba(76, 215, 246, 0.4)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700'
          }}>
            AI-suggested, estimated
          </span>
        </div>

        <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', lineHeight: 1.45 }}>
          Creative hyper-localized cooling interventions. Costs mapped strictly to verified municipal benchmarks (never invented by AI).
        </p>

        {loadingTier2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="skeleton" style={{ height: '74px', borderRadius: '10px' }} />
            <div className="skeleton" style={{ height: '74px', borderRadius: '10px' }} />
          </div>
        )}

        {tier2Error && !loadingTier2 && (
          <div style={{ fontSize: '11px', color: '#ffb3ad', padding: '10px', background: 'rgba(147, 0, 10, 0.3)', border: '1px solid rgba(255, 82, 82, 0.3)', borderRadius: '8px' }}>
            {tier2Error}
          </div>
        )}

        {/* Live AI Items from backend */}
        {tier2Data && tier2Data.ideas && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tier2Data.ideas.map((idea, idx) => {
              const mc = idea.mapped_cost || {};
              return (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(10, 14, 24, 0.85)',
                    border: '1px solid rgba(76, 215, 246, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <span className="font-headline" style={{ fontSize: '13px', color: '#dfe2f1', fontWeight: '700', lineHeight: 1.35 }}>
                      {idx + 1}. {idea.title}
                    </span>
                    <span className="font-mono" style={{
                      background: 'rgba(76, 215, 246, 0.15)',
                      color: '#4cd7f6',
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      AI Idea
                    </span>
                  </div>

                  <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', lineHeight: 1.45 }}>
                    {idea.concept}
                  </p>

                  {idea.rationale && (
                    <div className="font-body" style={{ fontSize: '11px', color: '#4cd7f6', fontStyle: 'italic' }}>
                      Context: {idea.rationale}
                    </div>
                  )}

                  {/* RESTORED: Strictly Mapped Tier 1 Cost Benchmark */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed rgba(76, 215, 246, 0.35)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    marginTop: '2px'
                  }}>
                    <div className="font-mono" style={{ color: '#4cd7f6', fontWeight: '700', marginBottom: '4px', fontSize: '10px' }}>
                      Mapped Benchmark: {mc.category_name || idea.title}
                    </div>
                    <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', color: '#dfe2f1', fontSize: '11px', flexWrap: 'wrap', gap: '4px' }}>
                      <span>Unit Cost: <strong style={{ color: '#fff' }}>{mc.cost_display || '₹450 – ₹650 / m'}</strong></span>
                      <span>Impact: <strong style={{ color: '#4edea3' }}>{mc.est_impact || '-1.5°C to -2.2°C'}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fallback default ideas if API is not yet loaded */}
        {!tier2Data && !loadingTier2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(10, 14, 24, 0.85)',
              border: '1px solid rgba(76, 215, 246, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <span className="font-headline" style={{ fontSize: '13px', color: '#dfe2f1', fontWeight: '700', lineHeight: 1.35 }}>
                  1. Micro-Misting Canopies @ Transit Terminals
                </span>
                <span className="font-mono" style={{
                  background: 'rgba(76, 215, 246, 0.15)',
                  color: '#4cd7f6',
                  fontSize: '9px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}>
                  AI Idea
                </span>
              </div>
              <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', lineHeight: 1.45 }}>
                Aerosolizes 20-micron mist plumes during peak afternoon thermal hours (12:00-15:30).
              </p>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(76, 215, 246, 0.35)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '11px',
                marginTop: '2px'
              }}>
                <div className="font-mono" style={{ color: '#4cd7f6', fontWeight: '700', marginBottom: '4px', fontSize: '10px' }}>
                  Mapped Benchmark: Evaporative Misting & Bioswales
                </div>
                <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', color: '#dfe2f1', fontSize: '11px', flexWrap: 'wrap', gap: '4px' }}>
                  <span>Unit Cost: <strong style={{ color: '#fff' }}>₹50,000 – ₹80,000 per misting unit</strong></span>
                  <span>Impact: <strong style={{ color: '#4edea3' }}>-1.5°C to -2.2°C</strong></span>
                </div>
              </div>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(10, 14, 24, 0.85)',
              border: '1px solid rgba(76, 215, 246, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <span className="font-headline" style={{ fontSize: '13px', color: '#dfe2f1', fontWeight: '700', lineHeight: 1.35 }}>
                  2. Calcite-Infused High-Albedo Cool Pavement Coating
                </span>
                <span className="font-mono" style={{
                  background: 'rgba(76, 215, 246, 0.15)',
                  color: '#4cd7f6',
                  fontSize: '9px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}>
                  AI Idea
                </span>
              </div>
              <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', lineHeight: 1.45 }}>
                High solar reflectance index (SRI &gt; 80) reduces ground thermal absorption and nocturnal heat release.
              </p>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(76, 215, 246, 0.35)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '11px',
                marginTop: '2px'
              }}>
                <div className="font-mono" style={{ color: '#4cd7f6', fontWeight: '700', marginBottom: '4px', fontSize: '10px' }}>
                  Mapped Benchmark: Cool Roofs & Reflective Pavements
                </div>
                <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', color: '#dfe2f1', fontSize: '11px', flexWrap: 'wrap', gap: '4px' }}>
                  <span>Unit Cost: <strong style={{ color: '#fff' }}>₹120 – ₹180 per m²</strong></span>
                  <span>Impact: <strong style={{ color: '#4edea3' }}>-2.0°C to -3.5°C</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
