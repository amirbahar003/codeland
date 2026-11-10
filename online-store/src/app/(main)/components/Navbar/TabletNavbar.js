"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, UserRound, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMegaMenu } from "../context/MegaMenuContext";
import UserMenu from "./UserMenu";

export default function TabletNavbar() {
    const { setIsMegaMenuOpen } = useMegaMenu();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Courses", href: "/courses" },
        { label: "RoadMap", href: "/roadmap" },
        { label: "Instructors", href: "/instructors" },
        { label: "About", href: "/about" },
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
    return (
        <div className="hidden md:block lg:hidden">
            <header className="fixed top-0 z-50 w-full">
                <nav
                    className="
                        relative mx-auto mt-4 flex h-18 w-[94%]
                        items-center justify-between
                        rounded-2xl
                        border border-white/[0.08]
                        bg-[#080B1D]/75
                        px-5
                        backdrop-blur-2xl
                        shadow-[0_10px_50px_rgba(0,0,0,0.35)]
                    "
                >
                    {/* Ambient Glow */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute -left-16 -top-20 h-36 w-36 rounded-full bg-violet-600/10 blur-3xl" />

                        <div className="absolute -right-16 -bottom-20 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />
                    </div>

                    {/* Logo */}
                    <Link href="/" className="group relative shrink-0 text-2xl font-bold tracking-tight">
                        <span className="text-slate-100">Code</span>

                        <span
                            className="
                                bg-gradient-to-r
                                from-violet-400
                                via-purple-400
                                to-blue-400
                                bg-clip-text
                                text-transparent
                            "
                        >
                            Land
                        </span>

                        {/* Logo Glow */}
                        <span
                            className="
                                pointer-events-none absolute -inset-2
                                -z-10 rounded-xl
                                bg-gradient-to-r
                                from-violet-600/10
                                to-blue-500/10
                                opacity-0
                                blur-xl
                                transition-opacity duration-500
                                group-hover:opacity-100
                            "
                        />
                    </Link>

                    {/* Right Actions */}
                    <div className="relative flex items-center gap-1.5">
                        {/* Profile */}
                        {isLoggedIn ? (
                            <UserMenu user={user} />
                        ) : (
                            <Link
                                href="/login"
                                className="relative flex items-center justify-center overflow-hidden rounded-xl border border-white/[0.16] bg-white/[0.07] px-5 py-2 text-sm font-medium text-white backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-violet-400/30 hover:bg-white/[0.11] hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)]"
                            >
                                {/* Glass Reflection */}
                                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                                <span className="relative">ورود | ثبت نام</span>
                            </Link>
                        )}
                        {/* Cart */}
                        <button
                            type="button"
                            aria-label="Shopping cart"
                            onClick={() => router.push("/cart")}
                            className="
        relative flex h-10 w-10
        items-center justify-center
        rounded-xl
        border border-transparent
        text-slate-400
        transition-all duration-300
        hover:border-violet-500/20
        hover:bg-violet-500/[0.08]
        hover:text-violet-400
    "
                        >
                            <ShoppingCart size={19} strokeWidth={1.8} />

                            {/* Cart Indicator */}
                            <span
                                className="
                                    absolute right-2 top-1
                                    h-1.5 w-1.5 rounded-full
                                    bg-blue-400
                                    shadow-[0_0_8px_rgba(59,130,246,0.8)]
                                "
                            />
                        </button>

                        {/* Menu Button */}
                        <button
                            type="button"
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                            onClick={() => {
                                const nextState = !isOpen;

                                setIsOpen(nextState);
                                setIsMegaMenuOpen(nextState);
                            }}
                            className="
                                ml-1 flex h-10 w-10
                                items-center justify-center
                                rounded-xl
                                border border-white/[0.06]
                                bg-white/[0.025]
                                text-slate-400
                                transition-all duration-300
                                hover:border-violet-500/20
                                hover:bg-violet-500/[0.08]
                                hover:text-violet-400
                            "
                        >
                            {isOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
                        </button>
                    </div>

                    {/* Tablet Menu */}
                    {isOpen && (
                        <div
                            className="
                                absolute left-0 right-0 top-full mt-2
                                rounded-2xl
                                border border-white/[0.08]
                                bg-[#080B1D]/90
                                p-3
                                backdrop-blur-2xl
                                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                                animate-[mobileMenu_0.3s_ease-out]
                            "
                        >
                            <div className="space-y-1">
                                {navItems.map((item) => {
                                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsMegaMenuOpen(false);
                                            }}
                                            className={`relative block rounded-xl px-4 py-3 text-sm font-medium  transition-all duration-200  ${
                                                active
                                                    ? "bg-violet-500/[0.10] text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.08)] ring-1 ring-violet-400/[0.10]"
                                                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                                            } `}
                                        >
                                            {/* Active Indicator */}
                                            {active && <span className=" absolute left-1.5 top-1/2  h-5 w-[2px] -translate-y-1/2  rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.7)] " />}

                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Bottom Glow */}
                            <div
                                className="
                                    pointer-events-none absolute
                                    bottom-0 left-[12%] right-[12%]
                                    h-px
                                    bg-gradient-to-r
                                    from-transparent
                                    via-violet-500/30
                                    to-transparent
                                "
                            />
                        </div>
                    )}

                    {/* Bottom Gradient Line */}
                    <div
                        className="
                            pointer-events-none absolute
                            bottom-0 left-[8%] right-[8%]
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-violet-500/25
                            to-transparent
                        "
                    />
                </nav>
            </header>
        </div>
    );
}
