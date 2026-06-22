import React, { useState } from "react";

export const ScrollPicker = ({
  value,
  options,
  onChange,
  placeholder,
  defaultValue,
}) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(defaultValue || options[0]);
  const selectedRef = React.useRef(null);

  React.useEffect(() => {
    if (open && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [open]);

  const handleSelect = (opt) => {
    setHighlighted(opt);
    onChange(opt);
    setOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div className="relative w-1/2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-orange-300 focus:bg-white"
      >
        <span className={value ? "text-stone-900" : "text-stone-400"}>
          {displayValue}
        </span>
        <span
          className={`text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
            <div className="bg-linear-to-b pointer-events-none absolute inset-x-0 top-0 z-10 h-6 from-white to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-8 -translate-y-1/2 border-y border-orange-200 bg-orange-50/60" />
            <div className="bg-linear-to-t pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 from-white to-transparent" />
            <div
              className="h-50 overflow-y-auto py-4"
              style={{ scrollbarWidth: "none" }}
            >
              {options.map((opt) => {
                const isActive = value ? opt === value : opt === highlighted;
                return (
                  <div
                    key={opt}
                    ref={isActive ? selectedRef : null}
                    onClick={() => handleSelect(opt)}
                    className={`cursor-pointer py-1.5 text-center text-sm transition-colors ${
                      isActive
                        ? "font-bold text-orange-600"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
export const getNowHour = () => String(new Date().getHours()).padStart(2, "0");
export const getNowMinute = () =>
  String(new Date().getMinutes()).padStart(2, "0");
