"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ChevronDown, ArrowRight, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMegaMenu } from "../context/MegaMenuContext";
import UserMenu from "./UserMenu";
import useCart from "@/hooks/useCart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// فرمت قیمت با ارقام فارسی
const formatPrice = (value) => Number(value || 0).toLocaleString("fa-IR");

// حلقه فوکوس کیبورد
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";

// پنل شناور سبد خرید
function CartDropdown({ items, onRemove, loading, removingId }) {
    const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Math.max(1, Number(item.quantity || 1)), 0);

    return (
        <div
            dir="rtl"
            className="invisible absolute right-0 top-full z-50 w-[380px] translate-y-[-8px] scale-[0.97] pt-3 opacity-0 transition-all duration-300 ease-out motion-reduce:transition-none group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
        >
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.14] bg-[#0B1024]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[28px]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-blue-500/[0.04]" />

                <div className="relative">
                    {/* هدر */}
                    <div className="mb-4 flex items-center justify-between border-b border-white/[0.07] pb-4">
                        <h3 className="text-sm font-semibold text-slate-100">سبد خرید من</h3>

                        <span className="text-xs text-slate-500">{items.length.toLocaleString("fa-IR")} دوره</span>
                    </div>

                    {/* وضعیت بارگذاری */}
                    {loading ? (
                        <div className="flex items-center justify-center gap-1 py-8" role="status" aria-label="در حال دریافت سبد خرید">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-pink-400" />
                        </div>
                    ) : items.length === 0 ? (
                        /* سبد خالی */
                        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-8">
                            <ShoppingCart size={28} strokeWidth={1.5} className="mb-3 text-slate-600" aria-hidden="true" />

                            <p className="text-sm text-slate-400">سبد خرید شما خالی است</p>

                            <Link href="/courses" className={`mt-3 rounded text-sm text-blue-400 transition-colors hover:text-blue-300 ${focusRing}`}>
                                مشاهده دوره‌ها
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* لیست دوره‌ها */}
                            <ul className="max-h-64 space-y-4 overflow-y-auto">
                                {items.map((item) => {
                                    const courseId = item.courseId ?? item.id;

                                    return (
                                        <li key={courseId} className="flex items-center gap-3">
                                            {/* تصویر دوره */}
                                            <Link
                                                href={item.slug ? `/courses/${item.slug}` : "/courses"}
                                                className={`relative h-[60px] w-[100px] shrink-0 overflow-hidden rounded-lg border border-white/10 ${focusRing}`}
                                            >
                                                {item.thumbnailId ? (
                                                    <Image src={`${API_URL}/Files/${item.thumbnailId}`} alt={item.title || "دوره آموزشی"} fill sizes="100px" unoptimized className="object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-slate-800">
                                                        <ShoppingCart size={20} className="text-slate-500" />
                                                    </div>
                                                )}
                                            </Link>

                                            {/* عنوان و قیمت */}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-100">{item.title}</p>

                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                                                    <span className="font-semibold text-blue-400">{formatPrice(item.price)}</span>

                                                    <span className="text-slate-500">تومان</span>

                                                    {Number(item.oldPrice) > Number(item.price) && <span className="text-slate-500 line-through">{formatPrice(item.oldPrice)}</span>}
                                                </div>
                                            </div>

                                            {/* حذف دوره */}
                                            <button
                                                type="button"
                                                disabled={removingId === courseId}
                                                onClick={() => onRemove(courseId)}
                                                aria-label={`حذف ${item.title} از سبد خرید`}
                                                className={`rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-violet-400 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                                            >
                                                {removingId === courseId ? (
                                                    <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-slate-500 border-t-blue-400" />
                                                ) : (
                                                    <Trash2 size={17} strokeWidth={1.8} aria-hidden="true" />
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* جمع مبلغ و ادامه خرید */}
                            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                                <div>
                                    <div className="text-xs text-slate-500">قابل پرداخت</div>

                                    <div className="mt-1 text-sm font-semibold text-slate-100">{formatPrice(total)} تومان</div>
                                </div>

                                <Link
                                    href="/cart"
                                    className={`rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition hover:brightness-110 motion-reduce:transition-none ${focusRing}`}
                                >
                                    ادامه خرید
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DesktopNavbar() {
    const { setIsMegaMenuOpen } = useMegaMenu();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [activeCourse, setActiveCourse] = useState("");
    const [removingId, setRemovingId] = useState(null);
    const [courseCategories, setCourseCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const { items: cartItems, loading: cartLoading, removeItem } = useCart();
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);

    const pathname = usePathname();

    useEffect(() => {
        let cancelled = false;

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/Category`);

                if (!response.ok) {
                    throw new Error("دریافت دسته‌بندی‌ها ناموفق بود.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setCourseCategories(data);
                }
            } catch (error) {
                console.error("خطا در دریافت دسته‌بندی‌ها:", error);
            } finally {
                if (!cancelled) {
                    setCategoriesLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    const activeCategory = courseCategories.find((category) => category.id === activeCourse) ?? courseCategories[0];

    const activeCategoryCourses = courses.filter((course) => (course.categoryId ?? course.category?.id) === activeCategory?.id);

    useEffect(() => {
        let cancelled = false;

        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_URL}/Courses`);

                if (!response.ok) {
                    throw new Error("دریافت دوره‌ها ناموفق بود.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setCourses(data.items ?? []);
                }
            } catch (error) {
                console.error("خطا در دریافت دوره‌ها:", error);
            } finally {
                if (!cancelled) {
                    setCoursesLoading(false);
                }
            }
        };

        fetchCourses();

        return () => {
            cancelled = true;
        };
    }, []);

    // بررسی ورود کاربر
    useEffect(() => {
        let cancelled = false;

        const checkLogin = async () => {
            try {
                const response = await fetch(`${API_URL}/Auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    if (!cancelled) {
                        setUser(null);
                        setIsLoggedIn(false);
                    }
                    return;
                }

                const data = await response.json();

                if (!cancelled) {
                    setUser({
                        ...data,
                        phone: data.mobile,
                        userName: data.username,
                    });

                    setIsLoggedIn(true);
                }
            } catch {
                if (!cancelled) {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            }
        };

        checkLogin();

        return () => {
            cancelled = true;
        };
    }, []);

    // حذف دوره از API
    const removeFromCart = async (courseId) => {
        if (!courseId) return;

        try {
            setRemovingId(courseId);
            await removeItem(courseId);
        } catch (error) {
            console.error("خطا در حذف دوره از سبد خرید:", error);
        } finally {
            setRemovingId(null);
        }
    };

    // استایل لینک‌های Navbar
    const navLinkClass = (path) => `relative text-sm font-medium transition-colors duration-300 ${pathname.startsWith(path) ? "text-blue-400" : "text-slate-400 hover:text-blue-400"}`;

    return (
        <div className="hidden lg:block">
            <header className="fixed top-0 z-50 w-full">
                <nav className="relative mx-auto mt-4 flex h-20 w-[92%] max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-[#080B1D]/75 px-5 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                    {/* Ambient Glow */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute -left-20 -top-24 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />
                        <div className="absolute -right-20 -bottom-24 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                    </div>

                    {/* لوگو و لینک‌ها */}
                    <div className="relative flex items-center gap-10">
                        <Link href="/" className={`group relative shrink-0 rounded text-2xl font-bold tracking-tight ${focusRing}`}>
                            <span className="text-slate-100">Code</span>
                            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Land</span>
                            <span className="pointer-events-none absolute -inset-2 -z-10 rounded-xl bg-gradient-to-r from-violet-600/10 to-blue-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                        </Link>

                        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                        <div className="flex items-center gap-8">
                            {/* مگامنوی دوره‌ها */}
                            <div className="group relative" onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
                                <Link
                                    href="/courses"
                                    className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 ease-out group-hover:-translate-y-[2px] group-hover:scale-[1.03] ${focusRing} ${
                                        pathname.startsWith("/courses") ? "text-blue-400" : "text-slate-400 hover:text-blue-400"
                                    }`}
                                >
                                    Courses
                                    <ChevronDown size={15} strokeWidth={2} aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:rotate-180" />
                                </Link>

                                <div className="invisible absolute left-0 top-full w-[620px] translate-y-2 scale-[0.98] pt-3 opacity-0 transition-all duration-300 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-[#080B1D]/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-[28px] before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-violet-500/[0.04] before:via-transparent before:to-blue-500/[0.04]">
                                        <div className="grid grid-cols-[210px_1fr] gap-2">
                                            <div className="space-y-1">
                                                {courseCategories.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        href="/courses"
                                                        onMouseEnter={() => setActiveCourse(category.id)}
                                                        onFocus={() => setActiveCourse(category.id)}
                                                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 ${focusRing} ${
                                                            activeCategory?.id === category.id
                                                                ? "border-white/[0.08] bg-white/[0.06] text-slate-100"
                                                                : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                                                        }`}
                                                    >
                                                        <span>{category.name}</span>

                                                        <ArrowRight
                                                            size={15}
                                                            strokeWidth={1.8}
                                                            aria-hidden="true"
                                                            className={`transition-all duration-300 ${activeCategory?.id === category.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                                                        />
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="rounded-xl border border-white/[0.05] bg-[#050817]/70 p-4">
                                                <h3 className="mb-3 text-sm font-semibold text-slate-100">{activeCategory?.name ?? "دسته‌بندی‌ها"}</h3>

                                                <div className="space-y-1">
                                                    {categoriesLoading || coursesLoading ? (
                                                        <p className="px-3 py-2 text-sm text-slate-500">در حال دریافت دوره‌ها...</p>
                                                    ) : activeCategoryCourses.length > 0 ? (
                                                        activeCategoryCourses.map((course) => (
                                                            <Link
                                                                key={course.id}
                                                                href={`/courses/${course.slug}`}
                                                                className={`block rounded-lg px-3 py-2 text-sm text-slate-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-slate-100 ${focusRing}`}
                                                            >
                                                                {course.title.trim()}
                                                            </Link>
                                                        ))
                                                    ) : (
                                                        <p className="px-3 py-2 text-sm text-slate-500">هنوز دوره‌ای در این دسته‌بندی ثبت نشده است.</p>
                                                    )}
                                                </div>

                                                <Link href="/courses" className={`mt-5 inline-block rounded text-sm text-blue-400 transition-colors hover:text-blue-300 ${focusRing}`}>
                                                    مشاهده همه دوره‌ها →
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="pointer-events-none absolute bottom-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
                                    </div>
                                </div>
                            </div>

                            <Link href="/roadmap" className={`${navLinkClass("/roadmap")} rounded ${focusRing}`}>
                                Roadmap
                            </Link>

                            <Link href="/instructors" className={`${navLinkClass("/instructors")} rounded ${focusRing}`}>
                                Instructors
                            </Link>

                            <Link href="/about" className={`${navLinkClass("/about")} rounded ${focusRing}`}>
                                About
                            </Link>
                        </div>
                    </div>

                    {/* ورود و سبد خرید */}
                    <div className="relative flex items-center gap-2">
                        {isLoggedIn ? (
                            <UserMenu user={user} />
                        ) : (
                            <Link
                                href="/login"
                                className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-white/[0.16] bg-white/[0.07] px-5 py-2 text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all duration-300 hover:border-violet-400/30 hover:bg-white/[0.11] hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)] ${focusRing}`}
                            >
                                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                <span className="relative">ورود | ثبت نام</span>
                            </Link>
                        )}

                        {/* آیکن و پنل سبد خرید */}
                        <div className="group relative">
                            <Link
                                href="/cart"
                                aria-label={`سبد خرید، ${cartItems.length.toLocaleString("fa-IR")} دوره`}
                                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-all duration-300 hover:border-violet-500/20 hover:bg-violet-500/[0.08] hover:text-violet-400 ${focusRing}`}
                            >
                                <ShoppingCart size={20} strokeWidth={1.8} aria-hidden="true" className="transition-transform duration-300 group-hover:scale-110" />

                                {cartItems.length > 0 && <span className="absolute right-2 top-1 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                            </Link>

                            <CartDropdown items={cartItems} onRemove={removeFromCart} loading={cartLoading} removingId={removingId} />
                        </div>
                    </div>

                    <div className="pointer-events-none absolute bottom-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
                </nav>
            </header>
        </div>
    );
}
