// src/components/FindMatch/MatchCard.jsx

const TAG_COLORS = { DSA:"#7c3aed", Travel:"#0ea5e9", Wellness:"#10b981", Startup:"#f59e0b", Gym:"#ef4444" };

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#00d4c8)",
  "linear-gradient(135deg,#0ea5e9,#10b981)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#7c3aed,#f59e0b)",
  "linear-gradient(135deg,#ef4444,#7c3aed)",
  "linear-gradient(135deg,#00d4c8,#f59e0b)",
  "linear-gradient(135deg,#10b981,#7c3aed)",
];

export default function MatchCard({ student, index, isConnected, onConnect, onOpen }) {
  const { name, major, emoji, score, shared, communities } = student;

  return (
    <div
      className="fm-match-card"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={onOpen}
    >
      {/* Score badge */}
      <div className="fm-score-badge">{score}% match</div>

      {/* Avatar */}
      <div
        className="fm-match-avatar"
        style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
      >
        {emoji}
      </div>

      <div className="fm-match-name">{name}</div>
      <div className="fm-match-major">{major}</div>

      {/* Match meter */}
      <div className="fm-meter">
        <div className="fm-meter-labels">
          <span>Match Score</span>
          <span className="fm-teal">{score}%</span>
        </div>
        <div className="fm-meter-bar">
          <div className="fm-meter-fill" style={{ width: `${score}%` }} />
        </div>
      </div>

      {/* Tags */}
      <div className="fm-tags">
        {communities.map(c => (
          <span
            key={c}
            className={`fm-tag ${shared.includes(c) ? "fm-tag-shared" : ""}`}
            style={shared.includes(c) ? {
              borderColor: `${TAG_COLORS[c]}60`,
              color: TAG_COLORS[c],
              background: `${TAG_COLORS[c]}12`,
            } : {}}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Connect button */}
      <button
        className={`fm-connect-btn ${isConnected ? "fm-connect-sent" : ""}`}
        onClick={(e) => { e.stopPropagation(); onConnect(); }}
      >
        {isConnected ? "✓ Request Sent" : "+ Connect"}
      </button>
    </div>
  );
}