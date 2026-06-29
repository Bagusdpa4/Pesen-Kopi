import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { formatRupiah } from "../../helper/FormatRupiah";

const SUGAR_LEVELS = ["No Sugar", "Less Sugar", "Normal Sugar", "Extra Sugar"];
const ICE_LEVELS = ["Hot", "No Ice", "Less Ice", "Normal Ice"];

export const ProductOptionModal = ({ product, onClose, onAdd }) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const sizeKeys = Object.keys(product.sizes);
  const [size, setSize] = useState(sizeKeys[0]);

  const baseSizeInfo = product.sizes[sizeKeys[0]];
  const basePrice = baseSizeInfo.discPrice ?? baseSizeInfo.price;

  const selectedSizeInfo = product.sizes[size];
  const selectedPrice = selectedSizeInfo.discPrice ?? selectedSizeInfo.price;
  const diff = selectedPrice - basePrice;

  const availableIceLevels = product.noHot
    ? ICE_LEVELS.filter((level) => level !== "Hot")
    : ICE_LEVELS;

  const [sugar, setSugar] = useState(product.noSugar ? "-" : "Normal Sugar");
  const [ice, setIce] = useState(
    product.noIce
      ? "-"
      : availableIceLevels.includes("Normal Ice")
        ? "Normal Ice"
        : availableIceLevels[0],
  );

  const handleAdd = () => {
    onAdd({ size, sugar, ice });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
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

        {sizeKeys.length > 1 && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Ukuran
            </p>
            <div className="grid grid-cols-2 gap-2">
              {sizeKeys.map((key) => {
                const sizeInfo = product.sizes[key];
                const price = sizeInfo.discPrice ?? sizeInfo.price;
                const extra = price - basePrice;
                const isSelected = size === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSize(key)}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-stone-200 bg-white text-stone-700 hover:border-orange-200"
                    }`}
                  >
                    {key === "R" ? "Reguler" : key === "L" ? "Large" : key}
                    {extra > 0 && (
                      <span className="ml-1 text-xs font-normal text-stone-400">
                        (+{formatRupiah(extra)})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sembunyikan jika noSugar */}
        {!product.noSugar && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Level Sugar
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SUGAR_LEVELS.map((level) => {
                const isSelected = sugar === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSugar(level)}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-stone-200 bg-white text-stone-700 hover:border-orange-200"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sembunyikan jika noIce */}
        {!product.noIce && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Level Ice
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableIceLevels.map((level) => {
                const isSelected = ice === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setIce(level)}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-stone-200 bg-white text-stone-700 hover:border-orange-200"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
