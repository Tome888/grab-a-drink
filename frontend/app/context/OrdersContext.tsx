"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAdminSessionContext } from "./AdminSessionContext"; 

export interface Order {
  id: number;
  table_id: number;
  table_name: string;
  drink_id: number;
  drink_name: string;
  drink_price: number;
  quantity: number;
  seen: boolean;
}

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

let socket: Socket | null = null; 

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAdminSessionContext(); 

  const fetchOrders = async (myToken: string | null) => {
    setLoading(true);
    setError(null);

    if (!myToken) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/get-orders", {
        headers: { Authorization: `Bearer ${myToken}` },
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.message || "Failed to fetch orders");
      } else {
        const reversedOrders = data.orders.reverse();
        setOrders(reversedOrders);
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchOrders(token);

    if (!socket) {
      socket = io("http://localhost:5000");
    }

    const handleOrders = (newOrders: Order[]) => {
      setOrders((prev) => [...newOrders, ...prev]); 
    };

    socket.on("orders", handleOrders);

    return () => {
      socket?.off("orders", handleOrders);
      socket?.disconnect()
      socket = null;
    };

  }, [token]); 

  return (
    <OrdersContext.Provider value={{ orders, loading, error }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}