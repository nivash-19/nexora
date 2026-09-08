import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Brain, SlidersHorizontal, CheckCircle2, TrendingDown, DollarSign, Flame, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { ENDPOINTS } from '../config/api';

const PRESET_BUDGETS = [
  { label: '₹2.5L', value: 250000 },
  { label: '₹5L', value: 500000 },
  { label: '₹10L', value: 1000000 },
  { label: '₹15L', value: 1500000 },
  { label: '₹25L', value: 2500000 },
  { label: '₹50L', value: 5000000 },
];

const ZONES = ['All Zones', 'Manali', 'Koyambedu', 'Ambattur', 'Anna Nagar', 'Teynampet', 'Perungudi'];

export default function AIBudgetAdvisorModal({
  isOpen,
  onClose,
  defaultZone = 'All Zones',
  adoptedHotspots = {},
  onToggleAdopt,
  onAdoptMultiple,
  onOpenChatbot,
  initialBudget = 1000000
}) {
  const [budget, setBudget] = useState(initialBudget ? Number(initialBudget) : 1000000);
  const [selectedZone, setSelectedZone] = useState(defaultZone || 'All Zones');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adoptedFeedback, setAdoptedFeedback] = useState(false);

  useEffect(() => {
    if (defaultZone) {
      setSelectedZone(defaultZone);
    }
  }, [defaultZone]);

  const fetchAIOptimization = (budgetVal = budget, zoneVal = selectedZone) => {
    const num = parseFloat(budgetVal);
    if (isNaN(num) || num <= 0) return;
    setLoading(true);
    setError(null);

    axios.post(ENDPOINTS.OPTIMIZE_BUDGET, {
      budget: num,
      zone: zoneVal && zoneVal !== 'All Zones' ? zoneVal : null
    })
      .then(res => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to compute AI priority allocation.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchAIOptimization(budget, selectedZone);
    }, 200);
    return () => clearTimeout(timer);
  }, [isOpen, budget, selectedZone]);

  if (!isOpen) return null;

  const allocatedList = result?.allocations || [];
  const totalAllocated = result?.total_allocated || 0;
  const remainingBudget = result?.remaining_budget || 0;
  const avgCooling = result?.estimated_avg_cooling_celsius || 0;
  const maxCooling = result?.estimated_max_cooling_celsius || 0;

  const handleAdoptAll = () => {
    if (allocatedList.length === 0) return;
    onAdoptMultiple(allocatedList);
    setAdoptedFeedback(true);
    setTimeout(() => setAdoptedFeedback(false), 2500);
  };

  const getTierColor = (tier) => {
    if (tier?.includes('CRITICAL')) return { text: '#ff5252', bg: 'rgba(255, 23, 68, 0.15)', border: 'rgba(255, 23, 68, 0.35)' };
    if (tier?.includes('HIGH')) return { text: '#ff9100', bg: 'rgba(255, 145, 0, 0.15)', border: 'rgba(255, 145, 0, 0.35)' };
    return { text: '#4cd7f6', bg: 'rgba(76, 215, 246, 0.15)', border: 'rgba(76, 215, 246, 0.35)' };
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      zIndex: 2100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{
        width: '920px',
        maxHeight: '90vh',
        background: '#0d111c',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '20px',
        boxShadow: '0 25px 65px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(53, 57, 68, 0.5)',
          background: 'rgba(15, 19, 29, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)'
            }}>
              <Brain size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="font-headline" style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>
                  AI Budget & Priority Advisor
                </h2>
                <span className="font-mono" style={{
                  fontSize: '10.5px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: '700'
                }}>
                  LL & LST OPTIMIZED
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#86948a', margin: '2px 0 0 0' }}>
                Identifies which Chennai zones need the most urgent attention with microclimate reasons, budget allocation, and LST relief.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#86948a',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#86948a'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Controls: Budget Selector & Sector Scope */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(18, 22, 34, 0.85)',
          borderBottom: '1px solid rgba(53, 57, 68, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            {/* Budget Input & Presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#c084fc', fontWeight: '700', letterSpacing: '0.06em' }}>
                  SET YOUR MUNICIPAL BUDGET (INR):
                </span>
                <span className="font-mono" style={{ fontSize: '14px', color: '#4edea3', fontWeight: '800' }}>
                  ₹{Number(budget).toLocaleString('en-IN')} (₹{(budget / 100000).toFixed(2)} Lakhs)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {PRESET_BUDGETS.map((item) => {
                  const isSelected = budget === item.value;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setBudget(item.value)}
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)' : '#1c202d',
                        color: isSelected ? '#fff' : '#dfe2f1',
                        border: isSelected ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '5px 12px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: '#86948a', fontWeight: '700' }}>
                TARGET SECTOR:
              </span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                style={{
                  background: '#1c202d',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                {ZONES.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Executive Summary Ribbon */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
          }}>
            <div style={{ background: 'rgba(255, 23, 68, 0.12)', border: '1px solid rgba(255, 23, 68, 0.3)', borderRadius: '10px', padding: '10px 14px' }}>
              <div style={{ fontSize: '10.5px', color: '#ff8a80', fontWeight: '700' }}>HIGHEST ATTENTION ZONE</div>
              <div style={{ fontSize: '15px', color: '#fff', fontWeight: '800', marginTop: '2px' }}>
                🔥 Manali Petrochem
              </div>
              <div style={{ fontSize: '10px', color: '#ffcdd2' }}>43.5°C Peak • 142k Workers</div>
            </div>

            <div style={{ background: 'rgba(78, 222, 163, 0.12)', border: '1px solid rgba(78, 222, 163, 0.3)', borderRadius: '10px', padding: '10px 14px' }}>
              <div style={{ fontSize: '10.5px', color: '#a7f3d0', fontWeight: '700' }}>BUDGET ALLOCATED</div>
              <div style={{ fontSize: '15px', color: '#4edea3', fontWeight: '800', marginTop: '2px' }}>
                ₹{(totalAllocated / 100000).toFixed(2)}L <span style={{ fontSize: '11px', color: '#86948a', fontWeight: '400' }}>/ ₹{(budget / 100000).toFixed(2)}L</span>
              </div>
              <div style={{ fontSize: '10px', color: '#bbcabf' }}>Reserve: ₹{(remainingBudget / 100000).toFixed(2)}L</div>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '10px', padding: '10px 14px' }}>
              <div style={{ fontSize: '10.5px', color: '#a5f3fc', fontWeight: '700' }}>PROJECTED LST RELIEF ("LL")</div>
              <div style={{ fontSize: '15px', color: '#22d3ee', fontWeight: '800', marginTop: '2px' }}>
                -{maxCooling}°C Peak LST
              </div>
              <div style={{ fontSize: '10px', color: '#bbcabf' }}>Avg Drop: -{avgCooling}°C</div>
            </div>

            <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '10px 14px' }}>
              <div style={{ fontSize: '10.5px', color: '#d8b4fe', fontWeight: '700' }}>PRIORITY SITES FUNDED</div>
              <div style={{ fontSize: '15px', color: '#c084fc', fontWeight: '800', marginTop: '2px' }}>
                {allocatedList.length} Critical Corridors
              </div>
              <div style={{ fontSize: '10px', color: '#bbcabf' }}>Ranked by Vulnerability</div>
            </div>
          </div>
        </div>

        {/* Modal Body: Ranked Allocations & Specific Reasons */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-mono" style={{ fontSize: '12px', color: '#dfe2f1', fontWeight: '700' }}>
              AI PRIORITY RANKING: WHICH SITES NEED THE MOST ATTENTION & WHY
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>
              Triage order based on thermal index, population exposure, and canopy loss
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#c084fc' }}>
              <Brain size={32} className="spinning" style={{ margin: '0 auto 12px auto' }} />
              <div>Computing AI Priority Allocation...</div>
            </div>
          ) : allocatedList.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#86948a', background: '#171b26', borderRadius: '12px' }}>
              No sites could be allocated with the current budget. Try increasing your budget to at least ₹1,00,000.
            </div>
          ) : (
            allocatedList.map((site) => {
              const badgeStyle = getTierColor(site.attention_tier);
              const isAdopted = !!adoptedHotspots[site.cell_id];

              return (
                <div
                  key={site.cell_id}
                  style={{
                    background: 'rgba(18, 22, 34, 0.95)',
                    border: `1px solid ${isAdopted ? '#4edea3' : badgeStyle.border}`,
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: isAdopted ? '0 0 16px rgba(78, 222, 163, 0.15)' : 'none'
                  }}
                >
                  {/* Top Site Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="font-mono" style={{
                        background: '#262a35',
                        color: '#dfe2f1',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}>
                        PRIORITY #{site.attention_rank}
                      </span>
                      <h3 className="font-headline" style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                        {site.zone} Sector
                      </h3>
                      <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>
                        [{site.cell_id}]
                      </span>
                      <span className="font-mono" style={{
                        background: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '10.5px',
                        fontWeight: '700'
                      }}>
                        {site.attention_tier}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="font-mono" style={{ fontSize: '13px', color: '#ff5252', fontWeight: '800' }}>
                        {site.temperature_celsius}°C LST
                      </span>
                      <span className="font-mono" style={{
                        fontSize: '13px',
                        color: '#4edea3',
                        fontWeight: '800',
                        background: 'rgba(78, 222, 163, 0.12)',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {site.cost_display}
                      </span>
                    </div>
                  </div>

                  {/* Why this area needs most attention (Bullet Points) */}
                  <div style={{
                    background: 'rgba(10, 14, 24, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '10px 14px'
                  }}>
                    <span className="font-mono" style={{ fontSize: '10.5px', color: '#c084fc', fontWeight: '700', letterSpacing: '0.05em' }}>
                      WHY THIS REGION NEEDS ATTENTION:
                    </span>
                    <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#dfe2f1', lineHeight: '1.55' }}>
                      {site.reasons?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Intervention, LST Drop ("LL"), and Mitigation */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    paddingTop: '4px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#bbcabf' }}>Recommended Solution:</span>
                        <strong style={{ fontSize: '12.5px', color: '#4edea3' }}>{site.intervention}</strong>
                        <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>({site.scale})</span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📉 <strong>LST Impact:</strong> {site.lst_drop_display} reduction</span>
                        <span style={{ color: '#86948a' }}>•</span>
                        <span style={{ color: '#ffb3ad' }}>{site.loss_mitigation}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleAdopt(site)}
                      style={{
                        background: isAdopted ? 'rgba(78, 222, 163, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        border: isAdopted ? '1px solid #4edea3' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: isAdopted ? '#4edea3' : '#dfe2f1',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <CheckCircle2 size={13} color={isAdopted ? '#4edea3' : '#86948a'} />
                      <span>{isAdopted ? 'Adopted in Action Plan' : 'Adopt Choice'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(53, 57, 68, 0.5)',
          background: 'rgba(15, 19, 29, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              onClose();
              if (onOpenChatbot) onOpenChatbot();
            }}
            style={{
              background: 'rgba(76, 215, 246, 0.12)',
              border: '1px solid rgba(76, 215, 246, 0.3)',
              color: '#4cd7f6',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(76, 215, 246, 0.22)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(76, 215, 246, 0.12)'; }}
          >
            <MessageSquare size={14} />
            <span>Ask Nexora Cooling Pilot About This Plan</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#bbcabf',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>

            <button
              onClick={handleAdoptAll}
              disabled={allocatedList.length === 0}
              style={{
                background: adoptedFeedback
                  ? '#10b981'
                  : 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: allocatedList.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(168, 85, 247, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={15} />
              <span>{adoptedFeedback ? '✓ Adopted to Ward Action Plan!' : `Adopt All ${allocatedList.length} Priority Sites`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
