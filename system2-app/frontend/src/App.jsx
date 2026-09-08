import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Bot } from 'lucide-react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import HeatMap from './components/HeatMap';
import DetailPanel from './components/DetailPanel';
import BudgetModal from './components/BudgetModal';
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
  const [viewMode, setViewMode] = useState('solutions'); // 'solutions' (Optimistic Blueprint) or 'baseline'

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top App Header */}
      <Header
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        hotspotCount={filteredHotspots.length}
        onRefresh={fetchHotspots}
        loading={loading}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
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
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(h) => setSelectedHotspot(h)}
          viewMode={viewMode}
        />

        {/* Map Legend Overlay */}
        <Legend viewMode={viewMode} />

        {/* Detail Panel Drawer */}
        {selectedHotspot && (
          <DetailPanel
            hotspot={selectedHotspot}
            onClose={() => setSelectedHotspot(null)}
          />
        )}
      </main>

      {/* Municipal Budget Optimizer Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        defaultZone={selectedZone}
      />

      {/* Floating Small Icon Button for AI Copilot (when chat is closed) */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          title="Ask AI Copilot doubts about cooling solutions"
          aria-label="Open AI Copilot Chatbot"
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
