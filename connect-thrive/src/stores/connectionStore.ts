import { create } from "zustand";

export type ConnectionStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "connected";

export interface Buddy {
  id: number;
  name: string;
  avatar: string;
  hometown: string;
  course: string;
  year: string;
  interests: string[];
  travelMode: string;
  online: boolean;
}

interface DBConnection {
  buddyId: number;
  status: "pending" | "accepted";
  isSender: number; // 1 = Maine bheji, 0 = Mujhe aayi
}

interface ConnectionState {
  buddies: Buddy[];
  connections: DBConnection[];
  getStatus: (buddyId: number) => ConnectionStatus;
  getIncomingRequests: () => number[];

  // Professional Helpers for Messaging
  getConnectedBuddies: () => Buddy[];
  getRequestBuddies: () => Buddy[];

  // API Actions
  fetchBuddies: () => Promise<void>;
  fetchConnections: () => Promise<void>;
  sendRequest: (buddyId: number) => Promise<boolean>;
  respondToRequest: (
    buddyId: number,
    action: "accepted" | "rejected",
  ) => Promise<boolean>;
}

const API_BASE = "http://localhost:5000/api";

// Helper to get Auth Headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  buddies: [],
  connections: [],

  // --- Helpers for UI ---

  getConnectedBuddies: () => {
    const { buddies, connections } = get();
    return buddies.filter((buddy) =>
      connections.some(
        (conn) => conn.buddyId === buddy.id && conn.status === "accepted",
      ),
    );
  },

  getRequestBuddies: () => {
    const { buddies, connections } = get();
    return buddies.filter((buddy) =>
      connections.some(
        (conn) =>
          conn.buddyId === buddy.id &&
          conn.status === "pending" &&
          conn.isSender === 0,
      ),
    );
  },

  getStatus: (buddyId: number): ConnectionStatus => {
    const conn = get().connections.find((c) => c.buddyId === buddyId);
    if (!conn) return "none";
    if (conn.status === "accepted") return "connected";
    return conn.isSender === 1 ? "pending_sent" : "pending_received";
  },

  getIncomingRequests: (): number[] => {
    return get()
      .connections.filter((c) => c.status === "pending" && c.isSender === 0)
      .map((c) => c.buddyId);
  },

  // --- API Actions ---

  fetchBuddies: async () => {
    try {
      const res = await fetch(`${API_BASE}/users/all-buddies`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch buddies");
      const data = await res.json();
      set({ buddies: data });
    } catch (err) {
      console.error("Buddy fetch error:", err);
    }
  },

  fetchConnections: async () => {
    try {
      const res = await fetch(`${API_BASE}/connections/my-status`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch connections");
      const data = await res.json();
      set({ connections: data });
    } catch (err) {
      console.error("Connections fetch error:", err);
    }
  },

  sendRequest: async (buddyId: number) => {
    try {
      const res = await fetch(`${API_BASE}/connections/send`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ receiverId: buddyId }),
      });
      if (res.ok) {
        await get().fetchConnections();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  respondToRequest: async (
    buddyId: number,
    action: "accepted" | "rejected",
  ) => {
    try {
      const res = await fetch(`${API_BASE}/connections/update`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ buddyId, action }),
      });
      if (res.ok) {
        // Updated: Yahan hum state ko sync kar rahe hain
        await get().fetchConnections();
        await get().fetchBuddies();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Response error:", err);
      return false;
    }
  },
}));
