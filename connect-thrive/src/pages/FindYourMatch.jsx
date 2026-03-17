// src/pages/FindYourMatch.jsx
import { useState, useEffect } from "react";
import MatchCard from "../components/FindMatch/MatchCard";
import MatchModal from "../components/FindMatch/MatchModal";
import FindMatchButton from "../components/FindMatch/FindMatchButton";
import { FilterChips, TopMatchesSidebar, HowItWorks, LoadingOverlay } from "../components/FindMatch/OtherComponents";
import "../findmatch.css";

const API = "http://localhost:5000/api/users";

function getToken() {
  return localStorage.getItem("token");
}

export default function FindYourMatch() {
  const [matches, setMatches]             = useState([]);
  const [communities, setCommunities]     = useState(["All"]);
  const [connected, setConnected]         = useState({});
  const [activeFilter, setActiveFilter]   = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [searched, setSearched]           = useState(false);
  const [error, setError]                 = useState("");

  // ── Fetch matches ──────────────────────────────────────────
  const handleFindMatch = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) {
        setError("You are not logged in. Please log in first.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${API}/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch matches");
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      setMatches(safeData);

      // Build filter chips from results
      const allComms = new Set();
      safeData.forEach((s) => {
        if (Array.isArray(s.communities)) {
          s.communities.forEach((c) => allComms.add(c));
        }
      });
      setCommunities(["All", ...Array.from(allComms).sort()]);
      setSearched(true);
    } catch (err) {
      setError("Could not load matches. Make sure your backend is running.");
    }
    setLoading(false);
  };

  // ── Send connection request ────────────────────────────────
  const handleConnect = async (id) => {
    try {
      await fetch(`${API}/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ receiverId: id }),
      });
      setConnected((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error("Connection request failed", err);
    }
  };

  const filteredMatches =
    activeFilter === "All"
      ? matches
      : matches.filter((s) =>
          Array.isArray(s.communities) && s.communities.includes(activeFilter)
        );

  return (
    <div className="fm-layout">
      {loading && <LoadingOverlay />}

      {selectedStudent && (
        <MatchModal
          student={selectedStudent}
          isConnected={!!connected[selectedStudent.id]}
          onConnect={() => handleConnect(selectedStudent.id)}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* ── Left Sidebar ── */}
      <aside className="fm-sidebar">
        <CommunitiesSidebar />
        <FindMatchButton onClick={handleFindMatch} />
      </aside>

      {/* ── Main ── */}
      <main className="fm-main">
        <div className="fm-match-header">
          <div>
            <h2>Your <span className="fm-teal">Perfect Matches</span> ✦</h2>
            <p>
              {searched
                ? `Found ${matches.length} students across your communities`
                : "Click Find Your Match to discover your people"}
            </p>
          </div>
          {searched && (
            <div className="fm-stats">
              <Stat num={matches.length} label="Students Found" />
              <Stat num={filteredMatches.length} label="Showing" />
              <Stat num={communities.length - 1} label="Communities" />
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "1rem",
            color: "#f87171", fontSize: "0.875rem"
          }}>
            ⚠️ {error}
          </div>
        )}

        <FilterChips
          options={communities}
          active={activeFilter}
          onChange={setActiveFilter}
        />

        {searched ? (
          filteredMatches.length > 0 ? (
            <div className="fm-grid">
              {filteredMatches.map((student, i) => (
                <MatchCard
                  key={student.id}
                  student={student}
                  index={i}
                  isConnected={!!connected[student.id]}
                  onConnect={() => handleConnect(student.id)}
                  onOpen={() => setSelectedStudent(student)}
                />
              ))}
            </div>
          ) : (
            <div className="fm-empty-state">
              <div className="fm-empty-icon">🔍</div>
              <h3>No matches for this community</h3>
              <p>Try selecting a different filter or join more communities</p>
            </div>
          )
        ) : (
          <div className="fm-empty-state">
            <div className="fm-empty-icon">✦</div>
            <h3>Find students who share your passion</h3>
            <p>Click "Find Your Match" to discover students across your communities</p>
          </div>
        )}
      </main>

      {/* ── Right Sidebar ── */}
      <aside className="fm-right-sidebar">
        {searched && matches.length > 0 && (
          <TopMatchesSidebar matches={matches.slice(0, 4)} />
        )}
        <HowItWorks />
        <div className="fm-card fm-wellness-card">
          <div className="fm-wellness-icon">💙</div>
          <strong>You're not alone</strong>
          <p>Campus life can be overwhelming. Connecto helps you find your people — one connection at a time.</p>
        </div>
      </aside>
    </div>
  );
}

// ── Communities Sidebar ────────────────────────────────────────
function CommunitiesSidebar() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/api/users/communities", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCommunities(data);
        else setCommunities([]);
      })
      .catch(() => setCommunities([]));
  }, []);

  const ICON_MAP = {
    travel: "🌍", dsa: "💻", "mental-wellness": "🧘",
    startup: "🚀", gym: "💪",
  };

  return (
    <div className="fm-card">
      <h3>My Communities</h3>
      {communities.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
          No communities joined yet
        </p>
      ) : (
        communities.map((c) => (
          <div key={c.id} className="fm-community-pill">
            <span>{ICON_MAP[c.slug] || "🏷"}</span>
            {c.name}
          </div>
        ))
      )}
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div className="fm-stat">
      <div className="fm-stat-num">{num}</div>
      <div className="fm-stat-label">{label}</div>
    </div>
  );
}
// // src/pages/FindYourMatch.jsx
// import { useState } from "react";
// import MatchCard from "../components/FindMatch/MatchCard";
// import MatchModal from "../components/FindMatch/MatchModal";
// import FindMatchButton from "../components/FindMatch/FindMatchButton";
// import FilterChips from "../components/FindMatch/FilterChips";
// import TopMatchesSidebar from "../components/FindMatch/TopMatchesSidebar";
// import HowItWorks from "../components/FindMatch/HowItWorks";
// import LoadingOverlay from "../components/FindMatch/LoadingOverlay";
// import "../findmatch.css";

// // ── Mock data (replace with API call later) ──────────────────────────────────
// const MOCK_STUDENTS = [
//   { id: 1, name: "Priya Sharma",   major: "CS • Year 2",          emoji: "👩🏽", score: 96, shared: ["DSA","Wellness","Startup"], communities: ["DSA","Wellness","Startup","Travel"] },
//   { id: 2, name: "Marcus Lee",     major: "Mech Eng • Year 3",    emoji: "👨🏻", score: 88, shared: ["Travel","Gym","Wellness"],   communities: ["Travel","Gym","Wellness"] },
//   { id: 3, name: "Aisha Okafor",   major: "Business • Year 2",    emoji: "👩🏿", score: 85, shared: ["Startup","Travel"],          communities: ["Startup","Travel","DSA"] },
//   { id: 4, name: "Dev Patel",      major: "CS • Year 1",          emoji: "👨🏽", score: 82, shared: ["DSA","Startup","Gym"],       communities: ["DSA","Startup","Gym"] },
//   { id: 5, name: "Sofia Martinez", major: "Psychology • Year 3",  emoji: "👩🏻", score: 79, shared: ["Wellness","Travel"],         communities: ["Wellness","Travel","Gym"] },
//   { id: 6, name: "James Kim",      major: "CS • Year 2",          emoji: "👨🏻", score: 76, shared: ["DSA","Gym"],                 communities: ["DSA","Gym","Startup"] },
//   { id: 7, name: "Nadia Hassan",   major: "Design • Year 2",      emoji: "👩🏽", score: 72, shared: ["Startup","Wellness"],        communities: ["Startup","Wellness"] },
//   { id: 8, name: "Luca Romano",    major: "Economics • Year 1",   emoji: "👨🏻", score: 68, shared: ["Travel","Gym"],              communities: ["Travel","Gym","DSA"] },
// ];

// const ALL_COMMUNITIES = ["All", "Travel", "DSA", "Wellness", "Startup", "Gym"];

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function FindYourMatch() {
//   const [matches, setMatches]         = useState(MOCK_STUDENTS);
//   const [connected, setConnected]     = useState({});          // { studentId: true }
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [loading, setLoading]         = useState(false);
//   const [searched, setSearched]       = useState(false);

//   // Simulate fetching matches from backend
//   const handleFindMatch = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setMatches(MOCK_STUDENTS);   // Replace with: const data = await api.getMatches()
//       setLoading(false);
//       setSearched(true);
//     }, 1800);
//   };

//   const handleConnect = (id) => {
//     setConnected(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const filteredMatches = activeFilter === "All"
//     ? matches
//     : matches.filter(s => s.communities.includes(activeFilter));

//   return (
//     <div className="fm-layout">
//       {loading && <LoadingOverlay />}

//       {selectedStudent && (
//         <MatchModal
//           student={selectedStudent}
//           isConnected={!!connected[selectedStudent.id]}
//           onConnect={() => handleConnect(selectedStudent.id)}
//           onClose={() => setSelectedStudent(null)}
//         />
//       )}

//       {/* ── Left Sidebar ── */}
//       <aside className="fm-sidebar">
//         <div className="fm-card fm-profile-mini">
//           <div className="fm-avatar-lg">👤</div>
//           <h4>Alex Johnson</h4>
//           <p>Computer Science • Year 2</p>
//         </div>

//         <div className="fm-card">
//           <h3>My Communities</h3>
//           {["Travel","DSA","Wellness","Startup","Gym"].map((c, i) => (
//             <CommunityPill key={c} name={c} index={i} />
//           ))}
//         </div>

//         <FindMatchButton onClick={handleFindMatch} />
//       </aside>

//       {/* ── Main Content ── */}
//       <main className="fm-main">
//         <div className="fm-match-header">
//           <div>
//             <h2>Your <span className="fm-teal">Perfect Matches</span> ✦</h2>
//             <p>Based on your 5 shared communities • {searched ? "Updated just now" : "Click Find Your Match to start"}</p>
//           </div>
//           {searched && (
//             <div className="fm-stats">
//               <Stat num={247} label="Students Found" />
//               <Stat num={filteredMatches.length} label="Top Matches" />
//               <Stat num={5} label="Communities" />
//             </div>
//           )}
//         </div>

//         <FilterChips
//           options={ALL_COMMUNITIES}
//           active={activeFilter}
//           onChange={setActiveFilter}
//         />

//         {searched ? (
//           <div className="fm-grid">
//             {filteredMatches.map((student, i) => (
//               <MatchCard
//                 key={student.id}
//                 student={student}
//                 index={i}
//                 isConnected={!!connected[student.id]}
//                 onConnect={() => handleConnect(student.id)}
//                 onOpen={() => setSelectedStudent(student)}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="fm-empty-state">
//             <div className="fm-empty-icon">✦</div>
//             <h3>Find students who share your passion</h3>
//             <p>Click "Find Your Match" to discover students across your communities</p>
//           </div>
//         )}
//       </main>

//       {/* ── Right Sidebar ── */}
//       <aside className="fm-right-sidebar">
//         {searched && <TopMatchesSidebar matches={matches.slice(0, 4)} />}
//         <HowItWorks />
//         <div className="fm-card fm-wellness-card">
//           <div className="fm-wellness-icon">💙</div>
//           <strong>You're not alone</strong>
//           <p>Campus life can be overwhelming. Connecto helps you find your people — one connection at a time.</p>
//         </div>
//       </aside>
//     </div>
//   );
// }

// // ── Small reusable sub-components (inline to keep it simple) ─────────────────
// const COMMUNITY_COLORS = { Travel:"#0ea5e9", DSA:"#7c3aed", Wellness:"#10b981", Startup:"#f59e0b", Gym:"#ef4444" };

// function CommunityPill({ name }) {
//   return (
//     <div className="fm-community-pill">
//       <span className="fm-dot" style={{ background: COMMUNITY_COLORS[name] }} />
//       {name}
//     </div>
//   );
// }

// function Stat({ num, label }) {
//   return (
//     <div className="fm-stat">
//       <div className="fm-stat-num">{num}</div>
//       <div className="fm-stat-label">{label}</div>
//     </div>
//   );
// }
