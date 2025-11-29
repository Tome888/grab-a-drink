"use client";

import { useEffect, useState } from "react";
import DrinkCard from "@/app/components/DrinkCard";
import OrderNav from "@/app/components/OrderNav";
import { useMenu } from "@/app/hooks/useMenu";
import { MenuItem } from "@/app/hooks/useMenu";
import { validateOrderToken } from "@/app/helpers/validateOrderToken";
import { useParams } from "next/navigation";
import { useOrderSocket } from "@/app/hooks/useOrderSocket";
import { useTables } from "@/app/hooks/useTables";

export interface CartItem extends MenuItem {
  quantity: number;
  tableId: number;
  tableName: string;
  seen: boolean;
}

const WAITER_ITEM: CartItem = { 
    id: Number(new Date()), 
    name: "WAITER CALL", 
    price: 0, 
    img_path: "", 
    quantity: 1, 
    tableId: 0, 
    tableName: "", 
    seen: false 
};

const BILL_ITEM: CartItem = { 
    id: Number(new Date()), 
    name: "BILL REQUEST", 
    price: 0, 
    img_path: "", 
    quantity: 1, 
    tableId: 0, 
    tableName: "", 
    seen: false 
};

export default function OrderNow() {
  const { menu, loading } = useMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userToken, setUserToken] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null); 
  const { id } = useParams();
  const tableId = Number(id);
  const { sendOrderSocket } = useOrderSocket(String(id));
  const { tables } = useTables();

  const addOrUpdateCart = (
    item: MenuItem,
    quantity: number,
    tableId: number
  ) => {
    const { name } = tables.find((table) => table.id === tableId) ?? {
      name: `Table ${tableId}`,
    };

    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      const newItem: CartItem = {
        ...item,
        quantity,
        tableId,
        tableName: name,
        seen: false,
      };

      if (existing) {
        return prev.map((p) => (p.id === item.id ? newItem : p));
      }

      return [...prev, newItem];
    });
  };

  const sendSpecialOrder = (item: CartItem) => {
    if (!userToken) {
        setStatusMessage("Error: Please validate your table token before requesting the bill.");
        return;
    }
    
    const currentTable = tables.find((table) => table.id === tableId);
    const orderItem: CartItem = {
        ...item,
        tableId: tableId,
        tableName: currentTable?.name || `Table ${id}`,
    };

    console.log(`${item.name} SENT:`, orderItem);
    sendOrderSocket([orderItem]); 
    
    setStatusMessage(`${item.name} successfully requested!`);
    
    setTimeout(() => setStatusMessage(null), 3500);
  };
  
  const requestBill = () => sendSpecialOrder(BILL_ITEM);
  const callWaiter = () => sendSpecialOrder(WAITER_ITEM); 

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQuantity = (id: number, qty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const sendOrder = () => {
    if (!userToken) return;
    sendOrderSocket(cart);
    setCart([]);
    setStatusMessage("Your order has been sent successfully!");
    setTimeout(() => setStatusMessage(null), 3500);
  };

  useEffect(() => {
    const token = localStorage.getItem("orderToken");
    if (!token) return;
    validateOrderToken({ token, tableId: `${id}`, setTheToken: setUserToken });
  }, []);

  return (
    <>
      <OrderNav
        cart={cart}
        onSendOrder={sendOrder}
        onRemove={removeFromCart}
        onUpdateQty={changeQuantity}
        orderToken={userToken}
        setUserToken={setUserToken}
        onRequestBill={requestBill} 
        onCallWaiter={callWaiter} 
        tableId={id as string}
      />
      
      {statusMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-3 bg-green-500 text-white rounded-lg shadow-xl transition-opacity duration-300">
            {statusMessage}
        </div>
      )}

      <main className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-[100px] text-black">
        {!loading &&
          menu.map((drink) => {
            const existing = cart.find((item) => item.id === drink.id);

            return (
              <DrinkCard
                tableId={tableId}
                key={drink.id}
                {...drink}
                currentQty={existing?.quantity}
                onAddOrUpdate={addOrUpdateCart}
              />
            );
          })}
      </main>
    </>
  );
}