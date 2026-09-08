import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import HeatMap from './components/HeatMap';
import DetailPanel from './components/DetailPanel';
import BudgetModal from './components/BudgetModal';
import Legend from './components/Legend';
import { ENDPOINTS } from './config/api';

export default function App() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('solutions'); // 'solutions' (Optimistic Blueprint) or 'baseline'

  const fetchHotspots = () => {
    setLoading(true);
    setError(null);
    axios.get(ENDPOINTS.HOTSPOTS)
      .then(res => {
        setHotspots(res.data);
        setLoading(false);
        // Default select first hotspot if none selected
        if (res.data && res.data.length > 0 && !selectedHotspot) {
          setSelectedHotspot(res.data[0]);
        }
      })
      .catch(err => {
        console.error('Error fetching hotspots:', err);
        setError('Unable to load hotspots from backend. Ensure FastAPI is running on port 8000.');
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
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            fontSize: '13px'
          }}>
            {error}
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
    </div>
  );
}
