// src/components/FindMatch/TopMatchesSidebar.jsx
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#00d4c8)",
  "linear-gradient(135deg,#0ea5e9,#10b981)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
];

export default function TopMatchesSidebar({ matches }) {
  return (
    <div className="fm-card">
      <h3>⚡ Top Matches Today</h3>
      {matches.map((s, i) => (
        <div key={s.id} className="fm-suggestion-item">
          <div className="fm-sug-avatar" style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}>
            {s.emoji}
          </div>
          <div className="fm-sug-info">
            <div className="fm-sug-name">{s.name}</div>
            <div className="fm-sug-detail">{s.shared.length} shared communities</div>
          </div>
          <div className="fm-sug-score">{s.score}%</div>
        </div>
      ))}
    </div>
  );
}