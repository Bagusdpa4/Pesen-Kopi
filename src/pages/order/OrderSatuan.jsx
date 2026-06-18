import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatRupiah } from "../../helper/FormatRupiah";
import { getBrand, getModeKeys } from "../../helper/BrandUtils";
import { HiArrowLeft } from "react-icons/hi2";

const WHATSAPP_NUMBER = "6282229749462";

export const OrderSatuan = () => {
  const { categoryId, brandId } = useParams();
  const navigate = useNavigate();

  const { brand } = getBrand(categoryId, brandId); // ✅ cari brand yang benar
  const products = brand?.modes?.satuan || []; // ✅ ambil dari modes.satuan

  const modeKeys = getModeKeys(brand);
  const hasMultipleModes = modeKeys.length > 1;

  const [customerName, setCustomerName] = useState("");
  const [outletAddress, setOutletAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});

  if (!brand || !products) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-6 text-center text-stone-900">
        <p className="text-lg font-semibold">Menu satuan tidak ditemukan</p>
        <button
          type="button"
          onClick={() => navigate("/kategori")}
          className="mb-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
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
          const [productId, size] = key.split(":");
          const product = products.find((p) => p.id === productId);
          const sizeInfo = product?.sizes?.[size];
          if (!product || !sizeInfo) return null;
          const unitPrice = sizeInfo.discPrice ?? sizeInfo.price;
          return { key, product, size, unitPrice, qty };
        })
        .filter(Boolean),
    [cart, products],
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0,
  );

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
      pickupTime ? `Jam Pengambilan: ${pickupTime}` : null,
      note ? `Catatan (Tidak Wajib): ${note}` : null,
      ``,
      ...cartItems.map(
        (item, i) =>
          `${i + 1}. ${item.product.name} (${item.size}) x${item.qty} - ${formatRupiah(item.unitPrice * item.qty)}`,
      ),
      ``,
      `Total: ${formatRupiah(total)}`,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-32 text-stone-900">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          type="button"
          onClick={() =>
            navigate(
              hasMultipleModes ? `/${categoryId}/${brandId}` : `/${categoryId}`,
            )
          }
          className="mb-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />{" "}
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
              Catatan (tidak wajib)
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

        <div className="mt-8">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-orange-600">
            Cari Menu
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari..."
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300"
          />
        </div>

        <div className="mt-5 space-y-3">
          {filteredProducts.map((product) => {
            const sizeKeys = Object.keys(product.sizes);
            const thumbnail = product.sizes[sizeKeys[0]]?.image;
            return (
              <div
                key={product.id}
                className="flex gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4"
              >
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={product.name}
                    className="h-24 w-20 shrink-0 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="mb-3 text-sm font-semibold text-stone-900">
                    {product.name}
                  </p>
                  <div className="space-y-2">
                    {sizeKeys.map((size) => {
                      const sizeInfo = product.sizes[size];
                      const key = `${product.id}:${size}`;
                      const qty = cart[key] || 0;
                      const hasDiscount =
                        sizeInfo.discPrice &&
                        sizeInfo.discPrice < sizeInfo.price;
                      return (
                        <div
                          key={size}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-500">
                              {size}
                            </span>
                            <div>
                              {hasDiscount ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-orange-600">
                                    {formatRupiah(sizeInfo.discPrice)}
                                  </span>
                                  <span className="text-xs text-stone-400 line-through">
                                    {formatRupiah(sizeInfo.price)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm font-semibold text-stone-900">
                                  {formatRupiah(sizeInfo.price)}
                                </span>
                              )}
                            </div>
                          </div>
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => updateQty(key, 1)}
                              className="cursor-pointer rounded-full bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-700"
                            >
                              Tambah
                            </button>
                          ) : (
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => updateQty(key, -1)}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-300"
                              >
                                −
                              </button>
                              <span className="w-4 text-center text-sm font-semibold">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(key, 1)}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-300"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <p className="py-6 text-center text-sm text-stone-400">
              Menu tidak ditemukan
            </p>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
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
  );
};
