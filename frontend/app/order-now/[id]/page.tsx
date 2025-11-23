"use client";

import { useEffect, useState } from "react";
import DrinkCard from "@/app/components/DrinkCard";
import OrderNav from "@/app/components/OrderNav";
import { useMenu } from "@/app/hooks/useMenu";
import { MenuItem } from "@/app/hooks/useMenu";
import { validateOrderToken } from "@/app/helpers/validateOrderToken";
import { useParams } from "next/navigation";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  img_path: string;
  quantity: number;
}

export default function OrderNow() {
  const { menu, loading } = useMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userToken, setUserToken] = useState("");
  const { id } = useParams();
  
  const addOrUpdateCart = (item: MenuItem, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity } : p));
      }

      return [...prev, { ...item, quantity }];
    });
  };

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
    console.log("ORDER SENT:", cart);
    setCart([]);
    alert("Order Sent! Check console.");
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
      />

      <main className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-[100px] text-black">
        {!loading &&
          menu.map((drink) => {
            const existing = cart.find((item) => item.id === drink.id);

            return (
              <DrinkCard
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
