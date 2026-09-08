import React, { useState, useEffect } from 'react';
import { Sparkles, Calculator, RefreshCw, Radio, Flame, ShieldAlert, Cpu, Leaf, Brain } from 'lucide-react';

const ZONES = [
  { id: 'All Zones', label: 'All Zones (7)' },
  { id: 'Manali', label: '🔥 Manali Petrochem' },
  { id: 'Koyambedu', label: 'Koyambedu Wholesale' },
  { id: 'Ambattur', label: 'Ambattur Industrial' },
  { id: 'Anna Nagar', label: 'Anna Nagar' },
  { id: 'Teynampet', label: 'Teynampet' },
  { id: 'Perungudi', label: 'Perungudi OMR' },
];

export default function Header({
  selectedZone,
  onSelectZone,
  onOpenBudgetModal,
  onOpenAIBudgetAdvisor,
  onOpenChatbot,
  hotspotCount,
  onRefresh,
  loading,
  viewMode,
  onToggleViewMode,
  adoptedCount = 0,
  onOpenAdoptedModal,
  activeTelemetryLayer = 'diff',
  setActiveTelemetryLayer
}) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata'
      });
      setCurrentTime(`${timeStr} IST`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 20px 10px 20px' }}>
      {/* Top Navbar Header */}
      <header style={{
        background: 'rgba(10, 14, 24, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(53, 57, 68, 0.4)',
        borderRadius: '16px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #00b2d0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Flame size={22} color="#003824" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-headline" style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: '#dfe2f1' }}>
                Heat<span style={{ color: '#4edea3' }}>Scape</span>
              </span>
              <span className="font-mono" style={{
                fontSize: '11px',
                color: '#4cd7f6',
                background: '#262a35',
                padding: '2px 7px',
                borderRadius: '5px',
                fontWeight: '600',
                border: '1px solid rgba(76, 215, 246, 0.2)'
              }}>
                v3.4-PROD
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#4edea3', fontWeight: '700' }}>
              NEXORA CMA PLATFORM
            </span>
          </div>
        </div>

        {/* Live Telemetry Pill (Dynamic per active layer) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: activeTelemetryLayer === 'tirs'
            ? 'rgba(147, 0, 10, 0.35)'
            : activeTelemetryLayer === 'ndvi'
            ? 'rgba(40, 70, 15, 0.35)'
            : 'rgba(38, 42, 53, 0.65)',
          border: activeTelemetryLayer === 'tirs'
            ? '1px solid rgba(255, 23, 68, 0.45)'
            : activeTelemetryLayer === 'ndvi'
            ? '1px solid rgba(132, 204, 22, 0.45)'
            : '1px solid rgba(78, 222, 163, 0.35)',
          boxShadow: activeTelemetryLayer === 'tirs'
            ? '0 0 16px rgba(255, 23, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : activeTelemetryLayer === 'ndvi'
            ? '0 0 16px rgba(132, 204, 22, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 0 16px rgba(78, 222, 163, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ position: 'relative', display: 'flex', height: '9px', width: '9px' }}>
            <span style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: activeTelemetryLayer === 'tirs' ? '#ff5252' : activeTelemetryLayer === 'ndvi' ? '#a3e635' : '#4edea3',
              opacity: 0.75,
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
            <span style={{
              position: 'relative',
              borderRadius: '50%',
              height: '9px',
              width: '9px',
              backgroundColor: activeTelemetryLayer === 'tirs' ? '#ff1744' : activeTelemetryLayer === 'ndvi' ? '#84cc16' : '#10b981'
            }} />
          </span>
          <span className="font-mono" style={{
            fontSize: '11px',
            color: activeTelemetryLayer === 'tirs' ? '#ffd0cc' : activeTelemetryLayer === 'ndvi' ? '#e2f7bb' : '#dfe2f1',
            fontWeight: '700',
            letterSpacing: '0.04em'
          }}>
            {activeTelemetryLayer === 'tirs' && '🔥 TIRS THERMAL RADIOMETRY (BAND 10)'}
            {activeTelemetryLayer === 'ndvi' && '🌿 CANOPY NDVI SPECTRAL VEGETATION'}
            {activeTelemetryLayer === 'diff' && 'Δ INTERVENTION SIMULATION (BASELINE vs TARGET)'}
          </span>
          <span className="font-mono" style={{ fontSize: '11px', color: '#86948a' }}>|</span>
          <span className="font-mono" style={{
            fontSize: '11px',
            color: activeTelemetryLayer === 'tirs' ? '#ff8a80' : activeTelemetryLayer === 'ndvi' ? '#bef264' : '#4edea3',
            fontWeight: '700'
          }}>
            {activeTelemetryLayer === 'tirs' && `${hotspotCount} THERMAL PEAKS (UP TO 43.5°C)`}
            {activeTelemetryLayer === 'ndvi' && `${hotspotCount} LOW CANOPY CELLS (< 0.20)`}
            {activeTelemetryLayer === 'diff' && `${hotspotCount} OPTIMIZED TARGET SITES`}
          </span>
        </div>

        {/* Right Actions: Clock, Satellite status, Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="font-mono" style={{ fontSize: '12px', color: '#4cd7f6', fontWeight: '700', letterSpacing: '0.05em' }}>
              {currentTime || '14:48:22 IST'}
            </span>
            <span className="font-mono" style={{ fontSize: '9.5px', color: '#86948a', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={10} color="#4edea3" /> INSAT-3DR ONLINE
            </span>
          </div>


          {/* Refresh / Re-run Sync */}
          <button
            onClick={onRefresh}
            title="Refresh satellite telemetry from API"
            style={{
              background: '#1c1f2a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#dfe2f1',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#262a35'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#1c1f2a'; }}
          >
            <RefreshCw size={13} className={loading ? 'spinning' : ''} />
            <span>SYNC</span>
          </button>
        </div>
      </header>

      {/* Sub-Bar: Tactical Sectors Selector & Simulation Controls */}
      <section style={{
        background: 'rgba(10, 14, 24, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(53, 57, 68, 0.35)',
        borderRadius: '14px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Zone Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '2px' }}>
          <span className="font-mono" style={{ fontSize: '10.5px', color: '#86948a', letterSpacing: '0.08em', marginRight: '4px', fontWeight: '700' }}>
            SECTORS:
          </span>
          {ZONES.map((zone) => {
            const isSelected = (selectedZone || 'All Zones').toLowerCase() === zone.id.toLowerCase();
            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                title={`Click to re-center map to ${zone.label}`}
                style={{
                  background: isSelected
                    ? (zone.id === 'Manali' ? 'rgba(147, 0, 10, 0.85)' : '#262a35')
                    : '#171b26',
                  color: isSelected ? '#fff' : '#bbcabf',
                  border: isSelected
                    ? (zone.id === 'Manali' ? '1px solid #ff5252' : '1px solid #4edea3')
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
                }}
              >
                {zone.label}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher + Knapsack Optimizer Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Mode Switcher Pill */}
          <div style={{
            display: 'flex',
            background: '#262a35',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <button
              onClick={() => onToggleViewMode('baseline')}
              style={{
                background: viewMode === 'baseline' ? 'rgba(147, 0, 10, 0.65)' : 'transparent',
                color: viewMode === 'baseline' ? '#ffb3ad' : '#bbcabf',
                border: viewMode === 'baseline' ? '1px solid #ff5252' : 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🔥 Raw Doppler</span>
            </button>
            <button
              onClick={() => onToggleViewMode('solutions')}
              style={{
                background: viewMode === 'solutions' ? 'rgba(16, 185, 129, 0.28)' : 'transparent',
                color: viewMode === 'solutions' ? '#4edea3' : '#bbcabf',
                border: viewMode === 'solutions' ? '1px solid #10b981' : 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🌱 Simulated Future</span>
            </button>
          </div>

          {/* Nexora Cooling Pilot Button */}
          <button
            onClick={onOpenChatbot}
            title="Ask Nexora Cooling Pilot doubts about cooling solutions"
            style={{
              background: 'linear-gradient(135deg, rgba(76, 215, 246, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
              border: '1px solid rgba(76, 215, 246, 0.45)',
              color: '#4cd7f6',
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              fontFamily: 'var(--font-headline)',
              boxShadow: '0 0 12px rgba(76, 215, 246, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(76, 215, 246, 0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76, 215, 246, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'; e.currentTarget.style.color = '#4cd7f6'; }}
          >
            <Sparkles size={14} />
            <span>Nexora Cooling Pilot</span>
          </button>

          {/* Budget Optimizer Button */}
          <button
            onClick={onOpenBudgetModal}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(0, 178, 208, 0.25) 100%)',
              border: '1px solid rgba(78, 222, 163, 0.45)',
              color: '#4edea3',
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              fontFamily: 'var(--font-headline)',
              boxShadow: '0 0 12px rgba(78, 222, 163, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(0, 178, 208, 0.25) 100%)'; e.currentTarget.style.color = '#4edea3'; }}
          >
            <Calculator size={14} />
            <span>Budget Optimizer</span>
          </button>

          {/* AI Priority Advisor Button (Adjacent to Budget Optimizer) */}
          <button
            onClick={onOpenAIBudgetAdvisor}
            title="AI-optimized priority allocation: see which zones need the most attention with reasons, budget, and LST relief"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.45)',
              color: '#c084fc',
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              fontFamily: 'var(--font-headline)',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(168, 85, 247, 0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)'; e.currentTarget.style.color = '#c084fc'; }}
          >
            <Brain size={14} />
            <span>AI Budget Advisor</span>
          </button>

          {/* Action Plan Button if sites adopted */}
          {adoptedCount > 0 && (
            <button
              onClick={onOpenAdoptedModal}
              title="View your chosen ward action plan interventions"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #00b2d0 100%)',
                border: 'none',
                color: '#003824',
                borderRadius: '8px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '800',
                fontFamily: 'var(--font-headline)',
                boxShadow: '0 0 14px rgba(78, 222, 163, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Leaf size={14} color="#003824" />
              <span>Action Plan ({adoptedCount})</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
