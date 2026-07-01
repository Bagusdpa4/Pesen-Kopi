import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { formatRupiah } from "../../helper/FormatRupiah";

const ALL_ESPRESSO_OPTIONS = [
  { id: "normal_shot", label: "Normal Shot", extraPrice: 0 },
  { id: "no_coffee", label: "No Coffee", extraPrice: 0 },
  { id: "plus_1_shot", label: "+1 Shot", extraPrice: 7000 },
  { id: "plus_2_shot", label: "+2 Shot", extraPrice: 14000 },
];

const SWEET_LABELS = {
  normal_sweet: "Normal Sweet",
  less_sweet: "Less Sweet",
};

export const ForeOptionModal = ({ product, onClose, onAdd }) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Sweetness — dari JSON product.sweetness
  const sweetnessOptions = product.sweetness ?? [];
  const [sweet, setSweet] = useState(sweetnessOptions[0] ?? "-");

  // Espresso — dari JSON product.allowedEspresso (opsional)
  const espressoOptions = product.allowedEspresso
    ? ALL_ESPRESSO_OPTIONS.filter((o) => product.allowedEspresso.includes(o.id))
    : null;
  const [espresso, setEspresso] = useState(espressoOptions?.[0]?.id ?? null);

  const basePrice = product.discPrice ?? product.price ?? 0;
  const espressoExtra =
    ALL_ESPRESSO_OPTIONS.find((o) => o.id === espresso)?.extraPrice ?? 0;
  const totalPrice = basePrice + espressoExtra;

  const handleAdd = () => {
    onAdd({ sweet, espresso, totalPrice });
    onClose();
  };

  const renderOptions = (options, selected, onSelect) => (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors ${
              isSelected
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : "border-stone-200 bg-white text-stone-700 hover:border-orange-200"
            }`}
          >
            {opt.label}
            {opt.extraPrice > 0 && (
              <span className="ml-1 text-xs font-normal text-stone-400">
                (+{formatRupiah(opt.extraPrice)})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[60vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
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

        {/* Sweetness */}
        {sweetnessOptions.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Sweet Level
            </p>
            {renderOptions(
              sweetnessOptions.map((id) => ({
                id,
                label: SWEET_LABELS[id] ?? id,
                extraPrice: 0,
              })),
              sweet,
              setSweet,
            )}
          </div>
        )}

        {/* Espresso — hanya jika ada allowedEspresso */}
        {espressoOptions && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Espresso
            </p>
            {renderOptions(espressoOptions, espresso, setEspresso)}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
          <span className="text-sm font-semibold text-stone-600">Total</span>
          <span className="text-base font-extrabold text-orange-600">
            {formatRupiah(totalPrice)}
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
