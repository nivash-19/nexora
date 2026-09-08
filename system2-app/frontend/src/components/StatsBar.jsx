import React from 'react';
import { Flame, AlertTriangle, ShieldCheck, TrendingDown, MapPin } from 'lucide-react';

export default function StatsBar({ hotspots = [], selectedZone = 'All Zones' }) {
  if (!hotspots.length) return null;

  const isZoneFiltered = selectedZone && selectedZone !== 'All Zones';
  const activeHotspots = isZoneFiltered
    ? hotspots.filter(h => (h.zone || '').toLowerCase() === selectedZone.toLowerCase())
    : hotspots;

  const total = activeHotspots.length;
  const highRisk = activeHotspots.filter(h => (h.heat_score || 0) >= 0.82).length;
  const avgScore = total > 0
    ? (activeHotspots.reduce((acc, h) => acc + (h.heat_score || 0), 0) / total).toFixed(3)
    : '0.000';

  // Find dominant cause or worst zone
  let rightCardLabel = 'Highest Urgency Zone';
  let rightCardValue = 'Manali';
  let rightCardSub = 'Citywide Priority';

  if (isZoneFiltered) {
    rightCardLabel = `Dominant Cause in ${selectedZone}`;
    // Find most common cause in zone
    const causeCounts = {};
    activeHotspots.forEach(h => {
      const c = (h.cause || 'extreme_temperature').replace(/_/g, ' ');
      causeCounts[c] = (causeCounts[c] || 0) + 1;
    });
    rightCardValue = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Extreme Temp';
    rightCardSub = `${total} zone cells analyzed`;
  } else {
    const zoneSeverity = {};
    hotspots.forEach(h => {
      const z = h.zone || 'Unknown';
      zoneSeverity[z] = (zoneSeverity[z] || 0) + (h.heat_score || 0);
    });
    rightCardValue = Object.entries(zoneSeverity).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Manali';
    rightCardSub = '6 microclimate zones';
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      margin: '0 20px 16px 20px'
    }}>
      {/* Total Hotspots */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <Flame size={20} color="var(--accent-crimson)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
            {isZoneFiltered ? `${selectedZone} Hotspots` : 'Detected Hotspots'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
            {total} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>cells</span>
          </div>
        </div>
      </div>

      {/* Severe Risk */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <AlertTriangle size={20} color="var(--accent-amber)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
            Critical Heat (Score &ge; 0.82)
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--accent-crimson)', marginTop: '2px' }}>
            {highRisk} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>priority cells</span>
          </div>
        </div>
      </div>

      {/* Avg Heat Score */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <TrendingDown size={20} color="var(--accent-cyan)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
            {isZoneFiltered ? `${selectedZone} Mean Score` : 'Mean Heat Score'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
            {avgScore} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>/ 1.00</span>
          </div>
        </div>
      </div>

      {/* Peak Zone / Dominant Cause */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <ShieldCheck size={20} color="var(--accent-emerald)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
            {rightCardLabel}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fbbf24', textTransform: 'capitalize', marginTop: '2px' }}>
            {rightCardValue}
          </div>
        </div>
      </div>
    </div>
  );
}
