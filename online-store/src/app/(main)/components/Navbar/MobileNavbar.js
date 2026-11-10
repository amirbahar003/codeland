"use client";

import "./navbar.css";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, UserRound, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMegaMenu } from "../context/MegaMenuContext";

export default function MobileNavbar() {
    const { setIsMegaMenuOpen } = useMegaMenu();

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const navItems = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Courses",
            href: "/courses",
        },
        {
            label: "RoadMap",
            href: "/roadmap",
        },
        {
            label: "Instructors",
            href: "/instructors",
        },
        {
            label: "About",
            href: "/about",
        },
    ];

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();

                    setUser({
                        ...data,
                        phone: data.mobile,
                        userName: data.username,
                    });

                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch {
                setUser(null);
                setIsLoggedIn(false);
            }
        };

        checkLogin();
    }, []);

    const closeMenu = () => {
        setIsOpen(false);
        setIsMegaMenuOpen(false);
    };

    const toggleMenu = () => {
        const nextState = !isOpen;

        setIsOpen(nextState);
        setIsMegaMenuOpen(nextState);
    };

    return (
        <header className="fixed top-0 z-50 w-full md:hidden">
            {/* Navbar */}
            <nav className="relative mx-auto mt-3 flex h-16 w-[92%] items-center justify-between rounded-2xl border border-white/[0.08] bg-[#080B1D]/75 px-3 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.35)] xs:px-4">
                {/* Logo */}
                <Link href="/" onClick={closeMenu} className="shrink-0 text-lg font-bold tracking-tight text-slate-100">
                    Code
                    <span className="bg-gradient-to-r from-[#22D3EE] to-[#FF2E93] bg-clip-text text-transparent">Land</span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    {/* Cart */}
                    <button
                        type="button"
                        aria-label="Shopping cart"
                        onClick={() => router.push("/cart")}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-300 hover:bg-[#22D3EE]/10 hover:text-[#22D3EE]"
                    >
                        <ShoppingCart size={18} strokeWidth={1.8} />
                    </button>

                    {/* Menu Button */}
                    <button
                        type="button"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        onClick={toggleMenu}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-slate-300 transition-all duration-300 hover:border-[#22D3EE]/25 hover:bg-[#22D3EE]/10 hover:text-[#22D3EE]"
                    >
                        {isOpen ? <X size={19} strokeWidth={1.8} /> : <Menu size={19} strokeWidth={1.8} />}
                    </button>
                </div>

                {/* Bottom Gradient Line */}
                <div className="pointer-events-none absolute bottom-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[#22D3EE]/25 to-[#FF2E93]/25" />
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mx-auto mt-2 w-[92%] origin-top rounded-2xl border border-white/[0.08] bg-[#080B1D]/90 p-3 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-[mobileMenu_0.3s_ease-out]">
                    <div className="space-y-1">
                        {/* Login / Profile */}
                        {isLoggedIn ? (
                            <button
                                type="button"
                                className="relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-all duration-300 hover:bg-white/[0.05] hover:text-slate-100"
                            >
                                <UserRound size={18} strokeWidth={1.8} />

                                <span>پروفایل</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="mb-2 flex w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-[#22D3EE]/25 hover:bg-white/[0.07] hover:text-[#22D3EE]"
                            >
                                ورود | ثبت‌نام
                            </Link>
                        )}

                        {/* Navigation Items */}
                        {navItems.map((item) => {
                            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`relative block rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                                        active
                                            ? "bg-[#22D3EE]/[0.10] text-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.08)] ring-1 ring-[#22D3EE]/[0.15]"
                                            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                                    }`}
                                >
                                    {/* Active Indicator */}
                                    {active && (
                                        <span className="absolute left-1.5 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-gradient-to-b from-[#22D3EE] to-[#FF2E93] shadow-[0_0_8px_rgba(255,46,147,0.6)]" />
                                    )}

                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
