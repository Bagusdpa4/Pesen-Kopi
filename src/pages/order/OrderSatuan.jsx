import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatRupiah } from "../../helper/FormatRupiah";
import { getBrand, getModeKeys } from "../../helper/BrandUtils";
import { HiArrowLeft, HiShoppingCart } from "react-icons/hi2";
import { ProductOptionModal } from "../modal/ProductOptionModal";
import { CartSummaryModal } from "../modal/CartSummaryModal";

const WHATSAPP_NUMBER = "6282229749462";

export const OrderSatuan = () => {
  const { categoryId, brandId } = useParams();
  const navigate = useNavigate();

  const { brand } = getBrand(categoryId, brandId);
  const products = brand?.modes?.satuan || [];

  const modeKeys = getModeKeys(brand);
  const hasMultipleModes = modeKeys.length > 1;

  const [customerName, setCustomerName] = useState("");
  const [outletAddress, setOutletAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({}); // key: productId:size:sugar:ice -> qty
  const [activeProduct, setActiveProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);

  if (!brand || !products) {
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([key, qty]) => {
          const [productId, size, sugar, ice] = key.split(":");
          const product = products.find((p) => p.id === productId);
          const sizeInfo = product?.sizes?.[size];
          if (!product || !sizeInfo) return null;
          const unitPrice = sizeInfo.discPrice ?? sizeInfo.price;
          return { key, product, size, sugar, ice, unitPrice, qty };
        })
        .filter(Boolean),
    [cart, products],
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0,
  );

  const handleAddToCart = (product, { size, sugar, ice }) => {
    const key = `${product.id}:${size}:${sugar}:${ice}`;
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
      `Nama Customer (Wajib): ${customerName}`,
      `Alamat Outlet (Wajib): ${outletAddress}`,
      `Jam Pengambilan: ${pickupTime}`,
      note ? `Catatan (Tidak Wajib): ${note}` : null,
      ``,
      ...cartItems.map((item, i) => {
        const sizeLabel =
          item.size === "R"
            ? "Reguler"
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

        <div className="mt-8 grid grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const sizeKeys = Object.keys(product.sizes);
            const sizeInfo = product.sizes[sizeKeys[0]];
            const hasDiscount =
              sizeInfo.discPrice && sizeInfo.discPrice < sizeInfo.price;

            return (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-stone-400 bg-white"
              >
                <div className="flex h-24 items-center justify-center bg-white sm:h-60">
                  <img
                    src={sizeInfo.image}
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
          })}
          {filteredProducts.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-stone-400">
              Menu tidak ditemukan
            </p>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
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

      {activeProduct && (
        <ProductOptionModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAdd={(opts) => handleAddToCart(activeProduct, opts)}
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
