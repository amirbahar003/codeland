"use client";

import Link from "next/link";
import { Clock, Users, Star, ShoppingCart } from "lucide-react";

const fa = (n) => Number(n).toLocaleString("fa-IR");

const faRating = (n) =>
    Number(n).toLocaleString("fa-IR", {
        minimumFractionDigits: 1,
    });

// سه حالت پس‌زمینه‌ی کاور (وقتی عکس نداری)
const coverVariants = [
    "bg-[radial-gradient(240px_160px_at_25%_30%,rgba(34,211,238,.55),transparent_70%),radial-gradient(240px_180px_at_85%_80%,rgba(255,46,147,.45),transparent_70%)] bg-[#100B33]",

    "bg-[radial-gradient(240px_160px_at_75%_25%,rgba(255,46,147,.55),transparent_70%),radial-gradient(240px_180px_at_15%_85%,rgba(59,130,246,.55),transparent_70%)] bg-[#130A30]",

    "bg-[radial-gradient(240px_160px_at_50%_20%,rgba(34,211,238,.5),transparent_70%),radial-gradient(260px_180px_at_50%_100%,rgba(244,114,182,.5),transparent_70%)] bg-[#0E0A2E]",
];

const levelLabels = ["مقدماتی", "متوسط", "پیشرفته"];

export default function CoursesCard({ course, variant = 0, onAddToCart }) {
    const { title, slug, category, badge, teacher, cover, glyph, description, level = 1, hours, students, rating, price = 0, oldPrice } = course;

    // لینک صفحه‌ی دوره بر اساس slug
    const courseHref = slug ? `/courses/${slug}` : "#";
    const isFree = price === 0;

    const discount = oldPrice && price ? Math.round((1 - price / oldPrice) * 100) : 0;

    const initials = teacher
        ? teacher
              .split(" ")
              .map((w) => w[0])
              .join(" ")
        : "";

    return (
        <article
            dir="rtl"
            className="group w-full self-start rounded-[22px] bg-gradient-to-br from-[#22D3EE]/55 via-white/5 to-[#FF2E93]/55 p-px transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_44px_-10px_rgba(255,46,147,.6),0_0_64px_-14px_rgba(34,211,238,.55)] focus-within:-translate-y-1.5"
        >
            <div className="relative overflow-hidden rounded-[21px] bg-[#0C0924]">
                {/* Cover */}
                <div className={`relative h-[210px] overflow-hidden ${cover ? "" : coverVariants[variant % 3]}`}>
                    {cover ? (
                        <img src={cover} alt={title} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                        <>
                            {/* شبکه‌ی خطی */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 opacity-35 bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]"
                            />

                            <span
                                dir="ltr"
                                className="absolute inset-0 z-[1] grid place-items-center font-mono text-[64px] font-bold tracking-tighter bg-gradient-to-r from-[#22D3EE] to-[#F472B6] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(34,211,238,.45)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-90"
                            >
                                {glyph}
                            </span>
                        </>
                    )}

                    {/* محو شدن کاور به رنگ کارت */}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0C0924] via-transparent to-transparent" />

                    {category && (
                        <span className="absolute right-3.5 top-3.5 z-[2] rounded-full border border-white/10 bg-[#0C0924]/60 px-3 py-1 text-xs font-medium text-[#22D3EE] backdrop-blur-md">
                            {category}
                        </span>
                    )}

                    {(badge || isFree) && (
                        <span
                            className={`absolute left-3.5 top-3.5 z-[2] rounded-full px-3 py-1 text-xs font-bold ${
                                isFree ? "bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-[#04121F]" : "bg-gradient-to-r from-[#FF2E93] to-[#C026D3] text-white"
                            }`}
                        >
                            {isFree ? "رایگان" : badge}
                        </span>
                    )}
                </div>

                {/* پنل شیشه‌ای */}
                <div className="relative z-[2] -mt-11 mx-3 mb-3 rounded-2xl border border-white/10 bg-white/5 p-[18px] pb-4 backdrop-blur-xl">
                    {/* عنوان دوره */}
                    <h2 className="text-[17px] font-extrabold leading-8 text-white">
                        <Link href={courseHref} className="outline-none transition-colors hover:text-[#22D3EE] focus-visible:text-[#22D3EE]">
                            {title}
                        </Link>
                    </h2>

                    {/* مدرس */}
                    {teacher && (
                        <div className="mt-2.5 flex items-center gap-2.5">
                            <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#FF2E93] text-xs font-bold text-white">{initials}</span>

                            <span className="text-[13px] text-white/70">{teacher}</span>
                        </div>
                    )}

                    {/* اطلاعات اضافه: فقط با هاور / فوکوس */}
                    <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-[170px] group-hover:opacity-100 group-focus-within:max-h-[170px] group-focus-within:opacity-100">
                        {description && <p className="mt-3 text-[13px] leading-[1.9] text-white/70">{description}</p>}

                        <div className="mt-2.5 flex items-center gap-2 text-xs text-white/45">
                            <span>سطح: {levelLabels[level - 1]}</span>

                            <div className="flex gap-1" aria-hidden="true">
                                {[1, 2, 3].map((i) => (
                                    <b key={i} className={`h-[5px] w-[22px] rounded-sm ${i <= level ? "bg-gradient-to-r from-[#22D3EE] to-[#FF2E93]" : "bg-white/15"}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* آمار */}
                    <div className="mt-3.5 flex justify-between border-t border-white/10 pt-3.5 text-[12.5px] text-white/70">
                        <span className="flex items-center gap-1.5">
                            <Clock size={15} className="text-[#22D3EE]" />
                            {fa(hours)} ساعت
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Users size={15} className="text-[#22D3EE]" />
                            {fa(students)}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Star size={15} className="text-[#F472B6]" />
                            {faRating(rating)}
                        </span>
                    </div>

                    {/* قیمت و دکمه */}
                    <div className="mt-3.5 flex items-center justify-between gap-2.5">
                        <div className="flex flex-col leading-snug">
                            {oldPrice && !isFree && <span className="text-xs text-white/45 line-through">{fa(oldPrice)}</span>}

                            <span className="bg-gradient-to-r from-[#22D3EE] to-[#F472B6] bg-clip-text text-lg font-extrabold text-transparent">
                                {isFree ? (
                                    "رایگان"
                                ) : (
                                    <>
                                        {fa(price)} <small className="text-xs font-medium">تومان</small>
                                    </>
                                )}
                            </span>
                        </div>

                        {discount > 0 && <span className="rounded-lg border border-[#FF2E93]/35 bg-[#FF2E93]/15 px-2 py-0.5 text-xs font-bold text-[#F472B6]">{fa(discount)}٪</span>}

                        {isFree ? (
                            <Link href={courseHref} className="rounded-xl border border-[#22D3EE]/40 px-4 py-2.5 text-[13.5px] font-bold text-[#22D3EE] transition-colors hover:bg-[#22D3EE]/10">
                                شروع یادگیری
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onAddToCart?.(course)}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#FF2E93] px-4 py-2.5 text-[13.5px] font-bold text-white shadow-[0_0_22px_-6px_rgba(255,46,147,.7)] transition hover:brightness-110 active:scale-95"
                            >
                                <ShoppingCart size={16} />
                                افزودن به سبد
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
