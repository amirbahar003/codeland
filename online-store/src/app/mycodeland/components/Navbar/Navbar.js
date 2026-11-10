"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, ShoppingCart, Moon } from "lucide-react";

const iconClass = "text-white/70 transition-colors hover:text-[#22D3EE] focus-visible:outline-none focus-visible:text-[#22D3EE]";

export default function Navbar() {
    const [today, setToday] = useState("");

    useEffect(() => {
        setToday(
            new Date().toLocaleDateString("fa-IR", {
                weekday: "long",
                day: "numeric",
                month: "long",
            })
        );
    }, []);

    return (
        <header dir="rtl" className="flex h-[70px] items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 backdrop-blur-md">
            {/* جستجو با لیبل شناور */}
            <div className="relative w-full max-w-[420px]">
                <Search size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />

                <input
                    id="navbar-search"
                    type="search"
                    placeholder=" "
                    className="peer h-[52px] w-full rounded-xl border border-transparent bg-white/5 pb-1 pl-4 pr-11 pt-4
            text-sm text-white outline-none transition-colors focus:border-[#22D3EE]/40
            [&::-webkit-search-cancel-button]:appearance-none"
                />

                <label
                    htmlFor="navbar-search"
                    className="pointer-events-none absolute right-11 top-1/2 -translate-y-1/2 origin-right
            text-sm text-white/40 transition-all duration-200
            peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[#22D3EE]
            peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0
            peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                    دوره‌های من، تیکت‌ها، مالی ...
                </label>
            </div>

            <div className="flex-1" />

            {/* آیکون‌ها */}
            <div className="flex items-center gap-5">
                <button aria-label="تغییر تم" className={`hidden sm:block ${iconClass}`}>
                    <Moon size={24} strokeWidth={1.6} />
                </button>
                <Link href="/cart" aria-label="سبد خرید" className={`hidden sm:block ${iconClass}`}>
                    <ShoppingCart size={24} strokeWidth={1.6} />
                </Link>
                <Link href="/dashboard/notifications" aria-label="اعلان‌ها" className={iconClass}>
                    <Bell size={24} strokeWidth={1.6} />
                </Link>
            </div>

            {/* جداکننده و تاریخ */}
            {today && (
                <>
                    <div className="hidden h-9 w-px bg-white/10 lg:block" />
                    <span className="hidden whitespace-nowrap text-sm text-white/70 lg:block">{today}</span>
                </>
            )}
        </header>
    );
}
