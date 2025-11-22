"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AdminSessionContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AdminSessionContext = createContext<AdminSessionContextType | undefined>(undefined);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tokenDash") || null;
    }
    return null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("tokenDash");
    if (!storedToken) return;

    fetch("http://localhost:5000/api/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log("Token valid for user:", data.user);
        } else {
          console.log("Token invalid");
          localStorage.removeItem("tokenDash");
          setToken(null);
          router.push("/");
        }
      });
  }, []);

  return (
    <AdminSessionContext.Provider value={{ token, setToken }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSessionContext() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error("useAdminSessionContext must be used within an AdminSessionProvider");
  }
  return context;
}
