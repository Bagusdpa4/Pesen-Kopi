import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatRupiah } from "../../helper/FormatRupiah";
import { getBrand } from "../../helper/BrandUtils";
import { HiArrowLeft } from "react-icons/hi2";
import {
  ScrollPicker,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  getNowHour,
  getNowMinute,
} from "../../helper/ScrollPicker";

const WHATSAPP_NUMBER = import.meta.env.WHATSAPP_NUMBER;

export const OrderBundling = () => {
  const { categoryId, brandId, bundleId } = useParams();
  const navigate = useNavigate();

  const { brand } = getBrand(categoryId, brandId); // ✅ cari brand yang benar
  const bundles = brand?.modes?.bundling || []; // ✅ ambil dari modes.bundling
  const satuanProducts = brand?.modes?.satuan || [];

  const [selectedBundleId, setSelectedBundleId] = useState(
    bundleId || bundles?.[0]?.id || null,
  );
  const [customerName, setCustomerName] = useState("");
  const [outletAddress, setOutletAddress] = useState("");
  const [pickupHour, setPickupHour] = useState("");
  const [pickupMinute, setPickupMinute] = useState("");
  const [note, setNote] = useState("");
  const [picks, setPicks] = useState({});
  const pickupTime =
    pickupHour && pickupMinute ? `${pickupHour}:${pickupMinute}` : "";
  const [selectedFixedOption, setSelectedFixedOption] = useState(null);

  if (!brand || !bundles?.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-6 text-center text-stone-900">
        <p className="text-lg font-semibold">Paket bundling tidak ditemukan</p>
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

  const bundle = bundles.find((b) => b.id === selectedBundleId);
  const isFixedChoice = bundle?.type === "fixed_choice";

  const groups = useMemo(() => {
    if (!bundle) return [];
    if (bundle.chooseGroups) return bundle.chooseGroups;
    if (bundle.chooseFrom === "satuan") {
      const options = satuanProducts
        .filter((p) => p.sizes?.[bundle.sizeFilter])
        .map((p) => ({ id: p.id, name: `${p.name} (${bundle.sizeFilter})` }));
      return [
        {
          chooseCount: bundle.chooseCount,
          label: bundle.description || "Pilih menu",
          options,
        },
      ];
    }
    return [];
  }, [bundle, satuanProducts]);

  const isDuoPayHighest = bundle?.type === "duo_pay_highest";

  const bundlePrice = useMemo(() => {
    if (isFixedChoice) return selectedFixedOption?.price ?? 0;
    if (!isDuoPayHighest) return bundle?.price ?? 0;
    if (!isDuoPayHighest) return bundle?.price ?? 0;
    // Kumpulkan semua item yang dipilih dari semua group
    const allPicked = [];
    groups.forEach((group, groupIndex) => {
      const ids = picks[groupIndex] || [];
      ids.forEach((id) => {
        const option = group.options.find((o) => o.id === id);
        if (option?.price) allPicked.push(option.price);
      });
    });
    if (allPicked.length === 0) return 0;
    return Math.max(...allPicked);
  }, [
    isFixedChoice,
    selectedFixedOption,
    isDuoPayHighest,
    bundle,
    groups,
    picks,
  ]);

  const togglePick = (groupIndex, optionId, chooseCount) => {
    setPicks((prev) => {
      const current = prev[groupIndex] || [];
      const countOfThis = current.filter((id) => id === optionId).length;
      const totalSelected = current.length;

      if (countOfThis > 0 && totalSelected >= chooseCount) {
        // Sudah penuh & item ini ada → kurangi 1
        const idx = current.lastIndexOf(optionId);
        const next = [...current];
        next.splice(idx, 1);
        return { ...prev, [groupIndex]: next };
      }
      if (totalSelected >= chooseCount) return prev; // Penuh, item berbeda
      // Tambah 1
      return { ...prev, [groupIndex]: [...current, optionId] };
    });
  };

  const handleSelectBundle = (id) => {
    setSelectedBundleId(id);
    setPicks({});
    setSelectedFixedOption(null);
    navigate(`/${categoryId}/${brandId}/bundling/${id}`, { replace: true });
  };

  const isGroupsComplete = isFixedChoice
    ? !!selectedFixedOption
    : groups.every(
        (group, index) => (picks[index]?.length || 0) === group.chooseCount,
      );
  const isFormValid =
    customerName.trim() &&
    outletAddress.trim() &&
    pickupTime &&
    isGroupsComplete;

  const handleOrder = () => {
    if (!isFormValid || !bundle) return;

    const allPickedLines = [];
    if (isFixedChoice) {
      allPickedLines.push(selectedFixedOption.description);
    } else {
      groups.forEach((group, groupIndex) => {
        const ids = picks[groupIndex] || [];
        ids.forEach((id) => {
          const option = group.options.find((o) => o.id === id);
          allPickedLines.push(option?.name || id);
        });
      });
    }

    const lines = [
      `*PESANAN ${brand.name.toUpperCase()} - PROMO ${bundle.name.toUpperCase()}*`,
      ``,
      `Nama Customer : ${customerName}`,
      `Alamat Outlet : ${outletAddress}`,
      `Jam Pengambilan: ${pickupTime}`,
      note ? `Catatan : ${note}` : null,
      ` `, // ← pakai spasi " " bukan ""
      ...allPickedLines.map((name, i) => {
        // Untuk duo_pay_highest, tampilkan harga per item
        if (isDuoPayHighest) {
          const group = groups[0];
          const ids = picks[0] || [];
          const id = ids[i];
          const option = group?.options.find((o) => o.id === id);
          return `Pilih ${i + 1} Menu: ${name}${option?.price ? ` - ${formatRupiah(option.price)}` : ""}`;
        }
        return `Pilih ${i + 1} Menu: ${name}`;
      }),
      ` `,
      isDuoPayHighest ? `*(Bayar harga tertinggi)*` : null,
      `*Total: ${formatRupiah(bundlePrice)}*`,
    ].filter((line) => line !== null);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");

    // ← Reset setelah order
    setPicks({});
    setCustomerName("");
    setOutletAddress("");
    setPickupHour("");
    setPickupMinute("");
    setNote("");
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-32 text-stone-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate(`/${categoryId}/${brandId}/bundling`)}
          className="mb-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-500 shadow-sm transition-colors hover:text-orange-600"
        >
          <HiArrowLeft className="h-4 w-4" />
          Pilih Bundling Lain
        </button>

        <h1 className="mb-1 text-xl font-bold text-stone-900">{brand.name}</h1>
        <p className="mb-6 text-sm font-medium text-orange-600">
          Paket Bundling
        </p>

        {bundles.length > 1 && (
          <div className="mb-6 flex w-full flex-nowrap gap-2 overflow-x-auto pb-1">
            {bundles.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBundle(b.id)}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold transition-colors ${b.id === selectedBundleId ? "bg-orange-600 text-white" : "bg-white text-stone-500 hover:text-orange-600"}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        {bundle && (
          <div className="mb-6 flex items-center justify-center bg-orange-50">
            {/* <p className="text-sm font-bold text-stone-900">{bundle.name}</p>
            {bundle.description && (
              <p className="mt-0.5 text-xs text-stone-500">
                {bundle.description}
              </p>
            )} */}
            <img
              src={bundle.image}
              alt={bundle.name}
              className="max-h-full max-w-full object-contain sm:h-auto sm:w-[80%]"
            />
            {/* <p className="mt-2 text-lg font-extrabold text-orange-600">
              {formatRupiah(bundle.price)}
            </p> */}
          </div>
        )}

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
            <div className="flex gap-2">
              <ScrollPicker
                value={pickupHour}
                options={HOUR_OPTIONS}
                onChange={setPickupHour}
                placeholder="Jam"
                defaultValue={getNowHour()}
              />
              <ScrollPicker
                value={pickupMinute}
                options={MINUTE_OPTIONS}
                onChange={setPickupMinute}
                placeholder="Menit"
                defaultValue={getNowMinute()}
              />
            </div>
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

        <div className="mt-8 space-y-6">
          {/* Fixed choice (misal paket KKM) */}
          {isFixedChoice && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-bold text-stone-900">
                Pilih Salah Satu Paket
              </p>
              <div className="flex flex-col gap-3">
                {bundle.fixedOptions.map((opt) => {
                  const isSelected = selectedFixedOption?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedFixedOption(opt)}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                        isSelected
                          ? "border-orange-400 bg-orange-50"
                          : "border-stone-300 bg-white hover:border-orange-300"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-base font-bold ${isSelected ? "text-orange-600" : "text-stone-900"}`}
                        >
                          {opt.label}
                        </p>
                        <p className="text-sm text-stone-500">
                          {opt.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-extrabold text-orange-600">
                          {formatRupiah(opt.price)}
                        </p>
                        {isSelected && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Groups untuk bundle biasa & duo_pay_highest */}
          {!isFixedChoice && (
            <div className="mt-8 space-y-6">
              {groups.map((group, groupIndex) => {
                const selectedIds = picks[groupIndex] || [];
                return (
                  <div key={groupIndex}>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-stone-900">
                        {group.label}
                      </p>
                      <span className="text-sm font-semibold text-stone-400">
                        {selectedIds.length}/{group.chooseCount} dipilih
                      </span>
                    </div>
                    {isDuoPayHighest && (
                      <p className="mb-3 text-sm font-medium text-orange-500">
                        💡 Pilih 2 menu — kamu hanya bayar harga yang tertinggi
                        saja
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      {group.options.map((option) => {
                        const countOfThis = (picks[groupIndex] || []).filter(
                          (id) => id === option.id,
                        ).length;
                        const isSelected = countOfThis > 0;
                        const isLocked =
                          !isSelected &&
                          selectedIds.length >= group.chooseCount;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            disabled={isLocked}
                            onClick={() =>
                              togglePick(
                                groupIndex,
                                option.id,
                                group.chooseCount,
                              )
                            }
                            className={`relative flex flex-col overflow-hidden rounded-2xl border text-center transition-colors ${
                              isSelected
                                ? "cursor-pointer border-orange-400 bg-orange-50"
                                : isLocked
                                  ? "cursor-not-allowed border-stone-200 bg-stone-50 opacity-50"
                                  : "cursor-pointer border-stone-400 bg-white hover:border-orange-400"
                            }`}
                          >
                            {(() => {
                              const count = (picks[groupIndex] || []).filter(
                                (id) => id === option.id,
                              ).length;
                              if (count === 0) return null;
                              return (
                                <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 text-xs text-white">
                                  {count > 1 ? count : "✓"}
                                </span>
                              );
                            })()}
                            {option.image ? (
                              <div className="flex h-24 items-center justify-center bg-white sm:h-60">
                                <img
                                  src={option.image}
                                  alt={option.name}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex h-24 items-center justify-center bg-orange-50 text-2xl sm:h-60">
                                🍽️
                              </div>
                            )}
                            <span className="px-2 pb-3 pt-1 text-xs font-medium leading-snug text-stone-900">
                              {option.name}
                              {isDuoPayHighest && option.price && (
                                <span className="mt-0.5 block text-xs font-bold text-orange-600">
                                  {formatRupiah(option.price)}
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
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
              {isFixedChoice
                ? selectedFixedOption
                  ? formatRupiah(selectedFixedOption.price)
                  : "-"
                : bundlePrice > 0
                  ? formatRupiah(bundlePrice)
                  : bundle
                    ? formatRupiah(bundle.price ?? 0)
                    : "-"}
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
