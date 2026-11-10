"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { User, ArrowLeft, BookOpen, GraduationCap, Sparkles, CheckCircle2, PlayCircle } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://localhost:7111/api").replace(/\/$/, "");

const fa = (n) => Number(n ?? 0).toLocaleString("fa-IR");

// ساخت مسیر دوره با استفاده از اسلاگ واقعی بک‌اند
const getCourseUrl = (course) => (course.slug ? `/courses/${encodeURIComponent(course.slug)}` : "/courses");

const percent = (course) => {
    if (course.lessons > 0 && course.completed >= course.lessons) return 100;

    if (typeof course.progressPercentage === "number") {
        return Math.max(0, Math.min(100, Math.round(course.progressPercentage)));
    }

    if (!course.lessons) return 0;

    return Math.round((course.completed / course.lessons) * 100);
};

const statusOf = (course) => {
    if (percent(course) >= 100) {
        return "done";
    }

    if (course.completed > 0) {
        return "progress";
    }

    return "new";
};

const tabs = [
    { value: "all", label: "همه" },
    { value: "open", label: "ناتمام" },
    { value: "done", label: "تکمیل‌شده" },
];

const glass = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/60";

const gridCols = "grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4";

function ProgressBar({ value, done, thin = false }) {
    return (
        <div className={`w-full overflow-hidden rounded-full bg-white/10 ${thin ? "h-1.5" : "h-2"}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
            <div
                className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${done ? "bg-emerald-400" : "bg-gradient-to-l from-[#FF2E93] to-[#22D3EE]"}`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

function ProgressRing({ value, size = 112 }) {
    const gradId = `ring-${useId().replace(/:/g, "")}`;
    const stroke = 8;
    const r = (size - stroke) / 2;
    const circumference = 2 * Math.PI * r;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${fa(value)} درصد پیشرفت`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#FF2E93" />
                    </linearGradient>
                </defs>

                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={stroke} />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * value) / 100}
                    className="transition-all duration-700 motion-reduce:transition-none"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white">{fa(value)}٪</span>
                <span className="mt-0.5 text-[11px] text-white/50">پیشرفت دوره</span>
            </div>
        </div>
    );
}

function ResumeSection({ course }) {
    const value = percent(course);
    const done = statusOf(course) === "done";

    return (
        <section className={`${glass} group relative isolate overflow-hidden p-5 sm:p-7`}>
            <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-[#22D3EE]/10 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-28 left-1/4 -z-10 h-64 w-64 rounded-full bg-[#FF2E93]/10 blur-[90px]" />

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#22D3EE]/70 to-[#FF2E93]/60" />

            <div className="relative flex flex-col gap-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#22D3EE]/20 bg-[#22D3EE]/10 text-[#22D3EE]">
                            <Sparkles size={21} />
                        </div>

                        <div>
                            <h2 className="text-base font-extrabold text-white sm:text-lg">ادامه یادگیری</h2>
                            <p className="mt-1 text-xs text-white/45">دقیقاً از جایی که متوقف شدی</p>
                        </div>
                    </div>

                    <span
                        className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:inline-flex ${
                            done ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-[#22D3EE]/20 bg-[#22D3EE]/10 text-[#22D3EE]"
                        }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-400" : "bg-[#22D3EE]"}`} />
                        {done ? "دوره تکمیل شده" : "در حال یادگیری"}
                    </span>
                </div>

                <div className="h-px bg-gradient-to-l from-white/5 via-white/10 to-transparent" />

                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-7">
                    <div className="relative">
                        <div className="absolute inset-2 rounded-full bg-[#22D3EE]/10 blur-2xl" />
                        <ProgressRing value={value} />
                    </div>

                    <div className="min-w-0 flex-1 self-stretch text-center sm:text-right">
                        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <span className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-2.5 py-1 text-[11px] font-semibold text-[#22D3EE]">مسیر یادگیری</span>

                            <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/50">{fa(course.lessons)} درس</span>
                        </div>

                        <h3 className="text-lg font-extrabold leading-8 text-white sm:text-xl">{course.title}</h3>

                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white/55 sm:justify-start">
                            <CheckCircle2 size={16} className="shrink-0 text-[#FF2E93]" />
                            <span>{course.lastLesson ? `آخرین درس تکمیل‌شده: ${course.lastLesson}` : "هنوز درسی از این دوره تکمیل نشده"}</span>
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                                <span className="text-white/50">وضعیت یادگیری</span>

                                <span className="font-semibold text-[#22D3EE]">
                                    {fa(course.completed)} از {fa(course.lessons)} درس
                                </span>
                            </div>

                            <ProgressBar value={value} done={done} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center justify-center gap-2 text-xs text-white/40 sm:justify-start">
                        <PlayCircle size={17} className="text-[#22D3EE]" />
                        {done ? "می‌توانی محتوای دوره را دوباره مرور کنی" : "قدم بعدی یادگیری منتظر توست"}
                    </div>

                    <Link
                        href={getCourseUrl(course)}
                        className={`group/button inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-l from-[#D91A7F] to-[#7C3AED] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#7C3AED]/15 transition-all hover:-translate-y-0.5 hover:shadow-[#7C3AED]/30 ${focusRing}`}
                    >
                        {done ? "مرور دوره" : "ادامه یادگیری"}

                        <ArrowLeft size={17} className="transition-transform group-hover/button:-translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function CourseCard({ course }) {
    const value = percent(course);
    const status = statusOf(course);
    const done = status === "done";

    const cta = done ? "مرور دوره" : status === "new" ? "شروع یادگیری" : "ادامه یادگیری";

    return (
        <Link
            href={getCourseUrl(course)}
            className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/40 hover:bg-white/[0.07] ${focusRing}`}
        >
            <div className="aspect-video overflow-hidden rounded-xl">
                {course.image ? (
                    <img
                        src={course.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#22D3EE]/25 via-[#8B5CF6]/15 to-[#FF2E93]/25">
                        <BookOpen size={32} strokeWidth={1.3} className="text-white/60" />
                    </div>
                )}
            </div>

            <div className="flex-1 px-1.5 pt-3">
                <h3 className="line-clamp-2 text-sm font-bold leading-6 text-white">{course.title}</h3>

                <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-white/60">
                    <User size={15} />
                    {course.instructor}
                </div>
            </div>

            <div className="mx-1.5 mt-3 border-t border-white/10 pt-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`shrink-0 text-[13px] font-medium ${done ? "text-emerald-300" : "text-[#22D3EE]"}`}>{done ? "تکمیل‌شده" : `${fa(value)}٪ پیشرفت`}</span>

                    <span className="text-xs text-white/50">
                        {fa(course.completed)} از {fa(course.lessons)} درس
                    </span>
                </div>

                <ProgressBar value={value} done={done} thin />
            </div>

            <span
                className={`mt-3 flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
                    done ? "bg-emerald-400/10 text-emerald-300 group-hover:bg-emerald-400/20" : "bg-[#22D3EE]/10 text-[#22D3EE] group-hover:bg-[#22D3EE]/20"
                }`}
            >
                {cta}

                <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
            </span>
        </Link>
    );
}

function CourseSkeleton() {
    const pulse = "animate-pulse bg-white/10 motion-reduce:animate-none";

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5" aria-hidden="true">
            <div className={`aspect-video rounded-xl ${pulse}`} />

            <div className="space-y-2.5 px-1.5 pt-3">
                <div className={`h-3.5 w-4/5 rounded ${pulse}`} />
                <div className={`h-3.5 w-3/5 rounded ${pulse}`} />
                <div className={`h-3 w-2/5 rounded ${pulse}`} />
                <div className={`mt-4 h-1.5 w-full rounded-full ${pulse}`} />
                <div className={`h-9 w-full rounded-lg ${pulse}`} />
            </div>
        </div>
    );
}

export default function MyCoursesPage() {
    const [tab, setTab] = useState("all");
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadCourses() {
            setIsLoading(true);
            setError("");

            try {
                const [enrollmentResponse, progressResponse] = await Promise.all([
                    fetch(`${API_URL}/Enrollments/my-course`, {
                        credentials: "include",
                    }),
                    fetch(`${API_URL}/LessonProgress/my-courses`, {
                        credentials: "include",
                    }),
                ]);

                if (enrollmentResponse.status === 401 || progressResponse.status === 401) {
                    throw new Error("برای مشاهده دوره‌ها ابتدا وارد حساب خود شوید.");
                }

                if (!enrollmentResponse.ok || !progressResponse.ok) {
                    throw new Error("دریافت اطلاعات دوره‌ها با خطا مواجه شد.");
                }

                const [enrollments, progressList] = await Promise.all([enrollmentResponse.json(), progressResponse.json()]);

                const progressByCourseId = new Map(progressList.map((item) => [item.courseId, item]));

                const mergedCourses = enrollments.map((enrollment) => {
                    const progress = progressByCourseId.get(enrollment.courseId);

                    return {
                        ...enrollment,

                        // slug از پاسخ Enrollments بدون تغییر حفظ می‌شود
                        slug: enrollment.slug,

                        instructor: enrollment.instructor?.userName || "مدرس دوره",

                        image: enrollment.thumbnailId ? `${API_URL}/Files/${enrollment.thumbnailId}` : "",

                        lessons: progress?.totalLessons ?? 0,
                        completed: progress?.completedLessons ?? 0,

                        progressPercentage: progress?.progressPercentage ?? 0,

                        lastLesson: typeof progress?.lastCompletedLesson === "string" ? progress.lastCompletedLesson : "",
                    };
                });

                if (!cancelled) {
                    setCourses(mergedCourses);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "خطایی هنگام دریافت دوره‌ها رخ داد.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadCourses();

        return () => {
            cancelled = true;
        };
    }, []);

    const counts = {
        all: courses.length,
        open: courses.filter((course) => statusOf(course) !== "done").length,
        done: courses.filter((course) => statusOf(course) === "done").length,
    };

    const list = courses.filter((course) => {
        if (tab === "all") return true;
        if (tab === "done") return statusOf(course) === "done";

        return statusOf(course) !== "done";
    });

    const resume = courses.find((course) => statusOf(course) === "progress") || courses[0] || null;

    return (
        <div dir="rtl" className="space-y-6">
            <header>
                <h1 className="text-xl font-bold text-white sm:text-2xl">دوره‌های من</h1>

                <p className="mt-1 text-sm text-white/60">{fa(courses.length)} دوره در حساب شما</p>
            </header>

            {resume && !isLoading && <ResumeSection course={resume} />}

            <div role="group" aria-label="فیلتر دوره‌ها" className="flex w-full gap-1 overflow-x-auto rounded-xl bg-white/5 p-1 sm:w-fit">
                {tabs.map((item) => (
                    <button
                        key={item.value}
                        aria-pressed={tab === item.value}
                        onClick={() => setTab(item.value)}
                        className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm transition-colors ${focusRing} ${
                            tab === item.value ? "bg-[#22D3EE]/15 text-[#22D3EE]" : "text-white/70 hover:text-white"
                        }`}
                    >
                        {item.label}

                        <span className={`rounded-md px-1.5 text-xs ${tab === item.value ? "bg-[#22D3EE]/20" : "bg-white/10"}`}>{fa(counts[item.value])}</span>
                    </button>
                ))}
            </div>

            <p role="status" className="sr-only">
                {fa(list.length)} دوره نمایش داده می‌شود
            </p>

            {isLoading ? (
                <div className={gridCols}>
                    {[0, 1, 2, 3].map((item) => (
                        <CourseSkeleton key={item} />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-200">
                    <p>{error}</p>

                    <button onClick={() => window.location.reload()} className={`mt-3 rounded-lg bg-white/10 px-4 py-2 ${focusRing}`}>
                        تلاش دوباره
                    </button>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/15 py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#22D3EE]/10 text-[#22D3EE]">
                        <GraduationCap size={40} strokeWidth={1.4} />
                    </div>

                    <p className="text-white">هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید</p>

                    <Link href="/courses" className={`rounded-xl bg-[#22D3EE]/15 px-6 py-3 text-sm font-bold text-[#22D3EE] transition-colors hover:bg-[#22D3EE]/25 ${focusRing}`}>
                        مشاهده دوره‌ها
                    </Link>
                </div>
            ) : list.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 py-14 text-white/60">
                    <BookOpen size={40} strokeWidth={1.4} />
                    <p className="text-sm">دوره‌ای در این دسته وجود ندارد</p>
                </div>
            ) : (
                <div className={gridCols}>
                    {list.map((course) => (
                        <CourseCard key={course.courseId} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}
