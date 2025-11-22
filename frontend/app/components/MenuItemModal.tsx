"use client";

import {useState } from "react";

interface MenuItemModalProps {
  item: { id: number; name: string; img_path: string; price: number } | null;
  token: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export default function MenuItemModal({
  item,
  token,
  onClose,
  onDeleteSuccess,
}: MenuItemModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) return null;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/delete-menu/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.ok)
        throw new Error(data.message || "Failed to delete menu item");

      onDeleteSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <img
          src={`http://localhost:5000${item.img_path}`}
          alt={item.name}
          className="w-full h-40 object-cover rounded mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {item.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          ${item.price.toFixed(2)}
        </p>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
