import React from "react";
import { useNavigate } from "react-router-dom";

export const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/kategori")}
      className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-6 text-center text-stone-900"
    >
      {/* Icon */}
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-orange-200 bg-orange-100">
        <span className="text-4xl">☕</span>
      </div>

      {/* Brand name */}
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
        Drulz<span className="text-orange-600"> Deals</span>
      </h1>

      {/* Quotes */}
      <div className="mb-6 space-y-1">
        <p className="text-base font-medium text-stone-600">
          Ngopi dulu, biar waras 😂
        </p>
        <p className="text-base font-medium text-stone-600">
          Buy more, save more 💸
        </p>
      </div>

      {/* Step */}
      <p className="max-w-xs text-sm leading-relaxed text-stone-500">
        Pilih menu - masukkan keranjang - konfirmasi pesanan - bayar - sruput
      </p>

      {/* CTA with ping animation */}
      <div className="mt-10 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-orange-400 opacity-75" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
          Ketuk untuk mulai
        </p>
      </div>
    </div>
  );
};
