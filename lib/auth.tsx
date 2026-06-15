"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "./supabase";
import { pullProgressFromDB, pushAllLocalToDB, setProgressUser } from "./progress";


type User = { id: string; email: string | null; user_metadata: Record<string, string> } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
}>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current session on load.
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setUser(u ? { id: u.id, email: u.email ?? null, user_metadata: (u.user_metadata as Record<string, string>) || {} } : null);
      setProgressUser(u ? u.id : null);
      setLoading(false);
    });

    // React to sign-in / sign-out.
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user;
        if (u) {
          setUser({ id: u.id, email: u.email ?? null, user_metadata: (u.user_metadata as Record<string, string>) || {} });
          setProgressUser(u.id);
          // On sign-in: push any anonymous local progress up, then pull the merged set down.
          await pushAllLocalToDB();
          await pullProgressFromDB();
          window.dispatchEvent(new Event("progress-synced"));
        } else {
          setUser(null);
          setProgressUser(null);
        }
      }
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}