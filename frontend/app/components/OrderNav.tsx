"use client";

import { useState } from "react";
import { CartItem } from "../order-now/[id]/page";
import { validateLocation } from "../helpers/validateLocation";
import { useParams } from "next/navigation";

export default function OrderNav({
  cart,
  onSendOrder,
  onRemove,
  onUpdateQty,
  orderToken,
  setUserToken,
}: {
  cart: CartItem[];
  onSendOrder: () => void;
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
  orderToken: string;
  setUserToken: (token: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const increase = (id: number, qty: number) => onUpdateQty(id, qty + 1);

  const decrease = (id: number, qty: number) => {
    if (qty === 1) return;
    onUpdateQty(id, qty - 1);
  };

  return (
    <>
      {/* NAV */}
      <nav className="w-full fixed top-0 left-0 z-40 bg-white shadow-md text-black flex justify-around items-center py-3">
        <button className="text-2xl">💳</button>
        <button className="text-2xl">🤵‍♂️</button>

        <button className="relative text-2xl" onClick={() => setOpen(true)}>
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* CART POPUP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black w-full max-w-md p-4 rounded-t-2xl shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button onClick={() => setOpen(false)} className="text-lg">
                ✖
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-6">Cart is empty</p>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrease(item.id, item.quantity)}
                        className="bg-gray-200 px-2 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increase(item.id, item.quantity)}
                        className="bg-gray-200 px-2 rounded"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-600 text-sm ml-3"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {orderToken ? (
                  <button
                    onClick={onSendOrder}
                    className="mt-4 w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 active:scale-95 transition"
                  >
                    Send Order
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      validateLocation({
                        setTheToken: setUserToken,
                        tableId: `${id}`,
                      })
                    }
                    className="mt-4 w-full bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 active:scale-95 transition"
                  >
                    Validate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
