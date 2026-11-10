"use client";

import { ArrowLeft, BookOpen, CheckCircle2, Code2, Database, Globe, Layers3, Server } from "lucide-react";

// سه ترکیب رنگ که بین آیتم‌ها می‌چرخد — همه از همون پالت Cyber Blue × Pink
const colorVariants = ["from-[#22D3EE] to-[#3B82F6]", "from-[#3B82F6] to-[#FF2E93]", "from-[#FF2E93] to-[#F472B6]"];

const roadmapItems = [
    {
        id: 1,
        title: "HTML & CSS",
        subtitle: "پایه‌های دنیای وب",
        description: "ساختار صفحات وب، استایل‌دهی، Flexbox، Grid و طراحی ریسپانسیو را از پایه یاد بگیر.",
        level: "مبتدی",
        lessons: "۱۸ درس",
        duration: "۶ ساعت",
        icon: Globe,
        side: "left",
    },
    {
        id: 2,
        title: "JavaScript",
        subtitle: "شروع برنامه‌نویسی واقعی",
        description: "منطق برنامه‌نویسی، متغیرها، توابع، آرایه‌ها، آبجکت‌ها و مفاهیم مدرن JavaScript.",
        level: "مبتدی تا متوسط",
        lessons: "۳۲ درس",
        duration: "۱۰ ساعت",
        icon: Code2,
        side: "right",
    },
    {
        id: 3,
        title: "React",
        subtitle: "ساخت رابط‌های مدرن",
        description: "کامپوننت‌ها، Props، State، Hooks و ساخت رابط‌های کاربری حرفه‌ای با React.",
        level: "متوسط",
        lessons: "۲۶ درس",
        duration: "۹ ساعت",
        icon: Layers3,
        side: "left",
    },
    {
        id: 4,
        title: "Next.js",
        subtitle: "ورود به دنیای Full Stack",
        description: "App Router، Server Components، API، Routing و ساخت پروژه‌های واقعی با Next.js.",
        level: "متوسط تا پیشرفته",
        lessons: "۳۰ درس",
        duration: "۱۲ ساعت",
        icon: Code2,
        side: "right",
    },
    {
        id: 5,
        title: "Backend & API",
        subtitle: "ساخت بخش سمت سرور",
        description: "مفاهیم Backend، API، احراز هویت و ارتباط بین Frontend و Backend را یاد بگیر.",
        level: "پیشرفته",
        lessons: "۲۴ درس",
        duration: "۱۰ ساعت",
        icon: Server,
        side: "left",
    },
    {
        id: 6,
        title: "Database",
        subtitle: "مدیریت و ذخیره اطلاعات",
        description: "مفاهیم دیتابیس، طراحی ساختار داده و کار با دیتابیس در پروژه‌های واقعی.",
        level: "پیشرفته",
        lessons: "۲۰ درس",
        duration: "۸ ساعت",
        icon: Database,
        side: "right",
    },
];

function RoadmapCard({ item, color }) {
    const Icon = item.icon;

    return (
        <article className="group/card relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.045] hover:shadow-2xl sm:p-6">
            {/* Glow */}
            <div
                className={`pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-gradient-to-br ${color} opacity-[0.08] blur-3xl transition-all duration-700 group-hover/card:scale-125 group-hover/card:opacity-[0.18]`}
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE]/25 to-transparent transition-opacity duration-500 group-hover/card:via-[#FF2E93]/40" />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    {/* Icon */}
                    <div
                        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg transition-transform duration-500 group-hover/card:scale-105 sm:h-14 sm:w-14`}
                    >
                        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 blur-md transition-opacity duration-500 group-hover/card:opacity-100" />
                        <Icon size={25} strokeWidth={1.8} className="relative text-white" />
                    </div>

                    {/* Title */}
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-white sm:text-xl">{item.title}</h3>
                        <p className="mt-1 text-xs text-white/45 sm:text-sm">{item.subtitle}</p>
                    </div>
                </div>

                {/* Step Number */}
                <span className="hidden shrink-0 rounded-full border border-[#22D3EE]/15 bg-[#22D3EE]/[0.06] px-3 py-1 text-[11px] font-medium text-[#22D3EE] sm:block">مرحله {item.id}</span>
            </div>

            {/* Mobile Step */}
            <div className="mt-4 inline-flex rounded-full border border-[#22D3EE]/15 bg-[#22D3EE]/[0.06] px-3 py-1 text-[11px] font-medium text-[#22D3EE] sm:hidden">مرحله {item.id}</div>

            {/* Description */}
            <p className="relative mt-5 text-sm leading-7 text-white/55">{item.description}</p>

            {/* Meta */}
            <div className="relative mt-5 flex flex-wrap gap-2">
                <span className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-white/70">{item.level}</span>

                <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-white/70">
                    <BookOpen size={13} className="text-[#22D3EE]" />
                    {item.lessons}
                </span>

                <span className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-white/70">{item.duration}</span>
            </div>

            {/* Footer */}
            <div className="relative mt-6 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-white/45">
                    <CheckCircle2 size={15} className="shrink-0 text-[#22D3EE]" />
                    <span>مسیر پیشنهادی CodeLand</span>
                </div>

                <button
                    type="button"
                    className={`group/btn inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-l ${color} px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl`}
                >
                    <span>مشاهده دوره</span>

                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
                </button>
            </div>
        </article>
    );
}

export default function Roadmap() {
    return (
        <section dir="rtl" className="relative overflow-hidden bg-transparent py-20 sm:py-24 md:py-28">
            <div className="mx-auto w-[92%] max-w-7xl">
                {/* Section Header */}
                <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
                    <span className="mb-4 inline-flex rounded-full border border-[#22D3EE]/15 bg-[#22D3EE]/[0.06] px-4 py-2 text-xs font-medium text-[#22D3EE]">مسیر یادگیری CodeLand</span>

                    <h2 className="text-3xl font-extrabold leading-[1.7] text-white sm:text-4xl lg:text-5xl">
                        از اولین خط کد
                        <span className="bg-gradient-to-l from-[#22D3EE] via-[#3B82F6] to-[#FF2E93] bg-clip-text text-transparent"> تا ساخت پروژه واقعی</span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                        مسیر یادگیری خودت را مرحله‌به‌مرحله دنبال کن و مهارت‌های لازم برای ورود به دنیای برنامه‌نویسی را به دست بیاور.
                    </p>
                </div>

                {/* Roadmap */}
                <div className="relative">
                    {/* Center Line */}
                    <div className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#3B82F6]/60 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.35)] md:block" />

                    {/* Items */}
                    <div className="space-y-8 sm:space-y-12 md:space-y-20">
                        {roadmapItems.map((item, i) => {
                            const color = colorVariants[i % colorVariants.length];

                            return (
                                <div key={item.id} className="relative grid items-center md:grid-cols-2">
                                    {/* Center Node */}
                                    <div className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                                        <div
                                            className={`flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#070516] bg-gradient-to-br ${color} shadow-[0_0_25px_rgba(59,130,246,0.3)]`}
                                        >
                                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                        </div>
                                    </div>

                                    {/* Connector */}
                                    <div
                                        className={`absolute top-1/2 hidden h-px w-10 bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-[#FF2E93]/50 md:block ${
                                            item.side === "left" ? "right-0" : "left-0"
                                        }`}
                                    />

                                    {/* Card */}
                                    <div className={item.side === "left" ? "md:col-start-1 md:pr-14" : "md:col-start-2 md:pl-14"}>
                                        <RoadmapCard item={item} color={color} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
