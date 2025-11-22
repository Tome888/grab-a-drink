"use client";
import { useState } from "react";
import { convertToWebP } from "../helpers/convertToWebP";

interface Props {
  token: string;
  onClose: () => void;
  onAddSuccess: () => void;
}

export default function AddMenuItemModal({ token, onClose, onAddSuccess }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!name || !price || !image) {
      setError("Please provide name, price, and image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const webpBlob = await convertToWebP(image);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("image", webpBlob, `${Date.now()}.webp`);

      const res = await fetch("http://localhost:5000/api/add-menu-item", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Failed to add menu item");

      onAddSuccess();
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
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Add New Drink
        </h3>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex-1"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
