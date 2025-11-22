"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const QRCode = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeCanvas),
  { ssr: false }
);

interface TableModalProps {
  table: { id: number; name: string } | null;
  id: number;
  onClose: () => void;
  onDeleteSuccess: () => void;
  token: string;
}

export default function TableModal({ table, onClose, id, onDeleteSuccess, token }: TableModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!table) return null;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete table "${table.name}"?`)) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/delete-table/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Failed to delete table");

      onDeleteSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const qrUrl = `${window.location.origin}/order-now/${id}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {table.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          This is a popup for table <strong>{table.name}</strong>.
        </p>
        <h2 className="mb-4">ID: {id}</h2>

        <div className="my-4 flex justify-center">
          <QRCode value={qrUrl} size={128} />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition flex-1"
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex-1"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}