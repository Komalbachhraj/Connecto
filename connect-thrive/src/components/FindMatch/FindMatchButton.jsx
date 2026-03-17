// src/components/FindMatch/FindMatchButton.jsx

export default function FindMatchButton({ onClick }) {
  return (
    <button className="fm-find-btn" onClick={onClick}>
      <span className="fm-pulse-ring" />
      <span>✦ Find Your Match</span>
    </button>
  );
}