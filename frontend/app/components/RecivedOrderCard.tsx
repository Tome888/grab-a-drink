"use client";

import { useState } from "react";
import { Order } from "../context/OrdersContext";
import { updateOrderSeen } from "../helpers/updateOrderSeen";
import { useAdminSessionContext } from "../context/AdminSessionContext";

interface CardProps {
  order: Order;
}

export default function RecivedOrderCard({ order }: CardProps) {
  const [seen, setSeen] = useState(order.seen);
  const { token } = useAdminSessionContext();

  const toggleSeen = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (!token) {
      console.warn("Admin token not available.");
      return;
    }

    try {
      const newState = !seen;
      setSeen(newState);
      
      await updateOrderSeen(order.id, newState, token);
      
    } catch (err) {
      console.error("Failed to update seen status", err);
      setSeen(seen);
    }
  };

  const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
      <span className="text-lg font-semibold text-gray-900">{value}</span>
    </div>
  );

  return (
    <div
      className={`
        relative 
        p-4 sm:p-6 
        bg-white 
        rounded-xl 
        shadow-lg 
        transition duration-200 ease-in-out
        ${
          !seen 
            ? "ring-2 ring-blue-500 shadow-blue-200/50 hover:shadow-xl" 
            : "shadow-md hover:shadow-lg"
        }
      `}
    >
      {!seen && (
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
        
        <div className="col-span-2 md:col-span-1">
          <DetailItem label="Drink" value={order.drink_name} />
        </div>
        
        <div className="col-span-1 md:col-span-1">
          <DetailItem label="Table" value={order.table_name} />
        </div>

        <div className="col-span-1 md:col-span-1 text-center">
          <DetailItem label="Qty" value={order.quantity} />
        </div>

        <div className="col-span-1 md:col-span-1 text-center">
          <DetailItem label="Price" value={`$${order.drink_price}`} />
        </div>
        
        <div className="col-span-2 md:col-span-1 flex justify-center md:justify-end">
          <button
            onClick={toggleSeen}
            className={`
              w-full md:w-auto
              px-4 py-2 
              text-sm font-bold rounded-full 
              shadow-md 
              transition duration-150 ease-in-out
              ${
                seen
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }
            `}
          >
            {seen ? "Mark Unseen" : "Mark Seen"}
          </button>
        </div>
      </div>
    </div>
  );
}