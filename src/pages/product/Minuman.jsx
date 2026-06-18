import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiChevronRight } from "react-icons/hi2";
import categories from "../../components/assets/assets-data/categories.json";
import { getModeKeys } from "../../helper/BrandUtils";

const category = categories.find((c) => c.id === "minuman");

export const Minuman = () => {
  const navigate = useNavigate();

  const goToBrand = (brand) => {
    const modeKeys = getModeKeys(brand); // ✅ pakai helper, bukan brand.modes.length
    if (modeKeys.length === 1) {
      navigate(`/minuman/${brand.id}/${modeKeys[0]}`);
    } else {
      navigate(`/minuman/${brand.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 text-stone-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/kategori")}
          className="mb-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Pilih <span className="text-orange-600">Brand</span>
          </h1>
          <p className="mt-2 text-base text-stone-500">
            Minuman favorit dengan harga spesial
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {category.brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => goToBrand(brand)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white text-left transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100"
            >
              <div className="h-50 flex items-center justify-center bg-white p-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <span className="text-sm font-semibold text-stone-900">
                    {brand.name}
                  </span>
                  {/* {getModeKeys(brand).includes("bundling") && ( // ✅ bukan brand.modes.includes(...)
                    <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                      Promo
                    </span>
                  )} */}
                </div>
                <span className="text-stone-400 transition-transform group-hover:translate-x-1">
                  <HiChevronRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
