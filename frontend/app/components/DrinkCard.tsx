"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "../hooks/useMenu";

interface Props extends MenuItem {
  currentQty?: number;
  onAddOrUpdate: (item: MenuItem, quantity: number, tableId:number) => void;
tableId:number
}

export default function DrinkCard({
  id,
  name,
  price,
  img_path,
  currentQty,
  tableId,
  onAddOrUpdate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (currentQty) setQty(currentQty);
  }, [currentQty]);

  const increase = () => setQty((q) => q + 1);
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    onAddOrUpdate({ id, name, price, img_path}, qty, tableId );
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-3 flex flex-col items-center text-center text-black"
      >
        <img
          src={`http://localhost:5000${img_path}`}
          alt={name}
          className="w-full h-32 object-cover rounded-lg"
        />
        <h3 className="mt-2 font-semibold">{name}</h3>
        <p className="text-sm">${price}</p>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white text-black rounded-xl p-4 w-full max-w-sm shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:5000${img_path}`}
              alt={name}
              className="w-full h-60 object-cover rounded-lg mb-3"
            />

            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-lg mt-1 mb-4">${price}</p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={decrease}
                className="bg-gray-200 px-3 py-1 rounded-lg text-lg"
              >
                -
              </button>

              <span className="text-xl font-semibold">{qty}</span>

              <button
                onClick={increase}
                className="bg-gray-200 px-3 py-1 rounded-lg text-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 active:scale-95 transition"
            >
              {currentQty ? "Update Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
