"use client";

import { useState } from "react";
import { useTables } from "@/app/hooks/useTables";
import TableModal from "@/app/components/TableModal";
import AddTableModal from "@/app/components/AddTableModal";
import { useAddTable } from "@/app/hooks/useAddTable";
import { useAdminSessionContext } from "@/app/context/AdminSessionContext";

export default function Tables() {
  const { tables, loading, error, refetch } = useTables();
  const { token } = useAdminSessionContext();
  const { addTable, loading: adding, error: addError } = useAddTable(
    refetch,
    token ?? ""
  );

  const [selectedTable, setSelectedTable] = useState<{ id: number; name: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) return <p>Loading tables...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Tables
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition"
        >
          + Add Table
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTable(table)}
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl h-28 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <span className="text-3xl">🍹</span>
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {table.name}
            </p>
          </button>
        ))}
      </div>

      {selectedTable && (
        <TableModal
          table={selectedTable}
          id={selectedTable.id}
          onClose={() => setSelectedTable(null)}
          onDeleteSuccess={() => refetch()}
          token={token ?? ""}
        />
      )}

      {showAddModal && (
        <AddTableModal
          onClose={() => setShowAddModal(false)}
          onAdd={(name) => addTable(name, () => setShowAddModal(false))}
        />
      )}

      {adding && <p className="mt-4 text-gray-600">Adding table...</p>}
      {addError && <p className="text-red-500">{addError}</p>}
    </div>
  );
}
