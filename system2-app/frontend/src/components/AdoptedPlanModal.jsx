import React from 'react';
import { X, Leaf, Trash2, SlidersHorizontal, CheckCircle2, TrendingDown, Layers, ShieldCheck, MapPin } from 'lucide-react';

export default function AdoptedPlanModal({
  isOpen,
  onClose,
  adoptedHotspots = {},
  onRemoveAdopted,
  onClearAll,
  onOpenBudgetModal
}) {
  if (!isOpen) return null;

  const adoptedList = Object.values(adoptedHotspots);
  const totalCost = adoptedList.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const totalCostLakhs = (totalCost / 100000).toFixed(2);
  const avgCooling = adoptedList.length > 0
    ? (adoptedList.reduce((sum, item) => sum + (Number(item.delta_t) || 2.0), 0) / adoptedList.length).toFixed(1)
    : '0.0';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 2100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{
        width: '900px',
        maxWidth: '96vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0f131d',
        border: '1px solid rgba(78, 222, 163, 0.4)',
        borderRadius: '20px',
        padding: '24px 28px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 30px rgba(78, 222, 163, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Modal Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(0, 178, 208, 0.25) 100%)',
              border: '1px solid rgba(78, 222, 163, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={24} color="#4edea3" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="font-headline" style={{ fontSize: '20px', fontWeight: '800', color: '#dfe2f1', margin: 0 }}>
                  GCC Municipal Ward Action Plan
                </h2>
                <span className="font-mono" style={{
                  background: 'rgba(78, 222, 163, 0.15)',
                  color: '#4edea3',
                  border: '1px solid rgba(78, 222, 163, 0.3)',
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: '700'
                }}>
                  {adoptedList.length} SITES ADOPTED
                </span>
              </div>
              <p className="font-body" style={{ fontSize: '12.5px', color: '#86948a', margin: '4px 0 0 0' }}>
                Committed cooling interventions selected across Chennai micro-grid cells with verified schedule rates.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#86948a',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#86948a'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 3 Top Summary Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'rgba(28, 31, 42, 0.65)',
            border: '1px solid rgba(53, 57, 68, 0.4)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span className="font-mono" style={{ fontSize: '9.5px', color: '#86948a', letterSpacing: '0.06em' }}>
              COMMITTED SITES
            </span>
            <span className="font-headline" style={{ fontSize: '22px', color: '#dfe2f1', fontWeight: '800', marginTop: '4px' }}>
              {adoptedList.length} <span style={{ fontSize: '13px', color: '#86948a', fontWeight: '400' }}>/ 20 mapped</span>
            </span>
            <span className="font-mono" style={{ fontSize: '10px', color: '#4edea3', fontWeight: '700', marginTop: '2px' }}>
              GCC C40 Priority Coverage
            </span>
          </div>

          <div style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'rgba(28, 31, 42, 0.65)',
            border: '1px solid rgba(78, 222, 163, 0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span className="font-mono" style={{ fontSize: '9.5px', color: '#86948a', letterSpacing: '0.06em' }}>
              COMMITTED CAPEX (INR)
            </span>
            <span className="font-headline" style={{ fontSize: '22px', color: '#4edea3', fontWeight: '800', marginTop: '4px' }}>
              ₹{totalCostLakhs} <span style={{ fontSize: '14px', color: '#86948a' }}>Lakhs</span>
            </span>
            <span className="font-mono" style={{ fontSize: '10px', color: '#86948a', marginTop: '2px' }}>
              Total: ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'rgba(28, 31, 42, 0.65)',
            border: '1px solid rgba(76, 215, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span className="font-mono" style={{ fontSize: '9.5px', color: '#86948a', letterSpacing: '0.06em' }}>
              EST. NET COOLING RELIEF
            </span>
            <span className="font-headline" style={{ fontSize: '22px', color: '#4cd7f6', fontWeight: '800', marginTop: '4px' }}>
              -{avgCooling}°C <span style={{ fontSize: '13px', color: '#86948a', fontWeight: '400' }}>microclimate</span>
            </span>
            <span className="font-mono" style={{ fontSize: '10px', color: '#4cd7f6', fontWeight: '700', marginTop: '2px' }}>
              Targeted Pedestrian Buffer
            </span>
          </div>
        </div>

        {/* Selected Choices List */}
        {adoptedList.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            borderRadius: '14px',
            background: 'rgba(23, 27, 38, 0.5)',
            border: '1px dashed rgba(53, 57, 68, 0.5)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Leaf size={32} color="#86948a" />
            <div style={{ color: '#dfe2f1', fontWeight: '700', fontSize: '14px' }}>
              No Hotspot Interventions Adopted Yet
            </div>
            <p className="font-body" style={{ color: '#86948a', fontSize: '12.5px', maxWidth: '450px', margin: 0 }}>
              Click on any hotspot on the map and press <strong style={{ color: '#4edea3' }}>"Adopt into GCC Ward Action Plan"</strong> in the detail panel to add it to your custom action plan and budget optimization.
            </p>
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
            borderRadius: '12px',
            background: 'rgba(23, 27, 38, 0.7)',
            border: '1px solid rgba(53, 57, 68, 0.4)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'rgba(38, 42, 53, 0.6)', borderBottom: '1px solid rgba(53, 57, 68, 0.5)' }}>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cell / Zone</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Adopted Intervention</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Standard Cost</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cooling Gain</th>
                  <th className="font-mono" style={{ padding: '10px 14px', color: '#86948a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Remove</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {adoptedList.map((item) => (
                  <tr
                    key={item.cell_id}
                    style={{
                      borderBottom: '1px solid rgba(53, 57, 68, 0.3)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(38, 42, 53, 0.4)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '11px 14px', color: '#ffb3ad', fontWeight: '700' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={12} color="#4edea3" />
                        <span>{item.cell_id}</span>
                        <span style={{ color: '#86948a', fontWeight: '400', fontSize: '11px' }}>({item.zone})</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', color: '#dfe2f1', fontWeight: '600' }}>
                      {item.intervention}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#4edea3', fontWeight: '700' }}>
                      {item.cost_display || `₹${Number(item.cost).toLocaleString('en-IN')}`}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#4cd7f6', fontWeight: '700' }}>
                      {item.impact_display || `-${item.delta_t || 2.0}°C LST`}
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onRemoveAdopted(item.cell_id)}
                        title="Remove from adopted plan"
                        style={{
                          background: 'rgba(255, 82, 82, 0.15)',
                          border: '1px solid rgba(255, 82, 82, 0.3)',
                          color: '#ffb3ad',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 82, 82, 0.15)'; e.currentTarget.style.color = '#ffb3ad'; }}
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Actions: Connect to Budget Optimizer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(53, 57, 68, 0.5)',
          paddingTop: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {adoptedList.length > 0 ? (
            <button
              onClick={onClearAll}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#86948a',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ffb3ad'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#86948a'; }}
            >
              <Trash2 size={13} />
              <span>Clear Adopted Plan</span>
            </button>
          ) : <div />}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#dfe2f1',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-headline)',
                fontWeight: '600'
              }}
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenBudgetModal(totalCost > 0 ? totalCost : 1500000);
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #00b2d0 100%)',
                border: 'none',
                color: '#003824',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '12.5px',
                cursor: 'pointer',
                fontFamily: 'var(--font-headline)',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Optimize Budget with Adopted Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
