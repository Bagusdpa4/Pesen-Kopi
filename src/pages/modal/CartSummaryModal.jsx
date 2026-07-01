import React, { useEffect } from "react";
import { HiXMark, HiTrash } from "react-icons/hi2";
import { formatRupiah } from "../../helper/FormatRupiah";

export const CartSummaryModal = ({
  cartItems,
  total,
  onClose,
  onRemove,
  onUpdateQty,
}) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-orange-600">Keranjang</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-stone-400 hover:text-stone-600"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="py-10 text-center text-sm text-stone-400">
            Belum ada menu dipilih
          </p>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 px-4 py-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-900">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {item.type === "fore1L"
                      ? [
                          item.sweet && item.sweet !== "-"
                            ? item.sweet === "normal_sweet"
                              ? "Normal Sweet"
                              : "Less Sweet"
                            : null,
                          item.espresso && item.espresso !== "normal_shot"
                            ? item.espresso === "no_coffee"
                              ? "No Coffee"
                              : item.espresso === "plus_1_shot"
                                ? "+1 Shot"
                                : "+2 Shot"
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" • ")
                      : item.type === "fore"
                        ? [
                            item.size === "R"
                              ? "Reguler"
                              : item.size === "L"
                                ? "Large"
                                : item.size,
                            item.sugar && item.sugar !== "-"
                              ? item.sugar
                              : null,
                            item.ice && item.ice !== "-" ? item.ice : null,
                            item.espresso && item.espresso !== "normal_shot"
                              ? item.espresso === "no_coffee"
                                ? "No Coffee"
                                : item.espresso === "plus_1_shot"
                                  ? "+1 Shot"
                                  : "+2 Shot"
                              : null,
                            item.dairy && item.dairy !== "milk"
                              ? item.dairy === "soy_multigrain"
                                ? "Soy Multigrain"
                                : item.dairy === "oat_milk"
                                  ? "Oat Milk"
                                  : "Almond Milk"
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" • ")
                        : [
                            item.size && item.size !== "-"
                              ? item.size === "R"
                                ? "Reguler"
                                : item.size === "L"
                                  ? "Large"
                                  : item.size
                              : null,
                            item.sugar && item.sugar !== "-"
                              ? item.sugar
                              : null,
                            item.ice && item.ice !== "-" ? item.ice : null,
                            item.toppings?.length > 0
                              ? `Topping: ${item.toppings.join(", ")}`
                              : null,
                            item.noteStr ? `Catatan: ${item.noteStr}` : null,
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-orange-600">
                    {formatRupiah(item.unitPrice * item.qty)}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.key, -1)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-300"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-semibold">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.key, 1)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-300"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.key)}
                    className="ml-1 cursor-pointer text-stone-400 hover:text-red-500"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-stone-400">
            Total
          </span>
          <span className="text-lg font-extrabold text-orange-600">
            {formatRupiah(total)}
          </span>
        </div>
      </div>
    </div>
  );
};
