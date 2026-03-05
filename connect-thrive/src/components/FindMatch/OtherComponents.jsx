// src/components/FindMatch/OtherComponents.jsx

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#00d4c8)",
  "linear-gradient(135deg,#0ea5e9,#10b981)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
];

// ─────────────────────────────────────────────────────────────
// FilterChips
// ─────────────────────────────────────────────────────────────
export function FilterChips({ options, active, onChange }) {
  return (
    <div className="fm-filter-row">
      <span className="fm-filter-label">Filter by:</span>
      {options.map((opt) => (
        <button
          key={opt}
          className={`fm-filter-chip ${active === opt ? "fm-filter-active" : ""}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TopMatchesSidebar
// ─────────────────────────────────────────────────────────────
export function TopMatchesSidebar({ matches }) {
  return (
    <div className="fm-card">
      <h3>⚡ Top Matches Today</h3>
      {matches.map((s, i) => (
        <div key={s.id} className="fm-suggestion-item">
          <div
            className="fm-sug-avatar"
            style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}
          >
            {s.name?.charAt(0) || "?"}
          </div>
          <div className="fm-sug-info">
            <div className="fm-sug-name">{s.name}</div>
            <div className="fm-sug-detail">{s.shared?.length || 0} shared communities</div>
          </div>
          <div className="fm-sug-score">{s.score}%</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HowItWorks
// ─────────────────────────────────────────────────────────────
const STEPS = [
  { title: "Community Overlap",  desc: "More shared communities = higher match score" },
  { title: "Activity Level",     desc: "Active members get prioritized in results" },
  { title: "Campus Proximity",   desc: "Same year & department boosts your score" },
  { title: "Connect & Chat",     desc: "Send a connection request to start your journey" },
];

export function HowItWorks() {
  return (
    <div className="fm-card">
      <h3>🧠 How Matching Works</h3>
      {STEPS.map((step, i) => (
        <div key={i} className="fm-how-step">
          <div className="fm-step-num">{i + 1}</div>
          <div>
            <strong>{step.title}</strong>
            <p>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LoadingOverlay
// ─────────────────────────────────────────────────────────────
export function LoadingOverlay() {
  return (
    <div className="fm-loading-overlay">
      <div className="fm-spinner" />
      <div className="fm-loading-text">Finding your matches...</div>
    </div>
  );
}