import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { getBrand, getModeKeys } from "../../helper/BrandUtils";
import { formatRupiah } from "../../helper/FormatRupiah";

export const Bundling = () => {
  const { categoryId, brandId } = useParams();
  const navigate = useNavigate();

  const { brand } = getBrand(categoryId, brandId);
  const bundles = brand?.modes?.bundling || [];
  const modeKeys = getModeKeys(brand);
  const hasMultipleModes = modeKeys.length > 1;

  if (!brand || !bundles.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-6 text-center">
        <p className="text-lg font-semibold text-stone-900">
          Paket bundling tidak ditemukan
        </p>
        <button
          type="button"
          onClick={() => navigate(`/${categoryId}`)}
          className="mt-4 text-sm font-semibold text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 text-stone-900">
      {/* Background pattern */}

      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() =>
            navigate(
              hasMultipleModes ? `/${categoryId}/${brandId}` : `/${categoryId}`,
            )
          }
          className="mb-8 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          {hasMultipleModes ? "Pilih Paket Lain" : "Pilih Brand Lain"}
        </button>

        <h1 className="mb-8 text-center text-lg font-extrabold uppercase tracking-widest text-orange-600">
          Paket Bundling {brand.name}
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {bundles.map((bundle) => (
            <button
              key={bundle.id}
              type="button"
              onClick={() =>
                navigate(`/${categoryId}/${brandId}/bundling/${bundle.id}`)
              }
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone-300 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100"
            >
              {bundle.image ? (
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-orange-50 text-4xl">
                  🎁
                </div>
              )}
              <div className="px-4 py-3">
                <p className="text-sm font-semibold leading-snug text-stone-900">
                  {bundle.name}
                </p>
                <p className="mt-1 text-sm font-extrabold text-orange-600">
                  {formatRupiah(bundle.price)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
