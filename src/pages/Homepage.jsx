import React from "react";
import { useNavigate } from "react-router-dom";

export const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/kategori")}
      className="flex min-h-screen cursor-pointer flex-col items-center justify-center bg-orange-50 px-6 text-center text-stone-900"
    >
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-orange-200 bg-orange-100">
        <span className="text-4xl">☕</span>
      </div>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
        Zona<span className="text-orange-600"> Jastip</span>
      </h1>
      <p className="max-w-xs text-base text-stone-500">
        Pilih produk, masukkan keranjang, konfirmasi pesanan
      </p>
      <p className="mt-8 animate-pulse text-xs font-semibold uppercase tracking-widest text-orange-500">
        Ketuk untuk mulai
      </p>
    </div>
  );
};
