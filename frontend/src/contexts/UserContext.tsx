"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface UserContextValue {
  userId: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // For Google users, use email as user ID (consistent with backend)
      const id = session.user.email || null;
      setUserId(id);
      setUsername(session.user.name || null);
      setEmail(session.user.email || null);
    } else {
      setUserId(null);
      setUsername(null);
      setEmail(null);
    }
  }, [session, status]);

  const value: UserContextValue = {
    userId,
    username,
    email,
    isAuthenticated: status === "authenticated"
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
