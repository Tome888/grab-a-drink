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
  const { addTable, loading: adding, error: addError } = useAddTable(refetch, token??"");

  const [selectedTable, setSelectedTable] = useState<{ id: number; name: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) return <p>Loading tables...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
          Tables
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Add Table
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 justify-center">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => setSelectedTable(table)}
            className="flex items-center flex-col justify-center h-20 w-20 border rounded-md border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-mono text-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <span>┬─┬</span>
            <p>{table.name}</p>
          </div>
        ))}
      </div>

      {selectedTable?.id && (
        <TableModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          id={selectedTable.id} onDeleteSuccess={() => refetch()} token={token??""} />
      )}

      {showAddModal && (
        <AddTableModal
          onClose={() => setShowAddModal(false)}
          onAdd={(name) => addTable(name, () => setShowAddModal(false))}
        />
      )}

      {adding && <p>Adding table...</p>}
      {addError && <p className="text-red-500">{addError}</p>}
    </div>
  );
}
