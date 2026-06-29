import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { formatRupiah } from "../../helper/FormatRupiah";

export const ToastOptionModal = ({ product, onClose, onAdd }) => {
  const [selectedToppingIds, setSelectedToppingIds] = useState([]);
  const [note, setNote] = useState("");

  const toppings = product.toppings || [];
  const basePrice = product.discPrice ?? product.price;

  const toppingTotal = selectedToppingIds.reduce((sum, id) => {
    const topping = toppings.find((t) => t.id === id);
    return sum + (topping?.price || 0);
  }, 0);

  const grandTotal = basePrice + toppingTotal;

  const toggleTopping = (id, isOutOfStock) => {
    if (isOutOfStock) return;
    setSelectedToppingIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleAdd = () => {
    // Simpan id + price topping yang dipilih, agar harga tidak perlu dihitung ulang di luar
    const selectedToppingsData = selectedToppingIds.map((id) => {
      const topping = toppings.find((t) => t.id === id);
      return { id, name: topping?.name || id, price: topping?.price || 0 };
    });
    onAdd({ size: "-", toppings: selectedToppingsData, note });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-orange-600">{product.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-stone-400 hover:text-stone-600"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {toppings.length > 0 && (
          <div className="mb-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-orange-600">
              Tambah Topping
            </p>
            <div className="flex flex-col gap-2">
              {toppings.map((topping) => {
                const isChecked = selectedToppingIds.includes(topping.id);
                const isOutOfStock = topping.outOfStock;
                return (
                  <button
                    key={topping.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => toggleTopping(topping.id, isOutOfStock)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                      isOutOfStock
                        ? "cursor-not-allowed border-stone-100 bg-stone-50 opacity-60"
                        : isChecked
                          ? "cursor-pointer border-orange-400 bg-orange-50"
                          : "cursor-pointer border-stone-200 bg-white hover:border-orange-200"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          isOutOfStock
                            ? "text-stone-400"
                            : isChecked
                              ? "text-orange-600"
                              : "text-stone-700"
                        }`}
                      >
                        {topping.name}
                      </span>
                      {isOutOfStock ? (
                        <span className="text-xs font-semibold text-red-500">
                          Stock Habis
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">
                          +{formatRupiah(topping.price)}
                        </span>
                      )}
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        isOutOfStock
                          ? "border-stone-200"
                          : isChecked
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-stone-300"
                      }`}
                    >
                      {isChecked && !isOutOfStock && (
                        <span className="text-xs">✓</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
            Catatan
          </p>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Permintaan tambahan..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300 focus:bg-white"
          />
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
          <span className="text-sm font-semibold text-stone-700">Total</span>
          <span className="text-sm font-extrabold text-orange-600">
            {formatRupiah(grandTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full cursor-pointer rounded-full bg-orange-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-700"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};
