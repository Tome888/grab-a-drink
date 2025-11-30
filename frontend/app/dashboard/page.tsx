"use client"
import { useMemo } from "react";
import { useOrdersFetcher } from "../hooks/useOrdersFetcher";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { orders, loading, error } = useOrdersFetcher();

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((order) => {
      if (!map[order.drink_name]) map[order.drink_name] = 0;
      map[order.drink_name] += order.quantity;
    });

    return Object.entries(map).map(([name, total]) => ({
      name,
      total,
    }));
  }, [orders]);

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-200">
        Dashboard Overview
      </h2>

      {loading && <h2 className="mt-4 text-lg">LOADING...</h2>}
      {error && <h2 className="mt-4 text-lg text-red-500">{error}</h2>}

      <div className="mt-6">
        <h3 className="text-xl font-medium text-gray-300 mb-4">
          Drink Orders Analytics
        </h3>

        <div className="w-full h-80 flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "8px",
                    border: "none",
                    color: "white",
                  }}
                  itemStyle={{ color: "white" }}
                  labelStyle={{ color: "#93c5fd" }}
                />
                <Bar dataKey="total" fill="#4A90E2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-lg">
              No order data available to display analytics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}



