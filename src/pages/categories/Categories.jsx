import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiChevronRight } from "react-icons/hi2";
import categories from "../../components/assets/assets-data/categories.json";

export const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50 text-stone-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <header className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight">
            Pilih Kategori
          </h1>
          <p className="text-base text-stone-500">
            Temukan produk dari brand favoritmu
          </p>
        </header>

        <div className="space-y-4">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate(`/${category.id}`)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100"
            >
              <div className="flex items-center gap-4">
                <div className="grid w-20 grid-cols-2 gap-0.5">
                  {category.brands.slice(0, 4).map((brand) => (
                    <div
                      key={brand.id}
                      className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-sm bg-white p-1 sm:h-9 sm:w-9"
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    {category.title}
                  </h2>
                  <p className="line-clamp-1 text-sm text-stone-400">
                    {category.brands.map((b) => b.name).join(", ")}
                  </p>
                </div>
              </div>
              <span className="flex h-6 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-400 sm:w-6">
                <HiChevronRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
