// src/components/FindMatch/FilterChips.jsx
export default function FilterChips({ options, active, onChange }) {
  return (
    <div className="fm-filter-row">
      <span className="fm-filter-label">Filter by:</span>
      {options.map(opt => (
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
