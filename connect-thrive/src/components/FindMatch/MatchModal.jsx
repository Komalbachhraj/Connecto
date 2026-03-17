// src/components/FindMatch/MatchModal.jsx
import { useEffect } from "react";

const TAG_COLORS = { DSA:"#7c3aed", Travel:"#0ea5e9", Wellness:"#10b981", Startup:"#f59e0b", Gym:"#ef4444" };

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#00d4c8)",
  "linear-gradient(135deg,#0ea5e9,#10b981)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];

export default function MatchModal({ student, isConnected, onConnect, onClose }) {
  const { name, major, emoji, score, shared, communities, id } = student;
  const circumference = 2 * Math.PI * 26;
  const dash = (score / 100) * circumference;

  // Close on ESC key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fm-modal-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="fm-modal-header">
          <h3>Match Profile</h3>
          <button className="fm-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Profile row */}
        <div className="fm-modal-profile">
          <div
            className="fm-modal-avatar"
            style={{ background: AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length] }}
          >
            {emoji}
          </div>
          <div className="fm-modal-info">
            <div className="fm-modal-name">{name}</div>
            <div className="fm-modal-major">{major}</div>
            <div className="fm-modal-shared-pills">
              {shared.map(c => (
                <span
                  key={c}
                  style={{
                    fontSize:"0.75rem", padding:"0.15rem 0.5rem",
                    borderRadius:"6px", border:`1px solid ${TAG_COLORS[c]}50`,
                    color: TAG_COLORS[c], background:`${TAG_COLORS[c]}12`
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Score ring */}
          <div className="fm-score-ring">
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform:"rotate(-90deg)", position:"absolute" }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#1a2332" strokeWidth="5"/>
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke="url(#scoreGrad)" strokeWidth="5"
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00d4c8"/>
                  <stop offset="100%" stopColor="#0ea5e9"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="fm-score-num">{score}%</span>
          </div>
        </div>

        {/* Communities */}
        <p className="fm-modal-section-label">SHARED COMMUNITIES ({shared.length}/{communities.length})</p>
        <div className="fm-modal-communities">
          {communities.map(c => (
            <div
              key={c}
              className="fm-modal-com-chip"
              style={shared.includes(c) ? {
                borderColor:`${TAG_COLORS[c]}60`,
                color: TAG_COLORS[c],
                background:`${TAG_COLORS[c]}10`,
              } : { borderColor:"rgba(255,255,255,0.07)", color:"#64748b" }}
            >
              {shared.includes(c) ? "✓ " : ""}{c}
            </div>
          ))}
        </div>

        {/* Why you match */}
        <div className="fm-modal-why">
          <strong>Why you match:</strong> You both care about{" "}
          {shared.join(", ")} — perfect conversation starters! 🎉
        </div>

        {/* Actions */}
        <div className="fm-modal-actions">
          <button
            className="fm-btn-primary"
            onClick={() => { onConnect(); onClose(); }}
          >
            {isConnected ? "✓ Request Already Sent" : "Send Connection Request 🤝"}
          </button>
          <button className="fm-btn-secondary" onClick={onClose}>Skip</button>
        </div>
      </div>
    </div>
  );
}