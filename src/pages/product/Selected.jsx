import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiSparkles } from "react-icons/hi2";
import { getBrand, getModeKeys } from "../../helper/BrandUtils";

export const Selected = () => {
  const { categoryId, brandId } = useParams(); // ✅ baca categoryId dari URL
  const navigate = useNavigate();

  const { category, brand } = getBrand(categoryId, brandId); // ✅ dinamis
  const modeKeys = getModeKeys(brand);

  if (!category || !brand) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-6 text-center text-stone-900">
        <p className="text-lg font-semibold">Brand tidak ditemukan</p>
        <button
          type="button"
          onClick={() => navigate(`/${categoryId}`)}
          className="mt-4 text-sm font-semibold text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          Kembali ke pilih brand
        </button>
      </div>
    );
  }

  const hasSatuan = modeKeys.includes("satuan");
  const hasBundling = modeKeys.includes("bundling");

  if (modeKeys.length === 1) {
    navigate(`/${categoryId}/${brandId}/${modeKeys[0]}`, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-stone-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate(`/${categoryId}`)} // ✅ dinamis
          className="mb-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          Pilih Brand Lain
        </button>

        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-white p-1.5">
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">{brand.name}</h1>
            {brand.tagline && (
              <p className="text-sm text-stone-400">{brand.tagline}</p>
            )}
          </div>
          {hasBundling && (
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-600">
              <HiSparkles className="h-3.5 w-3.5" />
              Promo
            </span>
          )}
        </div>

        <p className="mb-4 text-center text-sm text-stone-400">
          Pilih jenis pembelian
        </p>

        <div className="grid grid-cols-2 gap-4">
          {hasSatuan && (
            <button
              type="button"
              onClick={() => navigate(`/${categoryId}/${brandId}/satuan`)}
              className="cursor-pointer rounded-2xl border border-stone-200 bg-white px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100 sm:px-6 sm:py-10"
            >
              <div className="mb-2 text-2xl">☕</div>
              <span className="text-sm font-bold uppercase tracking-wide text-stone-900">
                Paket Satuan
              </span>
              <p className="mt-1 text-xs text-stone-400">Pesan per item</p>
            </button>
          )}
          {hasBundling && (
            <button
              type="button"
              onClick={() => navigate(`/${categoryId}/${brandId}/bundling`)}
              className="cursor-pointer rounded-2xl border border-stone-200 bg-white px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100 sm:px-6 sm:py-10"
            >
              <div className="mb-2 text-2xl">🎁</div>
              <span className="text-sm font-bold uppercase tracking-wide text-stone-900">
                Paket Bundling
              </span>
              <p className="mt-1 text-xs text-stone-400">Hemat lebih banyak</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
