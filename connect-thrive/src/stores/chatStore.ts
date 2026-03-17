import { create } from 'zustand';

// Message ka structure
export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  created_at: string;
  is_request: boolean;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  
  // API Actions
  fetchMessages: (buddyId: number) => Promise<void>;
  sendMessage: (buddyId: number, text: string) => Promise<boolean>;
  
  // Real-time Action
  addMessage: (message: Message) => void;
  
  clearMessages: () => void;
}

const API_BASE = "http://localhost:5000/api/messages";

// Helper to get Auth Headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,

  // 1. Chat history fetch karna
  fetchMessages: async (buddyId: number) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/chat/${buddyId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      set({
        messages: data.sort(
          (a: Message, b: Message) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
        isLoading: false,
      });
    } catch (err) {
      console.error("Fetch messages error:", err);
      set({ isLoading: false });
    }
  },

  // 2. Naya message API ke through bhejna
  sendMessage: async (buddyId: number, text: string) => {
    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ receiverId: buddyId, text }),
      });

      if (res.ok) {
        // API success hone ke baad, hum manually local state update karenge
        // Taki baar-baar fetchMessages na chalana pade (Optimistic Update)
        const newMsg = await res.json();
        get().addMessage(newMsg);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Send message error:", err);
      return false;
    }
  },

  // 3. Real-time mein naya message add karna (Socket ke liye)
addMessage: (message: Message) => {
  set((state) => {
    // Agar message already exist karta hai, toh return karo
    if (state.messages.find((m) => m.id === message.id)) {
      return state;
    }
    // Warna naya message add karo
    return { messages: [...state.messages, message] };
  });
},

  // 4. Cleanup
  clearMessages: () => set({ messages: [] }),
}));