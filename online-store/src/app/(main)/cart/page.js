"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, GraduationCap, Infinity as InfinityIcon, Lock, RotateCcw, ShieldCheck, ShoppingCart, Tag, Trash2 } from "lucide-react";
import useCart from "@/hooks/useCart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// قیمت به تومان است، پس اعشار نمایش داده نمی‌شود
const fa = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
const toman = (n) => fa.format(Math.round(Number(n) || 0));

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";
const GLASS = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl";

// مسیر خرید: از سبد تا شروع یادگیری (مرحله اطلاعات حذف شد)
const STEPS = [
    { label: "سبد خرید", icon: ShoppingCart },
    { label: "پرداخت امن", icon: Lock },
    { label: "شروع یادگیری", icon: GraduationCap },
];

const TRUST = [
    { icon: ShieldCheck, label: "پرداخت امن" },
    { icon: RotateCcw, label: "ضمانت بازگشت وجه" },
    { icon: InfinityIcon, label: "دسترسی همیشگی" },
];

// مسیرهای پیشنهادی در حالت سبد خالی
const SUGGESTED_PATHS = [
    { label: "Frontend", href: "/courses/front-end" },
    { label: "Backend", href: "/courses/back-end" },
    { label: "Full Stack", href: "/courses/full-stack" },
];

