"use client";
import { useState } from "react";
import { useMenu } from "@/app/hooks/useMenu";
import MenuItemModal from "@/app/components/MenuItemModal";
import AddMenuItemModal from "@/app/components/AddMenuItemModal";

export default function Menu() {
  const { menu, loading, error, refetch } = useMenu();
  const [selectedItem, setSelectedItem] = useState<(typeof menu)[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const token = localStorage.getItem("tokenDash") || "";

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
        Cocktail Menu
      </h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add New Drink
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {menu.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="flex flex-col items-center border rounded-md p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <img
              src={`http://localhost:5000${item.img_path}`}
              alt={item.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h3 className="font-semibold">{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          token={token}
          onClose={() => setSelectedItem(null)}
          onDeleteSuccess={refetch}
        />
      )}

      {showAddModal && (
        <AddMenuItemModal
          token={token}
          onClose={() => setShowAddModal(false)}
          onAddSuccess={refetch}
        />
      )}
    </div>
  );
}
