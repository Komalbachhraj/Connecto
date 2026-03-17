
// src/components/FindMatch/HowItWorks.jsx
const STEPS = [
  { title: "Community Overlap",   desc: "More shared communities = higher match score" },
  { title: "Activity Level",      desc: "Active members get prioritized in results" },
  { title: "Campus Proximity",    desc: "Same year & department boosts your score" },
  { title: "Connect & Chat",      desc: "Send a connection request to start your journey" },
];

export default function HowItWorks() {
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