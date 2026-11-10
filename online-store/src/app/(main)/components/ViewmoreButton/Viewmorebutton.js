"use client";

import { Loader2 } from "lucide-react";

// دکمه‌ی «مشاهده بیشتر» — همون پالت Cyber Blue × Pink خود CoursesCard
export default function ViewMoreButton({ onClick, loading = false, label = "مشاهده بیشتر" }) {
    return (
        <div className="mt-10 flex justify-center">
            <button
                type="button"
                onClick={onClick}
                disabled={loading}
                className="group relative flex min-w-[190px] items-center justify-center gap-2 overflow-hidden rounded-2xl
                           bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#FF2E93] px-8 py-3.5
                           text-sm font-bold text-white shadow-[0_0_28px_-8px_rgba(255,46,147,.7)]
                           transition-all duration-300 hover:shadow-[0_0_40px_-6px_rgba(255,46,147,.85)]
                           active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {/* درخشش عبوری روی هاور */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent
                               transition-transform duration-700 group-hover:translate-x-full"
                />

                {loading ? <Loader2 size={18} className="relative animate-spin" /> : null}
                <span className="relative">{loading ? "در حال بارگذاری..." : label}</span>
            </button>
        </div>
    );
}
