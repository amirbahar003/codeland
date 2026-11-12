"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Crown, Receipt, MessageCircleQuestion, ChevronLeft, ChevronRight, Rocket, Menu, X, Settings, LogOut, UserRound } from "lucide-react";
import SettingsModal from "../SettingsModal/SettingsModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STORAGE_KEY = "sidebar-collapsed";

const menu = [
    { label: "خانه", href: "/mycodeland", icon: Home },
    { label: "دوره‌ها", href: "/mycodeland/courses", icon: BookOpen },
    { label: "اشتراک", href: "/mycodeland/subscription", icon: Crown },
    { label: "تراکنش‌ها", href: "/mycodeland/transactions", icon: Receipt },
    { label: "پرسش و پاسخ", href: "/mycodeland/qa", icon: MessageCircleQuestion },
];

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/60";

const toFa = (v) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

export default function Sidebar() {
    const pathname = usePathname();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [unseenCount, setUnseenCount] = useState(0);

    const [user, setUser] = useState({
        name: "",
        phone: "",
        email: "",
        username: "",
        avatar: "",
        plan: "free",
    });

    // مدیریت تعداد تراکنش‌های دیده‌نشده
    useEffect(() => {
        let cancelled = false;

        const handleTransactions = async () => {
            try {
                // اگر وارد صفحه تراکنش‌ها شده‌ایم
                if (pathname === "/mycodeland/transactions") {
                    const response = await fetch(`${API_URL}/Wallet/transactions/mark-as-seen`, {
                        method: "PATCH",
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error("علامت‌گذاری تراکنش‌ها ناموفق بود");
                    }

                    if (!cancelled) {
                        setUnseenCount(0);
                    }

                    return;
                }

                // در سایر صفحات تعداد تراکنش‌های دیده‌نشده را بگیر
                const response = await fetch(`${API_URL}/Wallet/transactions/unseen-count`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("دریافت تعداد تراکنش‌ها ناموفق بود");
                }

                const count = await response.json();

                if (!cancelled) {
                    setUnseenCount(count);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("خطا در مدیریت تراکنش‌ها:", error);
                }
            }
        };

        handleTransactions();

        return () => {
            cancelled = true;
        };
    }, [pathname]);

    // دریافت اطلاعات کاربر
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`${API_URL}/Auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("دریافت اطلاعات کاربر ناموفق بود");
                }

                const data = await response.json();

                setUser((prev) => ({
                    ...prev,
                    name: data.username || "",
                    phone: data.mobile || "",
                    email: data.email || "",
                    username: data.username || "",
                    avatar: data.avatarId ? `${API_URL}/Files/${data.avatarId}` : "",
                }));
            } catch (error) {
                console.error("خطا در دریافت اطلاعات کاربر:", error);
            }
        };

        getUser();
    }, []);

    // دریافت وضعیت سایدبار از localStorage
    useEffect(() => {
        try {
            setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
        } catch {}
    }, []);

    // بستن منوی موبایل هنگام تغییر مسیر
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // بستن منوی موبایل با کلید Escape
    useEffect(() => {
        if (!mobileOpen) return;

        const onKey = (e) => e.key === "Escape" && setMobileOpen(false);

        window.addEventListener("keydown", onKey);

        return () => window.removeEventListener("keydown", onKey);
    }, [mobileOpen]);

    // باز و بسته کردن سایدبار
    const toggle = () => {
        const next = !collapsed;

        setCollapsed(next);

        try {
            localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
        } catch {}
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/Auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("خروج از حساب ناموفق بود");
            }

            window.location.href = "/";
        } catch (error) {
            console.error("خطا در خروج از حساب:", error);
        }
    };

    const isActive = (href) => (href === "/mycodeland" ? pathname === href : pathname.startsWith(href));

    const hideLabel = collapsed ? "lg:hidden" : "";
    const centerWhenCollapsed = collapsed ? "lg:justify-center lg:px-0" : "";

    const Tooltip = ({ children }) =>
        collapsed ? (
            <span
                role="tooltip"
                className="pointer-events-none absolute right-full mr-5 hidden whitespace-nowrap rounded-lg
          border border-white/10 bg-[#0b0f1a] px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg
          transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
            >
                {children}
            </span>
        ) : null;

    return (
        <>
            {/* دکمه همبرگری موبایل */}
            <button
                onClick={() => setMobileOpen(true)}
                aria-label="باز کردن منو"
                className={`fixed right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl
          border border-white/10 bg-white/5 text-white backdrop-blur-xl lg:hidden ${focusRing}`}
            >
                <Menu size={20} />
            </button>

            {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" aria-hidden="true" />}

            <aside
                dir="rtl"
                className={`z-50 flex w-72 flex-col rounded-3xl border border-white/10 bg-[#0b0f1a]/80 p-3
          shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl
          transition-[width,transform] duration-300 ease-in-out motion-reduce:transition-none
          fixed inset-y-2 right-2
          ${mobileOpen ? "translate-x-0" : "translate-x-[110%]"}
          lg:sticky lg:top-0 lg:bottom-auto lg:right-auto lg:my-4 lg:mr-4 lg:h-[calc(100vh-2rem)]
          lg:translate-x-0 lg:bg-white/[0.04]
          ${collapsed ? "lg:w-[76px]" : "lg:w-64"}`}
            >
                {/* فلش باز و بسته دسکتاپ */}
                <button
                    onClick={toggle}
                    aria-label={collapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
                    aria-expanded={!collapsed}
                    className={`absolute -left-3 top-9 z-10 hidden h-7 w-7 items-center justify-center rounded-full
            border border-white/10 bg-[#0b0f1a] text-white/80 transition
            hover:border-[#22D3EE]/50 hover:text-[#22D3EE] lg:flex ${focusRing}`}
                >
                    {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* دکمه بستن موبایل */}
                <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="بستن منو"
                    className={`absolute left-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg
            text-white/70 hover:bg-white/5 hover:text-white lg:hidden ${focusRing}`}
                >
                    <X size={18} />
                </button>

                {/* کارت اطلاعات کاربر */}
                <div
                    className={`mb-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-2.5 pl-12
            lg:pl-2.5 ${collapsed ? "lg:justify-center lg:p-1.5" : ""}`}
                >
                    {user.avatar ? (
                        <img src={user.avatar} alt="تصویر پروفایل کاربر" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#22D3EE]/40" />
                    ) : (
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
        border border-white/10 bg-white/5 text-white/30"
                            aria-label="بدون تصویر پروفایل"
                        >
                            <UserRound size={22} />
                        </div>
                    )}

                    <div className={`min-w-0 ${hideLabel}`}>
                        <p className="truncate text-sm font-bold text-white">{user.name}</p>

                        <p dir="ltr" className="truncate text-right text-xs text-white/60">
                            {toFa(user.phone)}
                        </p>
                    </div>
                </div>

                <p className={`mb-2 px-2 text-xs text-white/50 ${hideLabel}`}>منو</p>

                {collapsed && <div className="mb-2 hidden h-px bg-white/10 lg:block" />}

                {/* آیتم‌های منو */}
                <nav aria-label="منوی اصلی" className="flex flex-1 flex-col gap-1">
                    {menu.map(({ label, href, icon: Icon }) => {
                        const active = isActive(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors
                  ${centerWhenCollapsed} ${focusRing}
                  ${active ? "bg-gradient-to-l from-[#22D3EE]/20 to-transparent text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                            >
                                {active && <span className="absolute -right-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-[#FF2E93] shadow-[0_0_12px_#FF2E93]" />}

                                <Icon size={20} className={`shrink-0 ${active ? "text-[#22D3EE]" : ""}`} />

                                <span className={`min-w-0 flex-1 truncate text-sm ${hideLabel}`}>{label}</span>

                                {/* تعداد تراکنش‌های دیده‌نشده */}
                                {href === "/mycodeland/transactions" && unseenCount > 0 && (
                                    <span className={`rounded-full bg-[#FF2E93] px-2 py-0.5 text-[10px] font-bold text-white ${hideLabel}`}>{toFa(unseenCount)}</span>
                                )}

                                {/* نقطه در حالت جمع‌شده */}
                                {href === "/mycodeland/transactions" && unseenCount > 0 && collapsed && <span className="absolute left-2.5 top-2 hidden h-2 w-2 rounded-full bg-[#FF2E93] lg:block" />}

                                <Tooltip>{label}</Tooltip>
                            </Link>
                        );
                    })}
                </nav>

                {/* ارتقا */}
                {user.plan !== "pro" && (
                    <Link
                        href="/mycodeland/subscription"
                        className={`mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-l from-[#FF2E93] to-[#8B5CF6]
              px-3 py-3 text-white transition-opacity hover:opacity-90 ${centerWhenCollapsed} ${focusRing}`}
                    >
                        <Rocket size={20} className="shrink-0" />

                        <span className={`truncate text-sm font-bold ${hideLabel}`}>ارتقا به اشتراک ویژه</span>
                    </Link>
                )}

                {/* تنظیمات و خروج */}
                <div
                    className={`mt-3 flex gap-2 border-t border-white/10 pt-3
            ${collapsed ? "lg:flex-col" : ""}`}
                >
                    <button
                        type="button"
                        onClick={() => setSettingsOpen(true)}
                        aria-label="تنظیمات"
                        className={`group relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5
        text-white/70 transition-colors hover:bg-white/5 hover:text-[#22D3EE] ${focusRing}`}
                    >
                        <Settings size={20} className="shrink-0" />

                        <span className={`text-sm ${hideLabel}`}>تنظیمات</span>

                        <Tooltip>تنظیمات</Tooltip>
                    </button>

                    <button
                        onClick={handleLogout}
                        aria-label="خروج از حساب"
                        className={`group relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5
              text-white/70 transition-colors hover:bg-[#FF2E93]/10 hover:text-[#FF2E93] ${focusRing}`}
                    >
                        <LogOut size={20} className="shrink-0" />

                        <span className={`text-sm ${hideLabel}`}>خروج</span>

                        <Tooltip>خروج</Tooltip>
                    </button>
                </div>
            </aside>

            <SettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                user={{
                    name: user.name,
                    username: user.username,
                    email: user.email,
                }}
            />
        </>
    );
}
