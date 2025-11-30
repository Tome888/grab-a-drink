"use client";

import { useState } from "react";
interface AddTableModalProps {
  onClose: () => void;
  onAdd: (name: string) => void;
}
export default function AddTableModal({ onClose, onAdd }:AddTableModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return setError("Table name cannot be empty");

    onAdd(name.trim());
    setName("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Add New Table
        </h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Table name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-blue-400 outline-none mb-2"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
