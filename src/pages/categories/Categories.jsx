import React from "react";
import { useNavigate } from "react-router-dom";
import categories from "../../components/assets/assets-data/categories.json";

export const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50 text-stone-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
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
                <div className="flex -space-x-2">
                  {category.brands.slice(0, 2).map((brand) => (
                    <div
                      key={brand.id}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-stone-100 text-xs font-semibold text-stone-500"
                    >
                      {brand.name.charAt(0)}
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    {category.title}
                  </h2>
                  <p className="text-sm text-stone-400">
                    {category.brands.map((b) => b.name).join(", ")}
                  </p>
                </div>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 text-base text-stone-400">
                ›
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
