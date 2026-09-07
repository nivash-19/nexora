import React from 'react';
import { Flame, AlertTriangle, ShieldCheck, TrendingDown } from 'lucide-react';

export default function StatsBar({ hotspots = [] }) {
  if (!hotspots.length) return null;

  const total = hotspots.length;
  const highRisk = hotspots.filter(h => (h.heat_score || 0) >= 0.82).length;
  const avgScore = (hotspots.reduce((acc, h) => acc + (h.heat_score || 0), 0) / total).toFixed(3);

  // Group by zone to find zone with highest count/severity
  const zoneSeverity = {};
  hotspots.forEach(h => {
    const z = h.zone || 'Unknown';
    zoneSeverity[z] = (zoneSeverity[z] || 0) + (h.heat_score || 0);
  });
  const worstZone = Object.entries(zoneSeverity).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Manali';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      margin: '0 20px 16px 20px'
    }}>
      {/* Total Hotspots */}
      <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '10px' }}>
          <Flame size={20} color="var(--accent-crimson)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Detected Hotspots
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            {total} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>cells</span>
          </div>
        </div>
      </div>

      {/* Severe Risk */}
      <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '10px' }}>
          <AlertTriangle size={20} color="var(--accent-amber)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Critical Heat (Score &ge; 0.82)
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)', color: 'var(--accent-crimson)' }}>
            {highRisk} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>priority cells</span>
          </div>
        </div>
      </div>

      {/* Avg Heat Score */}
      <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '10px' }}>
          <TrendingDown size={20} color="var(--accent-cyan)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Mean Heat Score
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            {avgScore} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 1.00</span>
          </div>
        </div>
      </div>

      {/* Peak Zone */}
      <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px' }}>
          <ShieldCheck size={20} color="var(--accent-emerald)" />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Highest Urgency Zone
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>
            {worstZone}
          </div>
        </div>
      </div>
    </div>
  );
}
