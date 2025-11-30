"use client"

import { useState, useEffect, useCallback } from "react";
import { useAdminSessionContext } from "../context/AdminSessionContext";
import { Order } from "../context/OrdersContext";

export function useOrdersFetcher() {
    const [orders, setOrders] = useState<Order[]|[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { token } = useAdminSessionContext(); 

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError("");

        if (!token) {
            setError("No token found");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/get-orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.message || `Failed to fetch orders (Status: ${res.status})`);
            } else {
                const reversedOrders = data.orders.reverse();
                setOrders(reversedOrders);
            }
        } catch (err) {
            console.error("Orders API Error:", err);
            setError("Server connection error during initial fetch.");
        } finally {
            setLoading(false);
        }
    }, [token]); 

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [token, fetchOrders]); 

    return { orders, loading, error };
}