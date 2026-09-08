import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import { ENDPOINTS } from '../config/api';

export default function DetailPanel({ hotspot, onClose }) {
  const [tier2Data, setTier2Data] = useState(null);
  const [loadingTier2, setLoadingTier2] = useState(false);
  const [tier2Error, setTier2Error] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAreaJustification, setShowAreaJustification] = useState(true);
  const [adopted, setAdopted] = useState(false);

  // Fetch Tier 2 on-demand ONLY when the hotspot is selected
  useEffect(() => {
    if (!hotspot || !hotspot.cell_id) return;

    let isMounted = true;
    setTier2Data(null);
    setTier2Error(null);
    setLoadingTier2(true);
    setShowAreaJustification(true);
    setAdopted(false);

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
      className="animate-slide-in"
      style={{
        width: '490px',
        maxWidth: '92vw',
        height: 'calc(100vh - 130px)',
        overflowY: 'auto',
        position: 'fixed',
        right: '20px',
        top: '110px',
        zIndex: 1100,
        padding: '22px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid rgba(53, 57, 68, 0.5)',
        borderRadius: '18px',
        background: 'rgba(15, 19, 29, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* 1. Header & Coordinates Dossier */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-mono" style={{
              background: '#262a35',
              border: '1px solid rgba(78, 222, 163, 0.3)',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#4edea3',
              fontWeight: '700'
            }}>
              CELL {hotspot.cell_id}
            </span>
            <span className="font-mono" style={{
              background: 'rgba(147, 0, 10, 0.85)',
              border: '1px solid #ff5252',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '10.5px',
              color: '#ffb3ad',
              fontWeight: '700'
            }}>
              {heatScore.toFixed(2)} CRITICAL
            </span>
          </div>

          <h2 className="font-headline" style={{ fontSize: '20px', fontWeight: '800', marginTop: '8px', color: '#dfe2f1', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
            {hotspot.zone} Cluster
          </h2>
          <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', marginTop: '2px' }}>
            {hotspot.lat?.toFixed ? `${hotspot.lat.toFixed(4)}° N, ${hotspot.lon.toFixed(4)}° E` : `${hotspot.lat}° N, ${hotspot.lon}° E`} • {hotspot.cause?.replace(/_/g, ' ') || 'Industrial Thermal Zone'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            padding: '8px',
            borderRadius: '10px',
            background: '#262a35',
            color: '#ff5252',
            border: '1px solid rgba(255, 82, 82, 0.25)'
          }}>
            <Flame size={20} />
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize to dock"
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
            <Minimize2 size={16} />
          </button>

          <button
            onClick={onClose}
            title="Close"
            style={{
              background: '#1c1f2a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#dfe2f1',
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
      </div>

      {/* 2. Diagnostic Micro-Bars Grid (2x2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '12px',
        borderRadius: '12px',
        background: 'rgba(10, 14, 24, 0.75)',
        border: '1px solid rgba(53, 57, 68, 0.4)'
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
            <span style={{ color: '#4cd7f6', fontWeight: '700' }}>1.4 km</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: '#313540', overflow: 'hidden' }}>
            <div style={{ width: `${wNorm}%`, height: '100%', borderRadius: '9999px', background: '#00b2d0' }} />
          </div>
        </div>
      </div>

      {/* 3. TIER 1 STANDARDIZED MUNICIPAL BLUEPRINT (Stitch Emerald Glass Card) */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        backgroundColor: 'rgba(0, 56, 36, 0.25)',
        border: '1px solid rgba(78, 222, 163, 0.45)',
        padding: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-40px',
          height: '130px',
          width: '130px',
          borderRadius: '50%',
          backgroundColor: 'rgba(78, 222, 163, 0.1)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} color="#4edea3" />
            <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#4edea3', fontWeight: '800' }}>
              TIER-1 STANDARDIZED MUNICIPAL BLUEPRINT
            </span>
          </div>
          <span className="font-mono" style={{
            backgroundColor: '#10b981',
            color: '#002113',
            padding: '2px 7px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '800'
          }}>
            PRIORITY-1
          </span>
        </div>

        <h3 className="font-headline" style={{ fontSize: '17px', fontWeight: '700', color: '#dfe2f1', lineHeight: '22px' }}>
          {t1.intervention || 'Living Green Biosolar Roofs (Sedum + Solar PV)'}
        </h3>

        {/* Expandable Justification Box */}
        <div style={{
          padding: '12px',
          borderRadius: '10px',
          backgroundColor: 'rgba(10, 14, 24, 0.85)',
          border: '1px solid rgba(78, 222, 163, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <p className="font-body" style={{ fontSize: '11.5px', color: '#bbcabf', lineHeight: 1.55 }}>
            <strong style={{ color: '#dfe2f1' }}>Scientific Mechanism: </strong>
            {areaJustification.scientific_mechanism}
          </p>
          <p className="font-body" style={{ fontSize: '11.5px', color: '#4edea3', lineHeight: 1.55 }}>
            <strong style={{ color: '#dfe2f1' }}>Beneficiary Footprint: </strong>
            {areaJustification.local_beneficiaries}
          </p>
        </div>

        {/* Key Metrics: Capex, Cooling Delta, ROI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', paddingTop: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-mono" style={{ fontSize: '9px', color: '#86948a', letterSpacing: '0.05em' }}>EST. CAPEX</span>
            <span className="font-headline" style={{ fontSize: '17px', color: '#dfe2f1', fontWeight: '700' }}>
              {t1.cost_display || '₹1,800/m²'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-mono" style={{ fontSize: '9px', color: '#86948a', letterSpacing: '0.05em' }}>COOLING DELTA</span>
            <span className="font-headline" style={{ fontSize: '17px', color: '#4edea3', fontWeight: '700' }}>
              -{coolingImpact}°C <span className="font-body" style={{ fontSize: '11px', color: '#bbcabf', fontWeight: '400' }}>LST</span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-mono" style={{ fontSize: '9px', color: '#86948a', letterSpacing: '0.05em' }}>PAYBACK FACTOR</span>
            <span className="font-headline" style={{ fontSize: '17px', color: '#4cd7f6', fontWeight: '700' }}>
              4.8x <span className="font-body" style={{ fontSize: '11px', color: '#bbcabf', fontWeight: '400' }}>ROI</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setAdopted(true)}
          style={{
            width: '100%',
            marginTop: '4px',
            padding: '10px 16px',
            borderRadius: '10px',
            backgroundColor: adopted ? '#006c49' : '#10b981',
            color: adopted ? '#6ffbbe' : '#003824',
            border: 'none',
            fontFamily: 'var(--font-headline)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          {adopted ? <Check size={16} /> : <Leaf size={16} />}
          <span>{adopted ? `Adopted into Ward Action Plan ✓` : `Adopt into GCC Ward Action Plan`}</span>
        </button>
      </div>

      {/* 4. TIER 2 GEMINI SYNTHETIC DIAGNOSTICS (Stitch Cyan/Purple Card) */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        backgroundColor: 'rgba(38, 42, 53, 0.65)',
        border: '1px solid rgba(76, 215, 246, 0.35)',
        padding: '16px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} color="#4cd7f6" />
            <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#4cd7f6', fontWeight: '800' }}>
              GEMINI SYNTHETIC DIAGNOSTICS
            </span>
          </div>
          <span className="font-mono" style={{
            backgroundColor: '#1c1f2a',
            color: '#bbcabf',
            padding: '2px 7px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            GEN-AI 2.5
          </span>
        </div>

        {loadingTier2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton" style={{ height: '54px' }} />
            <div className="skeleton" style={{ height: '54px' }} />
          </div>
        )}

        {tier2Error && !loadingTier2 && (
          <div style={{ fontSize: '11px', color: '#ffb3ad', padding: '8px', background: 'rgba(147, 0, 10, 0.2)', borderRadius: '6px' }}>
            {tier2Error}
          </div>
        )}

        {/* Live AI Items from backend */}
        {tier2Data && tier2Data.ideas && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tier2Data.ideas.map((idea, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 14, 24, 0.85)',
                  border: '1px solid rgba(76, 215, 246, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="font-headline" style={{ fontSize: '12.5px', color: '#dfe2f1', fontWeight: '600' }}>
                    {idx + 1}. {idea.title}
                  </span>
                  <span className="font-mono" style={{ fontSize: '10.5px', color: '#4cd7f6', fontWeight: '700' }}>
                    {idea.mapped_cost?.cost_display || '₹450/m'}
                  </span>
                </div>
                <p className="font-body" style={{ fontSize: '11px', color: '#bbcabf', lineHeight: 1.45 }}>
                  {idea.concept}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Fallback default ideas if API is not yet loaded */}
        {!tier2Data && !loadingTier2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(10, 14, 24, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-headline" style={{ fontSize: '12.5px', color: '#dfe2f1', fontWeight: '600' }}>
                  1. Micro-Misting Canopies @ Transit Terminals
                </span>
                <span className="font-mono" style={{ fontSize: '10.5px', color: '#4cd7f6', fontWeight: '700' }}>₹450/m</span>
              </div>
              <p className="font-body" style={{ fontSize: '11px', color: '#bbcabf', lineHeight: 1.45 }}>
                Aerosolizes 20-micron mist plumes during peak afternoon thermal hours (12:00-15:30).
              </p>
            </div>

            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(10, 14, 24, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-headline" style={{ fontSize: '12.5px', color: '#dfe2f1', fontWeight: '600' }}>
                  2. Calcite-Infused Cool Pavement Coating
                </span>
                <span className="font-mono" style={{ fontSize: '10.5px', color: '#4cd7f6', fontWeight: '700' }}>₹850/m²</span>
              </div>
              <p className="font-body" style={{ fontSize: '11px', color: '#bbcabf', lineHeight: 1.45 }}>
                High solar reflectance index (SRI &gt; 80) reduces ground thermal re-radiation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
