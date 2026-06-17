import React from "react";

export const Error404 = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-6 text-stone-900">
      <div className="max-w-sm text-center">
        <p className="mb-3 text-6xl font-extrabold text-orange-600">404</p>
        <h1 className="mb-2 text-xl font-semibold">Halaman tidak ditemukan</h1>
        <p className="mb-8 text-sm text-stone-400">
          Menu yang kamu cari mungkin sudah pindah atau belum tersedia.
        </p>
        <a
          href="/"
          className="inline-block bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-orange-700 transition-colors"
        >
          Kembali ke Halaman Utama
        </a>
      </div>
    </div>
  );
};
