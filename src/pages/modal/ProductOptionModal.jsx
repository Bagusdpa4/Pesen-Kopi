import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { formatRupiah } from "../../helper/FormatRupiah";

const SUGAR_LEVELS = ["No Sugar", "Less Sugar", "Normal Sugar", "Extra Sugar"];
const ICE_LEVELS = ["Hot", "No Ice", "Less Ice", "Normal Ice"];

const ALL_ESPRESSO_OPTIONS = [
  { id: "normal_shot", label: "Normal Shot", extraPrice: 0 },
  { id: "no_coffee", label: "No Coffee", extraPrice: 0 },
  { id: "plus_1_shot", label: "+1 Shot", extraPrice: 7000 },
  { id: "plus_2_shot", label: "+2 Shot", extraPrice: 14000 },
];

const ALL_DAIRY_OPTIONS = [
  { id: "milk", label: "Milk", extraPrice: 0 },
  { id: "soy_multigrain", label: "Soy Multigrain", extraPrice: 7000 },
  { id: "oat_milk", label: "Oat Milk", extraPrice: 15000 },
  { id: "almond_milk", label: "Almond Milk", extraPrice: 15000 },
];

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
  const [sugar, setSugar] = useState(product.noSugar ? "-" : "Normal Sugar");
  const [ice, setIce] = useState(product.noIce ? "-" : "Normal Ice");
  const [espresso, setEspresso] = useState(
    product.allowedEspresso?.[0] ?? null,
  );
  const [dairy, setDairy] = useState(product.allowedDairy?.[0] ?? null);

  const baseSizeInfo = product.sizes[sizeKeys[0]];
  const basePrice = baseSizeInfo.discPrice ?? baseSizeInfo.price;
  const selectedSizeInfo = product.sizes[size];
  const selectedPrice = selectedSizeInfo.discPrice ?? selectedSizeInfo.price;

  const availableIceLevels = product.noHot
    ? ICE_LEVELS.filter((l) => l !== "Hot")
    : ICE_LEVELS;

  const availableSugarLevels = SUGAR_LEVELS;

  // Opsi dari JSON — filter dari const global
  const espressoOptions = product.allowedEspresso
    ? ALL_ESPRESSO_OPTIONS.filter((e) => product.allowedEspresso.includes(e.id))
    : null;

  const dairyOptions = product.allowedDairy
    ? ALL_DAIRY_OPTIONS.filter((d) => product.allowedDairy.includes(d.id))
    : null;

  const espressoExtra =
    espressoOptions?.find((e) => e.id === espresso)?.extraPrice || 0;
  const dairyExtra = dairyOptions?.find((d) => d.id === dairy)?.extraPrice || 0;

  const grandTotal = selectedPrice + espressoExtra + dairyExtra;

  const handleAdd = () => {
    onAdd({
      size,
      sugar,
      ice,
      espresso,
      dairy,
      extraPrice: espressoExtra + dairyExtra,
    });
    onClose();
  };

  const renderOptions = (options, selected, onSelect, cols = 2) => (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map((opt) => {
        const isSelected = selected === (opt.id ?? opt);
        const label = opt.label ?? opt;
        const extra = opt.extraPrice;
        return (
          <button
            key={opt.id ?? opt}
            type="button"
            onClick={() => onSelect(opt.id ?? opt)}
            className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors ${
              isSelected
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : "border-stone-200 bg-white text-stone-700 hover:border-orange-200"
            }`}
          >
            {label}
            {extra > 0 && (
              <span className="ml-1 text-xs font-normal text-stone-400">
                (+{formatRupiah(extra)})
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

        {/* Ukuran */}
        {sizeKeys.length > 1 && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Ukuran
            </p>
            {renderOptions(
              sizeKeys.map((key) => {
                const info = product.sizes[key];
                const price = info.discPrice ?? info.price;
                const extra = price - basePrice;
                return {
                  id: key,
                  label: key === "R" ? "Reguler" : key === "L" ? "Large" : key,
                  extraPrice: extra,
                };
              }),
              size,
              setSize,
            )}
          </div>
        )}

        {!product.noSugar && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Level Sugar
            </p>
            {renderOptions(
              availableSugarLevels.map((s) => ({
                id: s,
                label: s,
                extraPrice: 0,
              })),
              sugar,
              setSugar,
            )}
          </div>
        )}

        {!product.noIce && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Level Ice
            </p>
            {renderOptions(
              availableIceLevels.map((i) => ({
                id: i,
                label: i,
                extraPrice: 0,
              })),
              ice,
              setIce,
            )}
          </div>
        )}

        {/* Espresso — hanya tampil kalau ada di JSON */}
        {espressoOptions && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Espresso
            </p>
            {renderOptions(espressoOptions, espresso, setEspresso)}
          </div>
        )}

        {/* Dairy — hanya tampil kalau ada di JSON */}
        {dairyOptions && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
              Dairy
            </p>
            {renderOptions(dairyOptions, dairy, setDairy)}
          </div>
        )}

        {/* Total */}
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
