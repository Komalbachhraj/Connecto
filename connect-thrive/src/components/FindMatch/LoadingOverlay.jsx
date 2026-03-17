// src/components/FindMatch/LoadingOverlay.jsx
export default function LoadingOverlay() {
  return (
    <div className="fm-loading-overlay">
      <div className="fm-spinner" />
      <div className="fm-loading-text">Finding your matches...</div>
    </div>
  );
}
