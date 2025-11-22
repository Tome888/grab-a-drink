"use client";

import { useEffect, useState, useCallback } from "react";

interface Table {
  id: number;
  name: string;
}

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/tables");
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Failed to fetch tables");
      setTables(data.tables);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return { tables, loading, error, refetch: fetchTables };
}
