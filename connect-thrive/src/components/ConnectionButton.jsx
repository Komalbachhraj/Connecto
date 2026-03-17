import { useState, useEffect } from "react";

const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  return res.json();
}

// ─── ConnectButton ────────────────────────────────────────────
// Props:
//   receiverId  — the user ID to connect with
//   initialStatus — "none" | "pending" | "accepted" (optional, from server)

export default function ConnectButton({ receiverId, initialStatus = "none" }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  // Check real status from server on mount (optional but accurate)
  useEffect(() => {
    if (initialStatus !== "none") return; // trust server-rendered value
    apiFetch(`/connections/status/${receiverId}`)
      .then((data) => {
        if (data.success) setStatus(data.status);
      })
      .catch(() => {});
  }, [receiverId]);

  const handleClick = async () => {
    if (loading || status !== "none") return;
    setLoading(true);
    try {
      const data = await apiFetch(`/connections/send/${receiverId}`, {
        method: "POST",
      });
      if (data.success) {
        setStatus("pending");
      } else {
        alert(data.message || "Could not send request");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ──
  const base = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.02em",
  };

  const styles = {
    none: {
      ...base,
      background: "transparent",
      color: "#00d4c8",
      border: "1px solid rgba(0,212,200,0.5)",
    },
    pending: {
      ...base,
      background: "rgba(255,255,255,0.04)",
      color: "#718096",
      border: "1px solid rgba(255,255,255,0.1)",
      cursor: "default",
    },
    accepted: {
      ...base,
      background: "rgba(0,212,200,0.1)",
      color: "#00d4c8",
      border: "1px solid rgba(0,212,200,0.3)",
      cursor: "default",
    },
  };

  const labels = {
    none: loading ? "Sending..." : "+ Connect",
    pending: "✓ Request Sent",
    accepted: "✓ Connected",
  };

  return (
    <button
      style={styles[status] || styles.none}
      onClick={handleClick}
      disabled={status !== "none" || loading}
    >
      {labels[status] || "+ Connect"}
    </button>
  );
}