export default function CartPage() {
    // removeItem را اگر در useCart دارید استفاده می‌کند؛ در غیر این صورت دکمه حذف غیرفعال می‌ماند
    const { items, loading, error, removeItem } = useCart();
    const [code, setCode] = useState("");
    const [showCoupon, setShowCoupon] = useState(false);
    const [removingId, setRemovingId] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponMessage, setCouponMessage] = useState("");
    const [couponError, setCouponError] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const totals = useMemo(() => {
        const full = items.reduce((sum, i) => sum + (i.oldPrice ?? i.price), 0);

        const pay = items.reduce((sum, i) => sum + i.price, 0);

        const courseSavings = full - pay;
        const couponSavings = appliedCoupon?.DiscountAmount ?? 0;

        const finalPay = appliedCoupon ? Math.max(0, appliedCoupon.FinalPrice) : pay;

        return {
            full,
            pay,
            saved: courseSavings,
            couponSavings,
            finalPay,
        };
    }, [items, appliedCoupon]);
    const applyCoupon = async (e) => {
        e.preventDefault();

        const normalizedCode = code.trim();

        if (!normalizedCode) {
            setCouponError(true);
            setCouponMessage("لطفاً کد تخفیف را وارد کنید.");
            return;
        }

        if (items.length === 0) {
            setCouponError(true);
            setCouponMessage("سبد خرید شما خالی است.");
            return;
        }

        try {
            setCouponLoading(true);
            setCouponMessage("");
            setCouponError(false);

            const response = await fetch(`${API_URL}/Discount/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    code: normalizedCode,
                    price: totals.pay,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.isValid) {
                setAppliedCoupon(null);
                setCouponError(true);
                setCouponMessage(result.message || "اعمال کد تخفیف با خطا مواجه شد.");
                return;
            }

            setAppliedCoupon({
                code: normalizedCode,
                DiscountAmount: Number(result.discountAmount),
                FinalPrice: Number(result.finalPrice),
            });

            setCouponError(false);
            setCouponMessage(result.message || "کد تخفیف با موفقیت اعمال شد.");
        } catch (err) {
            setAppliedCoupon(null);
            setCouponError(true);
            setCouponMessage("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
        } finally {
            setCouponLoading(false);
        }
    };
    const handleRemove = async (courseId) => {
        if (!removeItem) return;
        try {
            setRemovingId(courseId);
            await removeItem(courseId);
        } catch (err) {
            console.error(err);
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div dir="rtl" role="status" aria-live="polite" className="flex min-h-screen flex-col items-center justify-center gap-5 overflow-x-hidden bg-transparent text-white">
                <style>{`
                    @keyframes cart-dot {
                        0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; }
                        40% { transform: scale(1.2); opacity: 1; }
                    }
                    .cart-dot { animation: cart-dot 1.2s ease-in-out infinite; }
                    @media (prefers-reduced-motion: reduce) {
                        .cart-dot { animation: none; opacity: 0.8; }
                    }
                `}</style>

                <div className="flex items-center gap-2" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                        <span key={i} className="cart-dot block h-2.5 w-2.5 rounded-full bg-white/80" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>

                <p className="text-sm text-white/60">در حال دریافت سبد خرید...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div dir="rtl" className="flex min-h-screen items-center justify-center overflow-x-hidden text-white">
                <div className={`${GLASS} border-[#FF2E93]/40 px-8 py-6 text-[#FF2E93]`}>{error}</div>
            </div>
        );
    }

    return (
        <div dir="rtl" className="min-h-screen overflow-x-hidden text-white">
            <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-28 md:px-6">
                {/* عنوان و مراحل */}
                <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <h1 className="bg-gradient-to-l from-cyan-400 to-[#FF2E93] bg-clip-text text-4xl font-extrabold text-transparent">سبد خرید</h1>
                        <p className="mt-2 text-[15px] text-white/60">{fa.format(items.length)} دوره در سبد شما است</p>
                    </div>

                    <ol className="flex w-full max-w-md items-center" aria-label="مراحل خرید">
                        {STEPS.map(({ label, icon: Icon }, idx) => {
                            const active = idx === 0;
                            return (
                                <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={active ? "step" : undefined}>
                                    <div className="flex flex-col items-center gap-2">
                                        <span
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                                                active ? "border-[#FF2E93] bg-[#FF2E93]/15 text-[#FF2E93] shadow-[0_0_20px_rgba(255,46,147,0.5)]" : "border-white/15 bg-white/5 text-white/40"
                                            }`}
                                        >
                                            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                        </span>
                                        <span className={`text-xs ${active ? "font-semibold text-white" : "text-white/40"}`}>{label}</span>
                                    </div>

                                    {idx < STEPS.length - 1 && (
                                        <span aria-hidden="true" className={`mx-2 mb-6 h-px flex-1 ${idx === 0 ? "bg-gradient-to-l from-[#FF2E93] to-white/10" : "bg-white/10"}`} />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>

                {/* سبد خالی */}
                {items.length === 0 ? (
                    <div className={`${GLASS} relative mx-auto max-w-xl overflow-hidden px-6 py-10 text-center`}>
                        {/* هاله نئونی پس‌زمینه */}
                        <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-1/2 h-44 w-44 translate-x-1/2 rounded-full bg-[#FF2E93]/20 blur-3xl" />
                        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

                        <div className="relative flex flex-col items-center">
                            {/* آیکن دو حلقه‌ای */}
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_32px_rgba(34,211,238,0.25)]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/10 text-[#FF2E93] shadow-[0_0_20px_rgba(255,46,147,0.35)]">
                                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                                </div>
                            </div>

                            <h2 className="mb-1 text-xl font-extrabold">سبد خرید شما خالی است</h2>
                            <p className="mb-5 text-sm leading-7 text-white/60">یک دوره انتخاب کنید و یادگیری را شروع کنید.</p>

                            <Link
                                href="/courses"
                                className={`inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-[#FF2E93] px-7 text-sm font-extrabold text-slate-950 shadow-[0_0_24px_rgba(255,46,147,0.4)] transition hover:brightness-110 motion-reduce:transition-none ${FOCUS}`}
                            >
                                مشاهده دوره‌ها
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            </Link>

                            {/* مسیرهای پیشنهادی */}
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                                <span className="text-xs text-white/60">شروع سریع:</span>

                                {SUGGESTED_PATHS.map((c) => (
                                    <Link
                                        key={c.href}
                                        href={c.href}
                                        className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:border-cyan-400/50 hover:text-cyan-300 ${FOCUS}`}
                                    >
                                        {c.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-start gap-6">
                        {/* لیست دوره‌ها */}
                        <section aria-label="دوره‌های سبد خرید" className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
                            {totals.saved > 0 && (
                                <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300">
                                    <Check className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    {toman(totals.saved)} تومان تخفیف روی سبد شما اعمال شده است
                                </div>
                            )}

                            {items.map((item) => {
                                const percent = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
                                return (
                                    <article
                                        key={item.courseId}
                                        className={`${GLASS} flex flex-wrap items-center gap-x-5 gap-y-4 p-4 transition hover:border-cyan-400/30 ${removingId === item.courseId ? "opacity-40" : ""}`}
                                    >
                                        {/* تامبنیل ۱۶:۹ */}
                                        <div className="relative aspect-video w-full flex-none overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:w-44">
                                            <img src={`${API_URL}/Files/${item.thumbnailId}`} alt={item.title} className="h-full w-full object-cover" />
                                            {percent > 0 && (
                                                <span className="absolute right-2 top-2 rounded-full bg-[#FF2E93] px-2.5 py-0.5 text-xs font-extrabold text-slate-950">
                                                    {fa.format(percent)}٪ تخفیف
                                                </span>
                                            )}
                                        </div>

                                        {/* اطلاعات دوره */}
                                        <div className="min-w-0 flex-[1_1_180px]">
                                            <h2 className="mb-2 truncate text-lg font-extrabold">{item.title}</h2>
                                            <p className="mb-3 text-sm text-white/60">مدرس: {item.instructor}</p>
                                            <span className="inline-block rounded-full border border-cyan-400/50 bg-cyan-400/5 px-3 py-0.5 text-xs text-cyan-300">{item.level}</span>
                                        </div>

                                        {/* قیمت و حذف */}
                                        <div className="flex w-full items-center justify-between gap-3 border-t border-white/10 pt-4 sm:w-auto sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
                                            <div className="text-right">
                                                {item.oldPrice != null && <div className="text-xs text-white/40 line-through">{toman(item.oldPrice)}</div>}
                                                <div className="whitespace-nowrap text-lg font-extrabold">
                                                    {toman(item.price)}
                                                    <span className="mr-1 text-xs font-normal text-white/60">تومان</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemove(item.courseId)}
                                                disabled={!removeItem || removingId === item.courseId}
                                                aria-label={`حذف ${item.title} از سبد`}
                                                className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-white/50 transition hover:bg-[#FF2E93]/10 hover:text-[#FF2E93] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/50 ${FOCUS}`}
                                            >
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                حذف
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}

                            <Link href="/courses" className={`inline-flex min-h-11 items-center gap-2 text-sm text-cyan-400 transition hover:text-[#FF2E93] ${FOCUS}`}>
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                ادامه مرور دوره‌ها
                            </Link>
                        </section>

                        {/* خلاصه سفارش */}
                        <aside
                            aria-label="خلاصه سفارش"
                            className="min-w-[300px] flex-[0_1_380px] rounded-[20px] border border-cyan-400/30 bg-white/5 p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl lg:sticky lg:top-28"
                        >
                            <h2 className="mb-5 text-xl font-extrabold">خلاصه سفارش</h2>

                            <dl className="flex flex-col gap-3.5 pb-5 text-[15px]">
                                <div className="flex justify-between">
                                    <dt className="text-white/60">جمع دوره‌ها</dt>
                                    <dd>{toman(totals.full)} تومان</dd>
                                </div>
                                {totals.saved > 0 && (
                                    <div className="flex justify-between">
                                        <dt className="text-white/60">سود شما از تخفیف</dt>
                                        <dd className="font-semibold text-cyan-300">{toman(totals.saved)} تومان</dd>
                                    </div>
                                )}
                            </dl>

                            {/* کد تخفیف (جمع‌شونده) */}
                            <div className="border-t border-white/10 py-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCoupon((v) => !v)}
                                    aria-expanded={showCoupon}
                                    aria-controls="coupon-panel"
                                    className={`flex w-full items-center justify-between rounded-lg text-sm text-cyan-300 transition hover:text-cyan-200 ${FOCUS}`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Tag className="h-4 w-4" aria-hidden="true" />
                                        کد تخفیف دارید؟
                                    </span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showCoupon ? "rotate-180" : ""}`} aria-hidden="true" />
                                </button>

                                {showCoupon && (
                                    <div id="coupon-panel">
                                        <form onSubmit={applyCoupon} className="mt-3 flex gap-2">
                                            <label htmlFor="coupon" className="sr-only">
                                                کد تخفیف
                                            </label>
                                            <input
                                                id="coupon"
                                                type="text"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                placeholder="کد را وارد کنید"
                                                className={`h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/40 ${FOCUS}`}
                                            />

                                            <button
                                                type="submit"
                                                disabled={couponLoading}
                                                className={`h-11 rounded-xl border border-cyan-400/60 px-5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`}
                                            >
                                                {couponLoading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
                                                        در حال بررسی...
                                                    </span>
                                                ) : (
                                                    "اعمال"
                                                )}
                                            </button>
                                        </form>

                                        {/* پیام نتیجه کد تخفیف */}
                                        {couponMessage && (
                                            <p role="status" aria-live="polite" className={`mt-2 text-sm ${couponError ? "text-[#FF2E93]" : "text-cyan-300"}`}>
                                                {couponMessage}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* مبلغ نهایی */}
                            <div className="border-t border-white/10 pb-6 pt-5">
                                <div className="mb-2 text-sm text-white/60">مبلغ قابل پرداخت</div>

                                {appliedCoupon && totals.couponSavings > 0 && <div className="mb-1 text-sm text-white/40 line-through">{toman(totals.pay)} تومان</div>}

                                <div className="flex items-baseline gap-2">
                                    <span className="bg-gradient-to-l from-cyan-400 to-[#FF2E93] bg-clip-text text-3xl font-extrabold text-transparent">{toman(totals.finalPay)}</span>

                                    <span className="text-sm text-white/60">تومان</span>
                                </div>

                                {appliedCoupon && totals.couponSavings > 0 && (
                                    <p className="mt-2 text-sm font-semibold text-cyan-300">
                                        {toman(totals.couponSavings)} تومان تخفیف با کد {appliedCoupon.code}
                                    </p>
                                )}
                            </div>

                            <Link
                                href="/checkout"
                                className={`flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-l from-cyan-400 to-[#FF2E93] text-base font-extrabold text-slate-950 shadow-[0_0_28px_rgba(255,46,147,0.4)] transition hover:brightness-110 ${FOCUS}`}
                            >
                                <Lock className="h-5 w-5" aria-hidden="true" />
                                ادامه و پرداخت
                            </Link>

                            <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5 text-[13px] text-white/60">
                                {TRUST.map(({ icon: Icon, label }) => (
                                    <li key={label} className="flex items-center gap-2.5">
                                        <Icon className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}
