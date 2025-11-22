"use client";

import { useState } from "react";

export function useAddTable(refetch: () => void, token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTable = async (name: string, onSuccess?: () => void) => {
    setLoading(true);
    setError("");

    try {
        console.log(token)
      const res = await fetch("http://localhost:5000/api/add-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Failed to add table");

      refetch();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return { addTable, loading, error };
}
