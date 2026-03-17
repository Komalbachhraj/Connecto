
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CommunityContextType {
  joinedCommunities: string[];
  joinCommunity: (id: string) => void;
  leaveCommunity: (id: string) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  // Load from localStorage so state persists across page refreshes
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("joinedCommunities");
      return stored ? JSON.parse(stored) : ["travel", "dsa", "mental-wellness", "startup", "gym"];
      // ↑ Default: all joined (matches your current profile page). 
      // Change to [] if you want users to start with none joined.
    } catch {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem("joinedCommunities", JSON.stringify(joinedCommunities));
  }, [joinedCommunities]);

  const joinCommunity = (id: string) => {
    setJoinedCommunities((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const leaveCommunity = (id: string) => {
    setJoinedCommunities((prev) => prev.filter((c) => c !== id));
  };

  return (
    <CommunityContext.Provider value={{ joinedCommunities, joinCommunity, leaveCommunity }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used inside CommunityProvider");
  return ctx;
};