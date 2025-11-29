import { RefObject, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
export interface OrderItem {
  id: number;
  img_path: string;
  name: string;
  price: number;
  quantity: number;
  tableId: number;
  tableName: string;
};

interface OrderHookProps{
sendOrderSocket: (order: OrderItem[]) => void;
socketRef: RefObject<Socket | null>;
}

export function useOrderSocket(tableId?: string):OrderHookProps {
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000");
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [tableId]);

  const sendOrderSocket = (order: OrderItem[]) => {
    socketRef.current?.emit("orders", order);
  };

  return {
    socketRef,
    sendOrderSocket,
  };
}
