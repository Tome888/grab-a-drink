"use client";

import RecivedOrderCard from "@/app/components/RecivedOrderCard";
import { useOrders } from "@/app/context/OrdersContext";

export default function OrderList() {
  const { orders, loading, error } = useOrders();

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-2xl font-medium text-indigo-600 animate-pulse">
          Loading Orders...
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white-900 mb-8 border-b-2 pb-2">
        🍹Received Orders
      </h2>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <RecivedOrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center p-8 bg-white border border-dashed border-gray-300 rounded-xl shadow-lg">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            ></path>
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            No Orders Yet!
          </h2>
          <p className="mt-1 text-gray-500">
            It looks like you haven't received any orders. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
