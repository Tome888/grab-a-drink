"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
interface TableModalProps {
  table: { id: number; name: string } | null;
  id: number;
  onClose: () => void;
  onDeleteSuccess: () => void;
  token: string;
}
const QRCode = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeCanvas),
  { ssr: false }
);

export default function TableModal({
  table,
  id,
  onClose,
  onDeleteSuccess,
  token,
}:TableModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!table) return null;

  const handleDelete = async () => {
    if (!confirm(`Delete table "${table.name}"?`)) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/delete-table/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.message);

      onDeleteSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const qrUrl = `${window.location.origin}/order-now/${id}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {table.name}
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Table ID: <span className="font-semibold">{id}</span>
        </p>

        <Link
          href={qrUrl}
          target="_blank"
          className="text-blue-600 dark:text-blue-400 underline text-sm"
        >
          Open order page for this table →
        </Link>

        <div className="my-6 flex justify-center">
          <QRCode value={qrUrl} size={140} />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
          >
            Close
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
