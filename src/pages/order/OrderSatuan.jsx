import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatRupiah } from "../../helper/FormatRupiah";
import { getBrand, getModeKeys } from "../../helper/BrandUtils";
import { HiArrowLeft, HiShoppingCart } from "react-icons/hi2";
import { ProductOptionModal } from "../modal/ProductOptionModal";
import { CartSummaryModal } from "../modal/CartSummaryModal";

const WHATSAPP_NUMBER = "6282229749462";

// Label tampilan untuk tiap kategori minuman
const DRINK_CATEGORY_LABELS = {
  coffee_series: "Coffee Series",
  non_coffee_series: "Non Coffee Series",
  frappe_series: "Frappe Series",
  oatside_series: "Oatside Series",
  berry_series: "Berry Series",
};

// Deteksi apakah data satuan pakai struktur baru (minuman + makanan) atau lama (flat array)
const isNewStructure = (satuan) =>
  satuan && !Array.isArray(satuan) && (satuan.minuman || satuan.makanan);

export const OrderSatuan = () => {
  const { categoryId, brandId } = useParams();
  const navigate = useNavigate();

  const { brand } = getBrand(categoryId, brandId);
  const rawSatuan = brand?.modes?.satuan;

  const modeKeys = getModeKeys(brand);
  const hasMultipleModes = modeKeys.length > 1;

  const useNew = isNewStructure(rawSatuan);

  // Untuk struktur baru: minuman per kategori + makanan
  const drinkCategories = useNew ? Object.keys(rawSatuan.minuman || {}) : [];
  const makananProducts = useNew ? rawSatuan.makanan || [] : [];

  // Untuk struktur lama: flat array
  const flatProducts = useNew ? [] : rawSatuan || [];

  const [customerName, setCustomerName] = useState("");
  const [outletAddress, setOutletAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [activeProduct, setActiveProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);

  if (!brand) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-6 text-center text-stone-900">
        <p className="text-lg font-semibold">Menu satuan tidak ditemukan</p>
        <button
          type="button"
          onClick={() => navigate("/kategori")}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          Kembali
        </button>
      </div>
    );
  }

  // Filter produk berdasarkan search
  const filterBySearch = (list) =>
    list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  // ─── Cart helpers ──────────────────────────────────────────────────
  // Minuman: key = "productId:size:sugar:ice"
  const handleAddDrinkToCart = (product, { size, sugar, ice }) => {
    const key = `drink:${product.id}:${size}:${sugar}:${ice}`;
    setCart((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  // Makanan: key = "food:productId" (tidak ada opsi size/sugar/ice)
  const handleAddMakanan = (item) => {
    const key = `food:${item.id}`;
    setCart((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const updateQty = (key, delta) => {
    setCart((prev) => {
      const nextQty = (prev[key] || 0) + delta;
      if (nextQty <= 0) {
        const { [key]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: nextQty };
    });
  };

  const removeItem = (key) => {
    setCart((prev) => {
      const { [key]: _omit, ...rest } = prev;
      return rest;
    });
  };

  // ─── Build cart items untuk display & WhatsApp ─────────────────────
  // Kumpulkan semua produk minuman (flat) untuk lookup
  const allDrinkProducts = useNew
    ? Object.values(rawSatuan.minuman || {}).flat()
    : flatProducts;

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([key, qty]) => {
          if (key.startsWith("food:")) {
            const productId = key.slice(5);
            const product = makananProducts.find((p) => p.id === productId);
            if (!product) return null;
            const unitPrice = product.discPrice ?? product.price;
            return { key, product, type: "food", unitPrice, qty };
          } else {
            // drink:productId:size:sugar:ice
            const parts = key.split(":");
            const productId = parts[1];
            const size = parts[2];
            const sugar = parts[3];
            const ice = parts[4];
            const product = allDrinkProducts.find((p) => p.id === productId);
            const sizeInfo = product?.sizes?.[size];
            if (!product || !sizeInfo) return null;
            const unitPrice = sizeInfo.discPrice ?? sizeInfo.price;
            return {
              key,
              product,
              type: "drink",
              size,
              sugar,
              ice,
              unitPrice,
              qty,
            };
          }
        })
        .filter(Boolean),
    [cart, allDrinkProducts, makananProducts],
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0,
  );

  const isFormValid =
    customerName.trim() &&
    outletAddress.trim() &&
    pickupTime &&
    cartItems.length > 0;

  const handleOrder = () => {
    if (!isFormValid) return;
    const lines = [
      `PESANAN ${brand.name.toUpperCase()} - PAKET SATUAN`,
      ``,
      `Nama Customer: ${customerName}`,
      `Alamat Outlet: ${outletAddress}`,
      `Jam Pengambilan: ${pickupTime}`,
      note ? `Catatan: ${note}` : null,
      ``,
      ...cartItems.map((item, i) => {
        if (item.type === "food") {
          return `${i + 1}. [Makanan] ${item.product.name} x${item.qty} - ${formatRupiah(item.unitPrice * item.qty)}`;
        }
        const sizeLabel =
          item.size === "R"
            ? "Regular"
            : item.size === "L"
              ? "Large"
              : item.size;
        return `${i + 1}. ${item.product.name} (${sizeLabel}, ${item.sugar}, ${item.ice}) x${item.qty} - ${formatRupiah(item.unitPrice * item.qty)}`;
      }),
      ``,
      `Total: ${formatRupiah(total)}`,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  // ─── Render helpers ────────────────────────────────────────────────
  const renderDrinkCard = (product) => {
    const sizeKeys = Object.keys(product.sizes);
    const firstSize = sizeKeys[0];
    const sizeInfo = product.sizes[firstSize];
    const hasDiscount =
      sizeInfo.discPrice && sizeInfo.discPrice < sizeInfo.price;

    return (
      <div
        key={product.id}
        className="flex flex-col overflow-hidden rounded-2xl border border-stone-400 bg-white"
      >
        <div className="flex h-24 items-center justify-center bg-white sm:h-48">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-1 flex-col px-2 pb-2 pt-1.5 text-center sm:px-3 sm:pb-3 sm:pt-2">
          <p className="mb-1 line-clamp-3 flex min-h-[3.3em] items-center justify-center text-xs font-semibold leading-tight text-stone-900 sm:min-h-[3.75em] sm:text-sm">
            {product.name}
          </p>
          <div className="mb-2 flex min-h-[2.4em] flex-col items-center justify-center sm:mb-3 sm:min-h-[1.5em] sm:flex-row sm:gap-1">
            {hasDiscount && (
              <span className="text-[10px] text-stone-400 line-through sm:text-xs">
                {formatRupiah(sizeInfo.price)}
              </span>
            )}
            <span className="text-xs font-bold text-orange-600 sm:text-sm">
              {formatRupiah(sizeInfo.discPrice ?? sizeInfo.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveProduct(product)}
            className="mt-auto cursor-pointer rounded-full bg-orange-600 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-700 sm:py-2 sm:text-xs"
          >
            + Pilih
          </button>
        </div>
      </div>
    );
  };

  const renderMakananCard = (item) => {
    const qtyInCart = cart[`food:${item.id}`] || 0;
    const hasDiscount = item.discPrice && item.discPrice < item.price;

    return (
      <div
        key={item.id}
        className="flex flex-col overflow-hidden rounded-2xl border border-stone-400 bg-white"
      >
        <div className="flex h-24 items-center justify-center bg-white sm:h-48">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-3xl">🍞</span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-2 pb-2 pt-1.5 text-center sm:px-3 sm:pb-3 sm:pt-2">
          <p className="mb-1 line-clamp-3 flex min-h-[3.3em] items-center justify-center text-xs font-semibold leading-tight text-stone-900 sm:min-h-[3.75em] sm:text-sm">
            {item.name}
          </p>
          <div className="mb-2 flex min-h-[2.4em] flex-col items-center justify-center sm:mb-3 sm:min-h-[1.5em] sm:flex-row sm:gap-1">
            {hasDiscount && (
              <span className="text-[10px] text-stone-400 line-through sm:text-xs">
                {formatRupiah(item.price)}
              </span>
            )}
            <span className="text-xs font-bold text-orange-600 sm:text-sm">
              {formatRupiah(item.discPrice ?? item.price)}
            </span>
          </div>
          {qtyInCart === 0 ? (
            <button
              type="button"
              onClick={() => handleAddMakanan(item)}
              className="mt-auto cursor-pointer rounded-full bg-orange-600 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-700 sm:py-2 sm:text-xs"
            >
              + Tambah
            </button>
          ) : (
            <div className="mt-auto flex items-center justify-center gap-3 rounded-full border border-orange-200 bg-orange-50 py-1">
              <button
                type="button"
                onClick={() => updateQty(`food:${item.id}`, -1)}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-orange-600 hover:bg-orange-100"
              >
                −
              </button>
              <span className="text-sm font-bold text-orange-700">
                {qtyInCart}
              </span>
              <button
                type="button"
                onClick={() => updateQty(`food:${item.id}`, 1)}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-orange-600 hover:bg-orange-100"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-40 text-stone-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() =>
            navigate(
              hasMultipleModes ? `/${categoryId}/${brandId}` : `/${categoryId}`,
            )
          }
          className="mb-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          {hasMultipleModes ? "Pilih Paket Lain" : "Pilih Brand Lain"}
        </button>

        <h1 className="mb-1 text-xl font-bold text-stone-900">{brand.name}</h1>
        <p className="mb-6 text-sm font-medium text-orange-600">Paket Satuan</p>

        {/* Form */}
        <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-700">
              Nama Customer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-700">
              Alamat Outlet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={outletAddress}
              onChange={(e) => setOutletAddress(e.target.value)}
              placeholder="Alamat outlet"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-700">
              Jam Pengambilan <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-700">
              Catatan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Permintaan tambahan"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300 focus:bg-white"
            />
          </div>
        </div>

        {/* Semua kategori tampil ke bawah */}
        <div className="mt-8 space-y-10">
          {useNew ? (
            <>
              {/* Minuman per kategori */}
              {drinkCategories.map((catKey) => {
                const products = filterBySearch(
                  rawSatuan.minuman?.[catKey] || [],
                );
                if (products.length === 0) return null;
                return (
                  <section key={catKey}>
                    <div className="mb-4 flex items-center gap-3">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-orange-600">
                        {DRINK_CATEGORY_LABELS[catKey] ?? catKey}
                      </h2>
                      <div className="h-px flex-1 bg-orange-200" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {products.map(renderDrinkCard)}
                    </div>
                  </section>
                );
              })}

              {/* Makanan */}
              {makananProducts.length > 0 &&
                (() => {
                  const items = filterBySearch(makananProducts);
                  if (items.length === 0) return null;
                  return (
                    <section key="makanan">
                      <div className="mb-4 flex items-center gap-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-orange-600">
                          Makanan
                        </h2>
                        <div className="h-px flex-1 bg-orange-200" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {items.map(renderMakananCard)}
                      </div>
                    </section>
                  );
                })()}
            </>
          ) : (
            /* Struktur lama: flat array tanpa kategori */
            <div className="grid grid-cols-3 gap-4">
              {filterBySearch(flatProducts).map(renderDrinkCard)}
              {filterBySearch(flatProducts).length === 0 && (
                <p className="col-span-full py-6 text-center text-sm text-stone-400">
                  Menu tidak ditemukan
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-orange-600">
              Cari Menu
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari..."
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-orange-300"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-orange-600"
            >
              <HiShoppingCart className="h-5 w-5" />
              Keranjang ({cartItems.reduce((sum, i) => sum + i.qty, 0)})
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Total
                </p>
                <p className="text-lg font-extrabold text-orange-600">
                  {formatRupiah(total)}
                </p>
              </div>
              <button
                type="button"
                disabled={!isFormValid}
                onClick={handleOrder}
                className="cursor-pointer rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal minuman */}
      {activeProduct && (
        <ProductOptionModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAdd={(opts) => {
            handleAddDrinkToCart(activeProduct, opts);
            setActiveProduct(null);
          }}
        />
      )}

      {showCart && (
        <CartSummaryModal
          cartItems={cartItems}
          total={total}
          onClose={() => setShowCart(false)}
          onRemove={removeItem}
          onUpdateQty={updateQty}
        />
      )}
    </div>
  );
};
