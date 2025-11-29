"use client";

import { useState } from "react";
import { CartItem } from "../order-now/[id]/page";
import { validateLocation } from "../helpers/validateLocation";

interface OrderNavProps {
  cart: CartItem[];
  onSendOrder: () => void;
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
  orderToken: string;
  setUserToken: (token: string) => void;
  onRequestBill: () => void; 
  onCallWaiter: () => void; 
  tableId: string; 
}

const ConfirmModal = ({
    title,
    message,
    onConfirm,
    onCancel,
    disabled
}: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    disabled: boolean;
}) => (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-black dark:bg-gray-800 dark:text-white w-full max-w-sm p-6 rounded-xl shadow-2xl space-y-4 transform transition-transform duration-300 scale-100"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`
                px-4 py-2 font-semibold rounded-lg text-white transition active:scale-95
                ${
                    disabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                }
            `}
          >
            Confirm Request
          </button>
        </div>
      </div>
    </div>
);


export default function OrderNav({
  cart,
  onSendOrder,
  onRemove,
  onUpdateQty,
  orderToken,
  setUserToken,
  onRequestBill,
  onCallWaiter,
  tableId,
}: OrderNavProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState<"waiter" | "bill" | null>(null); 
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const increase = (id: number, qty: number) => onUpdateQty(id, qty + 1);

  const decrease = (id: number, qty: number) => {
    if (qty === 1) return onRemove(id); 
    onUpdateQty(id, qty - 1);
  };
  

  const handleBillRequest = () => {
    if (!orderToken) {
        validateLocation({ setTheToken: setUserToken, tableId: tableId });
        return;
    }
    setConfirming('bill');
  };

  const handleWaiterRequest = () => {
    setConfirming('waiter');
  };
  
  const handleConfirmAction = () => {
    if (confirming === 'bill') {
        onRequestBill();
    } else if (confirming === 'waiter') {
        onCallWaiter();
    }
    setConfirming(null);
  }

  const isOrderSendable = cart.length > 0 && orderToken;


  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-40 bg-white dark:bg-gray-900 shadow-xl text-black dark:text-white flex justify-center items-center py-3 px-4 sm:px-8">
        <div className="flex justify-between w-full max-w-lg">
            <button 
                onClick={handleBillRequest} 
                className="text-2xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Request Bill"
            >
                💳
            </button>
            
            <button 
                onClick={handleWaiterRequest} 
                className="text-2xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Call Waiter"
            >
                🤵‍♂️
            </button>
            
            <button 
                className="relative text-2xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition" 
                onClick={() => setOpen(true)}
                title="View Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
        </div>
      </nav>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 text-black dark:text-white w-full max-w-md p-4 rounded-t-2xl shadow-xl max-h-[80vh] flex flex-col"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-2xl font-bold">Your Cart ({cartCount})</h2>
              <button onClick={() => setOpen(false)} className="text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition">
                &times;
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-6">Cart is empty. Time to order!</p>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto flex-grow">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b dark:border-gray-700 pb-2"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)} ea.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrease(item.id, item.quantity)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition active:scale-95"
                      >
                        -
                      </button>

                      <span className="font-semibold w-4 text-center">{item.quantity}</span>

                      <button
                        onClick={() => increase(item.id, item.quantity)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition active:scale-95"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-600 text-sm ml-3 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-4 border-t dark:border-gray-700 mt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total:</span>
                    <span>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                
                {orderToken ? (
                  <button
                    onClick={isOrderSendable ? onSendOrder : () => {}} // Call sendOrder only if token is present
                    disabled={!isOrderSendable}
                    className={`mt-2 w-full p-3 rounded-lg font-bold transition ${
                      isOrderSendable 
                        ? "bg-green-600 text-white hover:bg-green-700 active:scale-[0.99] shadow-md shadow-green-500/30"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {isOrderSendable ? `Place Order (${cartCount} Items)` : "Add Items to Cart"}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      validateLocation({
                        setTheToken: setUserToken,
                        tableId: tableId,
                      })
                    }
                    className="mt-4 w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 active:scale-95 transition shadow-md shadow-amber-500/30"
                  >
                    Validate Table Location to Order
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
      
      {confirming === 'waiter' && (
        <ConfirmModal
            title="Call Waiter"
            message="Are you sure you want to send a request for a waiter to your table?"
            onConfirm={handleConfirmAction}
            onCancel={() => setConfirming(null)}
            disabled={false}
        />
      )}
      
      {confirming === 'bill' && (
        <ConfirmModal
            title="Request Bill"
            message={`Are you sure you want to request the bill for Table ${tableId}? Your existing cart items will not be placed.`}
            onConfirm={handleConfirmAction}
            onCancel={() => setConfirming(null)}
            disabled={!orderToken} 
        />
      )}
    </>
  );
}