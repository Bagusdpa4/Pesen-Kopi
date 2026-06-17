import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categories from "../../components/assets/assets-data/categories.json";
import { formatRupiah } from "../../helper/FormatRupiah";

const WHATSAPP_NUMBER = "6282229749462";

export const OrderBrand = () => {
  const { categoryId, brandId } = useParams();
  const navigate = useNavigate();

  const category = categories.find((c) => c.id === categoryId);
  const brand = category?.brands.find((b) => b.id === brandId);

  const [customerName, setCustomerName] = useState("");
  const [outletAddress, setOutletAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});

  if (!category || !brand) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-6 text-center text-stone-900">
        <p className="text-lg font-semibold">Brand tidak ditemukan</p>
        <button
          type="button"
          onClick={() => navigate("/kategori")}
          className="mt-4 text-sm font-semibold text-orange-600"
        >
          ← Kembali ke kategori
        </button>
      </div>
    );
  }

  const filteredProducts = brand.products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([productId, qty]) => {
          const product = brand.products.find((p) => p.id === productId);
          return product ? { ...product, qty } : null;
        })
        .filter(Boolean),
    [cart, brand.products],
  );

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQty = (productId, delta) => {
    setCart((prev) => {
      const nextQty = (prev[productId] || 0) + delta;
      if (nextQty <= 0) {
        const { [productId]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: nextQty };
    });
  };

  const isFormValid =
    customerName.trim() && outletAddress.trim() && cartItems.length > 0;

  const handleOrder = () => {
    if (!isFormValid) return;

    const lines = [
      `Halo, saya ingin memesan ${brand.name}:`,
      "",
      ...cartItems.map(
        (item) =>
          `- ${item.name} x${item.qty} (${formatRupiah(item.price * item.qty)})`,
      ),
      "",
      `Total: ${formatRupiah(total)}`,
      "",
      `Nama: ${customerName}`,
      `Alamat outlet: ${outletAddress}`,
      pickupTime ? `Jam pengambilan: ${pickupTime}` : null,
      note ? `Catatan: ${note}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-32 text-stone-900">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate(`/${categoryId}`)}
          className="mb-8 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          ← Ganti Brand
        </button>

        <h1 className="mb-6 text-xl font-bold text-stone-900">{brand.name}</h1>

        <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-orange-600">
              Nama Customer (wajib) *
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
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-orange-600">
              Alamat Outlet (wajib) *
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
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-orange-600">
              Jam Pengambilan
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-orange-600">
              Catatan (tidak wajib)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: less sugar less ice"
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
            const qty = cart[product.id] || 0;
            return (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {product.name}
                  </p>
                  <p className="text-sm text-stone-400">
                    {formatRupiah(product.price)}
                  </p>
                </div>

                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => updateQty(product.id, 1)}
                    className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                  >
                    Tambah
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQty(product.id, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-300"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-semibold">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(product.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-300"
                    >
                      +
                    </button>
                  </div>
                )}
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
            className="rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
