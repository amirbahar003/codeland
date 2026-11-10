"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

const learningPaths = [
    {
        id: 1,
        key: "frontend",
        category: "Frontend",
        title: "Frontend Developer",
        description: "مسیر کامل یادگیری توسعه فرانت‌اند از پایه تا ساخت پروژه‌های واقعی.",
        steps: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
        stages: 5,
        courses: 24,
        level: "مناسب برای شروع از صفر",
    },
    {
        id: 2,
        key: "backend",
        category: "Backend",
        title: "Backend Developer",
        description: "مسیر یادگیری بک‌اند برای ساخت API و سرویس‌های قدرتمند و مقیاس‌پذیر.",
        steps: ["C#", ".NET", "ASP.NET Core", "API", "Database"],
        stages: 5,
        courses: 18,
        level: "مناسب برای ورود به بک‌اند",
    },
    {
        id: 3,
        key: "fullstack",
        category: "Full Stack",
        title: "Full Stack Developer",
        description: "مسیر جامع توسعه وب از Frontend تا Backend و ساخت اپلیکیشن‌های کامل.",
        steps: ["HTML", "JavaScript", "React", "Next.js", "Backend"],
        stages: 5,
        courses: 30,
        level: "مسیر جامع توسعه وب",
    },
];

export default function LearningPaths() {
    const [activePath, setActivePath] = useState("frontend");

    const selectedPath = learningPaths.find((path) => path.key === activePath);

    return (
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
            {/* Ambient Background */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[100px] sm:h-[450px] sm:w-[650px] sm:blur-[120px]" />

            <div className="mx-auto w-[92%] max-w-7xl">
                {/* Section Header */}
                <div className="mx-auto mb-8 text-center sm:mb-10 md:mb-12">
                    <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-violet-400/80 to-blue-400/80" />

                        <h2 className="whitespace-nowrap text-xl font-extrabold text-white sm:text-2xl md:text-3xl">
                            مسیرهای <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">یادگیری</span>
                        </h2>

                        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-violet-400/80 to-blue-400/80" />
                    </div>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">مسیر مناسب خودت را انتخاب کن و قدم‌به‌قدم مهارت‌های لازم را یاد بگیر.</p>
                </div>

                {/* Path Selector */}
                <div className="mx-auto mb-8 flex w-full max-w-md overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1.5 backdrop-blur-xl scrollbar-none sm:w-fit">
                    {learningPaths.map((path) => {
                        const isActive = activePath === path.key;

                        return (
                            <button
                                key={path.key}
                                type="button"
                                onClick={() => setActivePath(path.key)}
                                className={`relative flex-1 shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 sm:flex-none sm:px-7 ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-500/[0.14] via-violet-500/[0.12] to-purple-500/[0.10] text-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.08)] ring-1 ring-blue-400/[0.12]"
                                        : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-300"
                                }`}
                            >
                                {path.category}

                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 h-px w-8 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-violet-400 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />
                                )}
                            </button>
                        );
                    })}
                </div>
                {/* Selected Path */}
                {selectedPath && (
                    <div
                        key={selectedPath.key}
                        className="group relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.035] p-5 backdrop-blur-2xl transition-all duration-500 sm:p-8 md:p-10"
                    >
                        {/* Main Glow */}
                        <div className="pointer-events-none absolute -right-32 -top-32 h-56 w-56 rounded-full bg-blue-500/[0.08] blur-3xl transition-all duration-700 group-hover:bg-violet-500/[0.12] sm:h-72 sm:w-72" />

                        <div className="pointer-events-none absolute -bottom-32 -left-32 h-56 w-56 rounded-full bg-violet-500/[0.06] blur-3xl sm:h-72 sm:w-72" />

                        {/* Top Reflection */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

                        {/* Content */}
                        <div className="relative">
                            {/* Card Header */}
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0 max-w-2xl">
                                    <div className="mb-3 flex flex-wrap items-center gap-3">
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">{selectedPath.category}</span>

                                        <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" />

                                        <span className="text-xs text-slate-500">{selectedPath.level}</span>
                                    </div>

                                    <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{selectedPath.title}</h3>

                                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">{selectedPath.description}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex shrink-0 items-center gap-5 md:pt-2">
                                    <div>
                                        <div className="text-lg font-bold text-slate-200">{selectedPath.stages}</div>

                                        <div className="mt-1 text-xs text-slate-500">مرحله</div>
                                    </div>

                                    <div className="h-8 w-px bg-white/[0.08]" />

                                    <div>
                                        <div className="text-lg font-bold text-slate-200">{selectedPath.courses}</div>

                                        <div className="mt-1 text-xs text-slate-500">دوره</div>
                                    </div>
                                </div>
                            </div>

                            {/* Learning Steps */}
                            <div className="relative mt-8 sm:mt-10">
                                {/* Connecting Line */}
                                <div className="absolute left-5 right-5 top-5 hidden h-px bg-gradient-to-r from-blue-500/10 via-violet-400/40 to-purple-500/10 md:block" />

                                {/* Line Glow */}
                                <div className="absolute left-[8%] right-[8%] top-5 hidden h-8 -translate-y-1/2 bg-violet-500/[0.035] blur-xl md:block" />

                                <div className="relative grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
                                    {selectedPath.steps.map((step, index) => (
                                        <div key={step} className="group/step relative flex items-center gap-3 md:flex-col md:gap-3 md:text-center">
                                            {/* Node */}
                                            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-400/20 bg-[#080B1D] shadow-[0_0_20px_rgba(59,130,246,0.07)] transition-all duration-300 group-hover/step:border-violet-400/50 group-hover/step:shadow-[0_0_25px_rgba(139,92,246,0.18)] sm:h-10 sm:w-10">
                                                <span className="absolute h-2 w-2 rounded-full bg-blue-400 opacity-30 blur-sm transition-all duration-300 group-hover/step:bg-violet-400 group-hover/step:opacity-60" />

                                                <span className="relative z-10 text-xs font-bold text-blue-300 transition-colors duration-300 group-hover/step:text-violet-300">{index + 1}</span>
                                            </div>

                                            {/* Step Name */}
                                            <span className="min-w-0 text-sm font-semibold text-slate-400 transition-colors duration-300 group-hover/step:text-slate-100">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Check size={16} className="shrink-0 text-blue-400" strokeWidth={2} />

                                    <span>مسیر مرحله‌به‌مرحله و پروژه‌محور</span>
                                </div>

                                <Link
                                    href={`/roadmap/${selectedPath.key}`}
                                    className="group/link inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-400 transition-all duration-300 hover:text-violet-400"
                                >
                                    <span> مشاهده دوره </span>

                                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover/link:-translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
