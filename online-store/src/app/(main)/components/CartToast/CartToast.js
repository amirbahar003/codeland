"use client";

export default function CartToast({ show, onClose, message, type = "success" }) {
    if (!show) return null;

    const isSuccess = type === "success";

    return (
        <div
            dir="rtl"
            role="status"
            className="fixed right-6 top-6 z-[9999] flex w-[380px] max-w-[calc(100vw-3rem)] items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isSuccess ? "bg-[#E8F8EF]" : "bg-red-50"}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-white ${isSuccess ? "bg-[#22B55B]" : "bg-red-500"}`}>{isSuccess ? "✓" : "!"}</div>
            </div>

            <div className="flex-1 text-right">
                <p className="text-base font-extrabold text-[#111827]">{isSuccess ? "موفق" : "خطا"}</p>

                <p className="mt-1 text-sm text-[#4B5563]">{message}</p>
            </div>

            <button type="button" onClick={onClose} aria-label="بستن پیام" className="self-start text-xl leading-none text-[#9CA3AF] transition hover:text-[#374151]">
                ×
            </button>
        </div>
    );
}
