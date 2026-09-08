import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Bot, Leaf, Eye, SlidersHorizontal } from 'lucide-react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import HeatMap from './components/HeatMap';
import DetailPanel from './components/DetailPanel';
import BudgetModal from './components/BudgetModal';
import AdoptedPlanModal from './components/AdoptedPlanModal';
import ChatbotModal from './components/ChatbotModal';
import Legend from './components/Legend';
import { ENDPOINTS } from './config/api';

export default function App() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAdoptedModalOpen, setIsAdoptedModalOpen] = useState(false);
  const [initialOptimizerBudget, setInitialOptimizerBudget] = useState(null);
  const [viewMode, setViewMode] = useState('solutions'); // 'solutions' (Optimistic Blueprint) or 'baseline'

  // Persisted adopted choices across visits
  const [adoptedHotspots, setAdoptedHotspots] = useState(() => {
    try {
      const saved = localStorage.getItem('heatscape_adopted_plans');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleToggleAdopt = (hotspot, customSolution = null) => {
    if (!hotspot || !hotspot.cell_id) return;
    setAdoptedHotspots(prev => {
      const cellId = hotspot.cell_id;
      const next = { ...prev };
      if (next[cellId]) {
        delete next[cellId];
      } else {
        const t1 = hotspot.tier1_recommendation || {};
        next[cellId] = {
          cell_id: hotspot.cell_id,
          zone: hotspot.zone,
          cause: hotspot.cause,
          temperature_celsius: hotspot.temperature_celsius || 42,
          heat_score: hotspot.heat_score || 0.85,
          intervention: customSolution?.title || t1.intervention || 'Native Tree Planting',
          category: customSolution?.category || t1.category || 'tree_planting',
          cost: customSolution?.mapped_cost?.cost_per_unit || t1.standard_cost_inr || 100000,
          cost_display: customSolution?.mapped_cost?.cost_display || t1.cost_display || '₹1,00,000 / cell',
          impact_display: customSolution?.mapped_cost?.est_impact || t1.impact_display || '-1.8°C to -2.5°C LST',
          delta_t: t1.delta_t || 2.0,
          source: t1.source || 'GCC Urban Forestry',
          adopted_at: new Date().toISOString()
        };
      }
      try {
        localStorage.setItem('heatscape_adopted_plans', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleAdoptMultiple = (allocations = []) => {
    setAdoptedHotspots(prev => {
      const next = { ...prev };
      allocations.forEach(item => {
        next[item.cell_id] = {
          cell_id: item.cell_id,
          zone: item.zone,
          cause: item.cause,
          temperature_celsius: item.temperature_celsius || 42,
          heat_score: item.heat_score || 0.85,
          intervention: item.intervention,
          cost: item.cost,
          cost_display: `₹${Number(item.cost).toLocaleString('en-IN')}`,
          impact_display: `-${item.impact_reduction_celsius}°C LST`,
          delta_t: item.impact_reduction_celsius,
          source: 'Greedy Knapsack Municipal Optimization',
          adopted_at: new Date().toISOString()
        };
      });
      try {
        localStorage.setItem('heatscape_adopted_plans', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleRemoveAdopted = (cellId) => {
    setAdoptedHotspots(prev => {
      const next = { ...prev };
      delete next[cellId];
      try {
        localStorage.setItem('heatscape_adopted_plans', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleClearAllAdopted = () => {
    setAdoptedHotspots({});
    try {
      localStorage.removeItem('heatscape_adopted_plans');
    } catch (e) {}
  };

  const adoptedCount = Object.keys(adoptedHotspots).length;
  const totalAdoptedCost = Object.values(adoptedHotspots).reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

  const fetchHotspots = (retryCount = 0) => {
    setLoading(true);
    setError(null);
    axios.get(ENDPOINTS.HOTSPOTS, { timeout: 20000 })
      .then(res => {
        setHotspots(res.data);
        setLoading(false);
        setError(null);
        // Default select first hotspot if none selected
        if (res.data && res.data.length > 0 && !selectedHotspot) {
          setSelectedHotspot(res.data[0]);
        }
      })
      .catch(err => {
        console.error('Error fetching hotspots:', err);
        // If first attempt failed on production, auto-retry once after 4s to allow Render cold start
        if (retryCount < 2) {
          setTimeout(() => fetchHotspots(retryCount + 1), 3500);
          return;
        }
        const isProd = import.meta.env.PROD;
        const msg = isProd
          ? 'Cloud backend is waking up on Render (free tier takes ~30-45s after inactivity). Click Retry.'
          : 'Unable to load hotspots from backend. Ensure FastAPI is running on port 8000.';
        setError(msg);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

  const filteredHotspots = selectedZone === 'All Zones'
    ? hotspots
    : hotspots.filter(h => (h.zone || '').toLowerCase() === selectedZone.toLowerCase());

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    if (zone && zone.toLowerCase() !== 'all zones') {
      const matching = hotspots.filter(h => (h.zone || '').toLowerCase() === zone.toLowerCase());
      if (matching.length > 0) {
        setSelectedHotspot(matching[0]);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top App Header */}
      <Header
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        hotspotCount={filteredHotspots.length}
        onRefresh={fetchHotspots}
        loading={loading}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        adoptedCount={adoptedCount}
        onOpenAdoptedModal={() => setIsAdoptedModalOpen(true)}
      />

      {/* Aggregate City Metrics */}
      <StatsBar hotspots={hotspots} selectedZone={selectedZone} viewMode={viewMode} />

      {/* Main Map & Interactive Work Area */}
      <main style={{ flex: 1, position: 'relative', margin: '0 20px 20px 20px', minHeight: '520px' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 15, 25, 0.7)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: 'var(--accent-crimson)',
                borderRadius: '50%',
                animation: 'spin 1s infinite linear',
                margin: '0 auto 12px auto'
              }} />
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>
                Connecting to HeatScape Backend API...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '90%'
          }}>
            <span>{error}</span>
            <button
              onClick={() => fetchHotspots(0)}
              style={{
                background: '#fff',
                color: '#dc2626',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Leaflet Heat Hotspot Map */}
        <HeatMap
          hotspots={filteredHotspots}
          allHotspots={hotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(h) => setSelectedHotspot(h)}
          viewMode={viewMode}
          adoptedHotspots={adoptedHotspots}
          selectedZone={selectedZone}
        />

        {/* Map Legend Overlay */}
        <Legend viewMode={viewMode} />

        {/* Detail Panel Drawer */}
        {selectedHotspot && (
          <DetailPanel
            hotspot={selectedHotspot}
            onClose={() => setSelectedHotspot(null)}
            adoptedHotspots={adoptedHotspots}
            onToggleAdopt={handleToggleAdopt}
          />
        )}
      </main>

      {/* Municipal Budget Optimizer Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setInitialOptimizerBudget(null);
        }}
        defaultZone={selectedZone}
        adoptedHotspots={adoptedHotspots}
        onToggleAdopt={handleToggleAdopt}
        onAdoptMultiple={handleAdoptMultiple}
        initialBudget={initialOptimizerBudget}
      />

      {/* Adopted GCC Ward Action Plan Modal */}
      <AdoptedPlanModal
        isOpen={isAdoptedModalOpen}
        onClose={() => setIsAdoptedModalOpen(false)}
        adoptedHotspots={adoptedHotspots}
        onRemoveAdopted={handleRemoveAdopted}
        onClearAll={handleClearAllAdopted}
        onOpenBudgetModal={(budgetVal) => {
          setInitialOptimizerBudget(budgetVal);
          setIsBudgetModalOpen(true);
        }}
      />

      {/* Floating Ward Action Plan Dock (when sites are adopted) */}
      {adoptedCount > 0 && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            left: '84px',
            bottom: '24px',
            zIndex: 1140,
            background: 'rgba(15, 19, 29, 0.94)',
            border: '1px solid rgba(78, 222, 163, 0.45)',
            borderRadius: '14px',
            padding: '9px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(78, 222, 163, 0.2)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#4edea3',
              boxShadow: '0 0 8px #4edea3'
            }} />
            <strong className="font-headline" style={{ fontSize: '12.5px', color: '#fff' }}>
              Ward Action Plan:
            </strong>
            <span className="font-mono" style={{ fontSize: '12px', color: '#4edea3', fontWeight: '800' }}>
              {adoptedCount} Sites
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
            <span className="font-mono" style={{ fontSize: '11.5px', color: '#dfe2f1' }}>
              Committed: <strong style={{ color: '#4edea3' }}>₹{(totalAdoptedCost / 100000).toFixed(2)}L</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsAdoptedModalOpen(true)}
              title="View all adopted choices & cost breakdown"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#dfe2f1',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'var(--font-headline)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
            >
              <Eye size={13} />
              <span>View Choices</span>
            </button>

            <button
              onClick={() => {
                setInitialOptimizerBudget(totalAdoptedCost > 0 ? totalAdoptedCost : 1500000);
                setIsBudgetModalOpen(true);
              }}
              title="Optimize municipal budget taking adopted choices into account"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #00b2d0 100%)',
                border: 'none',
                color: '#003824',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                fontFamily: 'var(--font-headline)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <SlidersHorizontal size={13} />
              <span>Budget Optimise</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Small Icon Button for Nexora Cooling Pilot (when chat is closed) */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          title="Ask Nexora Cooling Pilot doubts about cooling solutions"
          aria-label="Open Nexora Cooling Pilot Chatbot"
          style={{
            position: 'fixed',
            left: '24px',
            bottom: '24px',
            zIndex: 1150,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #00b2d0 100%)',
            color: '#003824',
            border: '2px solid rgba(255, 255, 255, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45), 0 0 12px rgba(0, 178, 208, 0.35)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.boxShadow = '0 8px 26px rgba(16, 185, 129, 0.65), 0 0 20px rgba(0, 178, 208, 0.55)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.45), 0 0 12px rgba(0, 178, 208, 0.35)';
          }}
        >
          {/* Pulsing online status dot */}
          <span style={{
            position: 'absolute',
            top: '-1px',
            right: '-1px',
            width: '11px',
            height: '11px',
            borderRadius: '50%',
            background: '#4edea3',
            border: '2px solid #0a0e18',
            boxShadow: '0 0 6px #4edea3'
          }} />
          <Bot size={22} color="#003824" strokeWidth={2.3} />
        </button>
      )}

      {/* AI Chatbot Doubt Resolution Modal */}
      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        selectedHotspot={selectedHotspot}
      />
    </div>
  );
}
