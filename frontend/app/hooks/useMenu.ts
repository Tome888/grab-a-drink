"use client";
import { useEffect, useState } from "react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  img_path: string;
}

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/menu");
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Failed to fetch menu");
      setMenu(data.menu);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return { menu, loading, error, refetch: fetchMenu };
}
