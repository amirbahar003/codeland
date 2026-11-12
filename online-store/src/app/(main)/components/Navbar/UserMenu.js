"use client";

import { UserRound, Home, FolderOpen, ShoppingBag, MessageCircleQuestion, LogOut } from "lucide-react";
import Link from "next/link";

export default function UserMenu({ user }) {
    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="group relative">
            {/* User Icon */}
            <button
                type="button"
                className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    text-slate-300
                    transition-all duration-300
                    hover:bg-fuchsia-500/10
                    hover:text-fuchsia-300
                "
            >
                <UserRound className="h-6 w-6" strokeWidth={1.7} />
            </button>

            {/* Online Dot */}
            <span
                className="
                    absolute
                    right-1
                    top-1
                    h-2.5 w-2.5
                    rounded-full
                    border-2
                    border-[#080B1D]
                    bg-cyan-400
                    shadow-[0_0_10px_rgba(34,211,238,0.8)]
                "
            />

            {/* Dropdown */}
            <div
                className="
                    invisible
                    absolute
                    left-1/2
                    top-full
                    z-50
                    mt-3
                    w-[310px]
                    -translate-x-1/2
                    translate-y-2
                    rounded-2xl
                    border border-white/[0.08]
                    bg-[#0B1020]/95
                    p-3
                    opacity-0
                    shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                    backdrop-blur-2xl
                    transition-all duration-300

                    group-hover:visible
                    group-hover:translate-y-0
                    group-hover:opacity-100
                "
            >
                {/* User Info */}
                <div
                    className="
                        flex items-center gap-3
                        border-b border-white/[0.08]
                        px-3 pb-4
                    "
                >
                    {/* Avatar */}
                    <div
                        className="
                            flex h-14 w-14
                            shrink-0
                            items-center justify-center
                            overflow-hidden
                            rounded-full
                            border border-fuchsia-400/20
                            bg-gradient-to-br
                            from-fuchsia-500/15
                            to-blue-500/15
                        "
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.userName || "کاربر"} className="h-full w-full object-cover" />
                        ) : (
                            <UserRound className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
                        )}
                    </div>

                    {/* User Details */}
                    <div className="min-w-0">
                        {/* Username */}
                        <p className="truncate text-sm font-bold text-white">{user?.userName || "کاربر"}</p>

                        {/* Mobile */}
                        <p
                            dir="ltr"
                            className="
                                mt-1
                                text-right
                                text-xs
                                text-slate-500
                            "
                        >
                            {user?.phone || ""}
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                    {/* Dashboard */}
                    <Link
                        href="/mycodeland"
                        className="
                            flex items-center gap-3
                            rounded-xl
                            px-3 py-3
                            text-sm
                            text-slate-300
                            transition-all duration-200
                            hover:bg-fuchsia-500/[0.07]
                            hover:text-fuchsia-300
                        "
                    >
                        <Home className="h-5 w-5" strokeWidth={1.6} />

                        <span>پیشخوان</span>
                    </Link>

                    {/* My Courses */}
                    <Link
                        href="/mycodeland/courses"
                        className="
                            flex items-center gap-3
                            rounded-xl
                            px-3 py-3
                            text-sm
                            text-slate-300
                            transition-all duration-200
                            hover:bg-blue-500/[0.07]
                            hover:text-blue-300
                        "
                    >
                        <FolderOpen className="h-5 w-5" strokeWidth={1.6} />

                        <span>دوره‌های من</span>
                    </Link>

                    {/* Orders */}
                    <Link
                        href="/mycodeland/transactions"
                        className="
                            flex items-center gap-3
                            rounded-xl
                            px-3 py-3
                            text-sm
                            text-slate-300
                            transition-all duration-200
                            hover:bg-cyan-500/[0.07]
                            hover:text-cyan-300
                        "
                    >
                        <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />

                        <span>اشتراک و تراکنش</span>
                    </Link>

                    {/* Questions */}
                    <Link
                        href="/mycodeland/questions"
                        className="
                            flex items-center gap-3
                            rounded-xl
                            px-3 py-3
                            text-sm
                            text-slate-300
                            transition-all duration-200
                            hover:bg-purple-500/[0.07]
                            hover:text-purple-300
                        "
                    >
                        <MessageCircleQuestion className="h-5 w-5" strokeWidth={1.6} />

                        <span>پرسش و پاسخ‌ها</span>
                    </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-white/[0.08] pt-3">
                    <button
                        type="button"
                        className="
                            flex w-full
                            items-center justify-center
                            gap-2
                            rounded-xl
                            bg-pink-500/[0.08]
                            px-4 py-3
                            text-sm
                            font-medium
                            text-pink-300
                            transition-all duration-300
                            hover:bg-pink-500/[0.14]
                            hover:text-pink-200
                            hover:shadow-[0_0_25px_rgba(236,72,153,0.08)]
                        "
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" strokeWidth={1.7} />
                        خروج از حساب کاربری
                    </button>
                </div>
            </div>
        </div>
    );
}
