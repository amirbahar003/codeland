"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../../globals.css";
import { Clock, Users, Star, BadgeCheck, CheckCircle2, PlayCircle, Award, ChevronDown, CalendarDays, Share2, Send, ClipboardList, Lock } from "lucide-react";

import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import useCountdown from "@/hooks/useCountdown";
import useCurriculum from "@/hooks/useCurriculum";
import useGlobalDiscount from "@/hooks/useGlobalDiscount";

import TimeBox from "@/app/(main)/components/Courses/TimeBox";
import CommentsSection from "@/app/(main)/components/Courses/CommentsSection";
import CartToast from "../../components/CartToast/CartToast";
import useCart from "@/hooks/useCart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* Keyboard focus rings */
const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300";
const FOCUS_INSET = "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-300";

/* =========================================================
HELPERS
========================================================= */

// Persian digits
const fa = (value) => new Intl.NumberFormat("fa-IR").format(value ?? 0);

function formatToman(value) {
    if (!value) return "رایگان";

    return fa(value) + " تومان";
}

function formatDuration(minutes) {
    if (!minutes) return `${fa(0)} دقیقه`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${fa(mins)} دقیقه`;
    if (mins === 0) return `${fa(hours)} ساعت`;

    return `${fa(hours)} ساعت و ${fa(mins)} دقیقه`;
}

/* =========================================================
SHARED GLASS CARD
========================================================= */

function Panel({ children, className = "", id }) {
    return (
        <div id={id} className={`rounded-2xl border border-white/[0.09] bg-[#0b1020]/75 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl ${className}`}>
            {children}
        </div>
    );
}

/* =========================================================
SECTION TITLE (same style everywhere)
========================================================= */

function SectionTitle({ children, aside }) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h2 className="text-lg font-bold text-white">{children}</h2>

            {aside}
        </div>
    );
}

/* =========================================================
STAT CELL (inside one compact stats strip)
========================================================= */

function StatCell({ icon: Icon, label, value, tone = "cyan" }) {
    const iconColor = tone === "pink" ? "text-pink-300" : "text-cyan-300";

    return (
        <div className="flex items-center gap-3 bg-[#0b1020]/80 px-4 py-3.5">
            <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} strokeWidth={1.6} />

            <div className="min-w-0">
                <span className="block text-sm font-bold leading-6 text-white">{value}</span>

                <span className="block text-xs text-white/60">{label}</span>
            </div>
        </div>
    );
}

/* =========================================================
CART BUTTON
========================================================= */

function CartButton({ onClick, loading, label, className = "" }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            type="button"
            className={`
                group
                relative
                min-h-[54px]
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-cyan-300
                to-pink-400
                px-6
                py-3
                text-sm
                font-extrabold
                text-[#06101f]
                shadow-[0_10px_30px_rgba(34,211,238,0.18)]
                transition-all
                duration-300
                hover:shadow-[0_12px_36px_rgba(255,46,147,0.28)]
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${FOCUS}
                ${className}
            `}
        >
            <span
                className="
                    pointer-events-none
                    absolute
                    inset-y-[-20%]
                    -left-[70%]
                    w-[45%]
                    rotate-[18deg]
                    bg-gradient-to-r
                    from-transparent
                    via-white/40
                    to-transparent
                    blur-md
                    transition-all
                    duration-700
                    ease-out
                    group-hover:left-[125%]
                "
            />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                    <span className="flex items-center justify-center gap-1.5" role="status" aria-label="در حال افزودن به سبد خرید">
                        {[0, 1, 2].map((i) => (
                            <span key={i} className="cart-dot block h-2 w-2 rounded-full bg-current" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </span>
                ) : (
                    label
                )}
            </span>
        </button>
    );
}

/* =========================================================
INSTRUCTOR CARD
========================================================= */

function InstructorCard({ instructor }) {
    if (!instructor) return null;

    return (
        <Panel className="p-5">
            <h2 className="mb-4 text-sm font-bold text-white">مدرس دوره</h2>

            <div className="flex items-start gap-3.5">
                {instructor.avatarId && (
                    <img src={`${API_URL}/Files/${instructor.avatarId}`} alt={instructor.userName} className="h-14 w-14 shrink-0 rounded-full border-2 border-cyan-300/30 object-cover" />
                )}

                <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-bold text-white">{instructor.userName}</h3>

                        <BadgeCheck className="h-4 w-4 shrink-0 text-cyan-300" />
                    </div>

                    {instructor.expertise && <p className="text-sm text-pink-300">{instructor.expertise}</p>}

                    {instructor.bio && <p className="line-clamp-2 text-xs leading-6 text-white/65">{instructor.bio}</p>}
                </div>
            </div>
        </Panel>
    );
}

/* =========================================================
SHARE PANEL
========================================================= */

function SharePanel() {
    const buttonClass = `flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-300 transition-colors duration-300 ${FOCUS}`;

    return (
        <Panel className="px-4 py-3">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-slate-200">
                    <Share2 className="h-[18px] w-[18px]" strokeWidth={1.8} />

                    <span className="text-sm font-semibold">اشتراک‌گذاری</span>
                </div>

                <div className="flex items-center gap-2">
                    <button type="button" aria-label="اشتراک‌گذاری در X" className={`${buttonClass} hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300`}>
                        <FaXTwitter className="h-[16px] w-[16px]" />
                    </button>

                    <button type="button" aria-label="اشتراک‌گذاری در LinkedIn" className={`${buttonClass} hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300`}>
                        <FaLinkedinIn className="h-[16px] w-[16px]" />
                    </button>

                    <button type="button" aria-label="اشتراک‌گذاری در تلگرام" className={`${buttonClass} hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-300`}>
                        <Send className="h-[16px] w-[16px]" />
                    </button>
                </div>
            </div>
        </Panel>
    );
}

/* =========================================================
LOADING SKELETON
========================================================= */

function PageSkeleton() {
    const block = "animate-pulse rounded-2xl bg-white/[0.06]";

    return (
        <main
            dir="rtl"
            className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pt-28 md:pt-32 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-10"
            aria-busy="true"
            aria-label="در حال دریافت اطلاعات دوره"
        >
            <div className="flex flex-col gap-5">
                <div className={`${block} h-6 w-28`} />
                <div className={`${block} h-12 w-3/4`} />
                <div className={`${block} h-5 w-1/2`} />
                <div className={`${block} h-24 w-full`} />
                <div className={`${block} h-64 w-full`} />
            </div>

            <div className="flex flex-col gap-4">
                <div className={`${block} aspect-video w-full`} />
                <div className={`${block} h-48 w-full`} />
            </div>
        </main>
    );
}

/* =========================================================
COURSE DETAIL PAGE
========================================================= */

export default function CourseDetailPage() {
    const { slug } = useParams();

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [openModules, setOpenModules] = useState([]);
    const [addingToCart, setAddingToCart] = useState(false);
    const [pauseToastShown, setPauseToastShown] = useState(false);

    const { curriculum, loading: curriculumLoading, error: curriculumError } = useCurriculum(course?.id);

    const { discount } = useGlobalDiscount();

    const { h, m, s } = useCountdown(discount?.endDate);
    const { addToCart } = useCart();

    function showNotification(message, type = "success") {
        setToastMessage(message);
        setToastType(type);
        setShowToast(false);

        requestAnimationFrame(() => {
            setShowToast(true);
        });
    }

    const handleAddToCart = async () => {
        if (!course?.id || addingToCart) return;

        try {
            setAddingToCart(true);

            await addToCart(course.id);

            showNotification("دوره با موفقیت به سبد خرید اضافه شد.", "success");
        } catch (error) {
            showNotification(error.message || "افزودن دوره به سبد خرید با خطا مواجه شد.", "error");
        } finally {
            setAddingToCart(false);
        }
    };

    useEffect(() => {
        if (!showToast) return;

        const timer = setTimeout(() => {
            setShowToast(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [showToast, toastMessage]);

    /* =========================================================
    GET COURSE
    ========================================================= */

    useEffect(() => {
        if (!slug) return;

        async function fetchCourse() {
            try {
                setLoading(true);
                setError("");

                // دریافت اطلاعات دوره
                const response = await fetch(`${API_URL}/Courses/slug/${slug}`);

                if (!response.ok) {
                    throw new Error("دوره پیدا نشد");
                }

                const data = await response.json();

                // دریافت دوره‌های ثبت‌نام‌شدهٔ کاربر
                const enrollmentResponse = await fetch(`${API_URL}/Enrollments/my-course`, {
                    credentials: "include",
                });

                let enrollments = [];

                if (enrollmentResponse.ok) {
                    enrollments = await enrollmentResponse.json();
                }

                const isEnrolled = enrollments.some((enrollment) => enrollment.courseId === data.id);

                setCourse({
                    ...data,
                    isEnrolled,
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [slug]);

    const handleLessonEnded = async (lessonId) => {
        try {
            const response = await fetch(`${API_URL}/LessonProgress/${lessonId}/complete`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("ثبت پیشرفت جلسه ناموفق بود.");
            }

            showNotification("شما جلسه را با موفقیت پشت سر گذاشتید 🎉", "success");
        } catch (error) {
            console.error("Lesson progress error:", error);

            showNotification("ثبت پیشرفت جلسه ناموفق بود. لطفاً دوباره تلاش کنید.", "error");
        }
    };

    const handleLessonPause = (event) => {
        const video = event.currentTarget;

        if (video.currentTime > 0 && video.currentTime < video.duration && !pauseToastShown) {
            showNotification("شما هنوز جلسه را کامل مشاهده نکرده‌اید.", "error");

            setPauseToastShown(true);
        }
    };

    /* =========================================================
    TOGGLE CURRICULUM
    ========================================================= */

    const toggleModule = (index) => {
        setOpenModules((previous) => {
            if (previous.includes(index)) {
                return previous.filter((item) => item !== index);
            }

            return [...previous, index];
        });
    };

    /* =========================================================
    LOADING
    ========================================================= */

    if (loading) {
        return <PageSkeleton />;
    }

    /* =========================================================
    ERROR
    ========================================================= */

    if (error || !course) {
        return (
            <main className="flex min-h-screen items-center justify-center text-white">
                <p className="text-red-400">{error || "دوره پیدا نشد"}</p>
            </main>
        );
    }

    /* =========================================================
    COURSE VALUES
    ========================================================= */

    const price = course.price ?? 0;

    let finalPrice = price;
    let discountAmount = 0;
    let discountPercent = 0;

    if (discount) {
        if (discount.type === "Percentage") {
            discountAmount = (price * discount.value) / 100;

            if (discount.maximumDiscount != null && discountAmount > discount.maximumDiscount) {
                discountAmount = discount.maximumDiscount;
            }
        }

        if (discount.type === "FixedAmount") {
            discountAmount = discount.value;
        }

        if (discountAmount > price) {
            discountAmount = price;
        }

        finalPrice = price - discountAmount;

        discountPercent = price > 0 ? Math.round((discountAmount / price) * 100) : 0;
    }

    const isFreeCourse = finalPrice === 0;
    const ctaLabel = isFreeCourse ? "ثبت‌نام رایگان" : "افزودن به سبد خرید";

    const totalLessons = curriculum.reduce((total, module) => total + (module.lessons?.length || 0), 0);

    const totalMinutes = curriculum.reduce((total, module) => total + (module.lessons || []).reduce((lessonTotal, lesson) => lessonTotal + (lesson.durationMinutes || 0), 0), 0);

    const hasPrerequisites = course.prerequisites?.length > 0;

    /* =========================================================
    ENROLLMENT / LOCK LOGIC
    NOTE: assumes the API returns `course.isEnrolled`.
    If the field has another name, change only this line.
    ========================================================= */

    const isEnrolled = course.isEnrolled ?? false;

    const canWatch = (lesson) => isEnrolled || lesson.isFree;

    const handleLessonClick = (lesson) => {
        if (!canWatch(lesson)) {
            showNotification("برای مشاهده‌ی این جلسه باید در دوره ثبت‌نام کنید.", "error");
            return;
        }

        setSelectedLesson((previous) => (previous?.id === lesson.id ? null : lesson));
    };

    /* =========================================================
    FREE PREVIEW (button on the thumbnail)
    ========================================================= */

    const firstFreeLesson = curriculum.flatMap((module) => module.lessons || []).find((lesson) => lesson.isFree);

    const handlePreview = () => {
        if (!firstFreeLesson) return;

        const moduleIndex = curriculum.findIndex((module) => module.lessons?.some((lesson) => lesson.id === firstFreeLesson.id));

        if (moduleIndex >= 0) {
            setOpenModules((previous) => (previous.includes(moduleIndex) ? previous : [...previous, moduleIndex]));
        }

        setSelectedLesson(firstFreeLesson);

        requestAnimationFrame(() => {
            document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    return (
        <div dir="rtl" className="relative min-h-screen overflow-x-clip text-white" style={{ fontFamily: "var(--font-vazir, sans-serif)" }}>
            <CartToast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} type={toastType} />

            {/* Background grid (top of page only) */}

            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-[0.15]"
                style={{
                    backgroundImage: "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                    maskImage: "radial-gradient(ellipse at 30% 0%, black 0%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 30% 0%, black 0%, transparent 70%)",
                }}
            />

            {/* =====================================================
                PAGE GRID
                mobile order: header → purchase card → content → instructor + share
                desktop: header + content on the right, sticky sidebar on the left
            ===================================================== */}

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-32 pt-28 md:pt-32 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-10 lg:pb-24">
                {/* =================================================
                    HEADER (title, meta, stats)
                ================================================= */}

                <header className="flex min-w-0 flex-col gap-5 lg:col-start-1 lg:row-start-1">
                    {course.category?.name && (
                        <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">{course.category.name}</span>
                    )}

                    <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-pink-400 bg-clip-text text-3xl font-extrabold leading-snug text-transparent md:text-4xl">{course.title}</h1>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
                        <span className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                            <span className="font-semibold text-white">{fa(course.rating ?? 0)}</span>

                            <span>({fa(course.ratingCount ?? 0)} نظر)</span>
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-cyan-300" />
                            {fa(course.studentCount ?? 0)} دانشجو
                        </span>

                        {!hasPrerequisites && (
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                                بدون پیش‌نیاز
                            </span>
                        )}
                    </div>

                    {/* Stats strip */}

                    <div className="overflow-hidden rounded-2xl border border-white/[0.09] shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-px bg-white/[0.09] xl:grid-cols-4">
                            <StatCell icon={Clock} label="مدت زمان دوره" value={formatDuration(course.durationMinutes || totalMinutes)} tone="cyan" />

                            <StatCell icon={Award} label="سطح دوره" value={course.level ?? "مقدماتی"} tone="pink" />

                            <StatCell icon={ClipboardList} label="فصل‌ها" value={`${fa(curriculum.length)} فصل`} tone="cyan" />

                            <StatCell icon={PlayCircle} label="جلسات" value={`${fa(totalLessons)} جلسه`} tone="pink" />
                        </div>
                    </div>
                </header>

                {/* =================================================
                    SIDEBAR (sticky on desktop)
                ================================================= */}

                <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
                    {/* negative margin + padding keeps the card shadows from being clipped by the scroll area */}
                    <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:-mx-3 lg:-my-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:px-3 lg:py-3 lg:[scrollbar-width:none]">
                        {/* Purchase card */}

                        <Panel className="overflow-hidden">
                            <div className="relative aspect-video w-full bg-white/5">
                                {course.thumbnailId ? (
                                    <img src={`${API_URL}/Files/${course.thumbnailId}`} alt={course.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-white/50">تصویر دوره</div>
                                )}

                                {firstFreeLesson && !isEnrolled && (
                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        aria-label="مشاهده‌ی پیش‌نمایش رایگان دوره"
                                        className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35 ${FOCUS_INSET}`}
                                    >
                                        <span className="flex items-center gap-2 rounded-full bg-[#0b1020]/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                                            <PlayCircle className="h-5 w-5 text-cyan-300" />
                                            پیش‌نمایش رایگان
                                        </span>
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 p-5">
                                {/* Price */}

                                <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                                    <span className="whitespace-nowrap text-2xl font-extrabold leading-tight text-cyan-300">{formatToman(finalPrice)}</span>

                                    {discount && discountPercent > 0 && (
                                        <span className="flex items-center gap-2">
                                            <span className="whitespace-nowrap text-sm text-white/50 line-through">{formatToman(price)}</span>

                                            <span className="whitespace-nowrap rounded-full bg-pink-400/15 px-2.5 py-0.5 text-xs font-bold text-pink-300">{fa(discountPercent)}٪ تخفیف</span>
                                        </span>
                                    )}
                                </div>

                                {/* Discount countdown */}

                                {discount && (
                                    <div className="rounded-xl border border-pink-400/15 bg-pink-400/[0.05] px-3.5 py-3">
                                        <p className="mb-2.5 text-center text-xs font-semibold text-pink-300">زمان باقی‌مانده تا پایان تخفیف</p>

                                        <div className="flex items-center justify-center gap-1.5" dir="ltr">
                                            <TimeBox value={h} label="ساعت" />

                                            <span className="text-white/40">:</span>

                                            <TimeBox value={m} label="دقیقه" />

                                            <span className="text-white/40">:</span>

                                            <TimeBox value={s} label="ثانیه" />
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}

                                {isEnrolled ? (
                                    <div className="flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 text-sm font-semibold text-cyan-300">
                                        <CheckCircle2 className="h-4 w-4" />
                                        شما در این دوره ثبت‌نام کرده‌اید
                                    </div>
                                ) : (
                                    <CartButton onClick={handleAddToCart} loading={addingToCart} label={ctaLabel} className="w-full" />
                                )}

                                <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-white/60">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="h-4 w-4 text-pink-300" />
                                        تاریخ ایجاد
                                    </span>

                                    <span className="font-semibold text-white/80">{new Date(course.createdAt).toLocaleDateString("fa-IR")}</span>
                                </div>
                            </div>
                        </Panel>

                        {/* Instructor + Share (desktop only here; on mobile they come after the content) */}

                        <div className="hidden flex-col gap-4 lg:flex">
                            <InstructorCard instructor={course.instructor} />

                            <SharePanel />
                        </div>
                    </div>
                </aside>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-2">
                    {/* About */}

                    {course.description && (
                        <Panel className="p-6 md:p-8">
                            <SectionTitle>درباره‌ی دوره</SectionTitle>

                            <p className="text-sm leading-8 text-white/75 md:text-[15px]">{course.description}</p>
                        </Panel>
                    )}

                    {/* What you will learn */}

                    {course.learnPoints?.length > 0 && (
                        <Panel className="p-6 md:p-8">
                            <SectionTitle>در این دوره چه می‌آموزید</SectionTitle>

                            <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
                                {course.learnPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2.5 text-sm leading-7 text-white/80">
                                        <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-cyan-300" />

                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </Panel>
                    )}

                    {/* Prerequisites (only when the course has any) */}

                    {hasPrerequisites && (
                        <Panel className="p-6 md:p-8">
                            <SectionTitle>پیش‌نیازها</SectionTitle>

                            <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
                                {course.prerequisites.map((prerequisite) => (
                                    <li key={prerequisite.id} className="flex items-start gap-2.5 text-sm leading-7 text-white/80">
                                        <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-pink-300" />

                                        <span>{prerequisite.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </Panel>
                    )}

                    {/* =================================================
                        CURRICULUM
                    ================================================= */}

                    <Panel id="curriculum" className="scroll-mt-28 p-6 md:p-8">
                        <SectionTitle
                            aside={
                                <span className="text-xs text-white/60">
                                    {fa(curriculum.length)} فصل • {fa(totalLessons)} جلسه • {formatDuration(totalMinutes)}
                                </span>
                            }
                        >
                            سرفصل‌های دوره
                        </SectionTitle>

                        {curriculumLoading && <div className="py-10 text-center text-sm text-white/55">در حال دریافت سرفصل‌ها...</div>}

                        {!curriculumLoading && curriculumError && <div className="py-10 text-center text-sm text-red-400">دریافت سرفصل‌ها با خطا مواجه شد.</div>}

                        {!curriculumLoading && !curriculumError && curriculum.length === 0 && <div className="py-10 text-center text-sm text-white/55">هنوز سرفصلی برای این دوره ثبت نشده است.</div>}

                        {!curriculumLoading && !curriculumError && curriculum.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {curriculum.map((module, index) => {
                                    const isOpen = openModules.includes(index);
                                    const moduleMinutes = (module.lessons || []).reduce((total, lesson) => total + (lesson.durationMinutes || 0), 0);

                                    return (
                                        <div key={module.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                                            {/* Module Header */}

                                            <button
                                                type="button"
                                                onClick={() => toggleModule(index)}
                                                aria-expanded={isOpen}
                                                className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-right transition-colors ${FOCUS_INSET} ${
                                                    isOpen ? "bg-cyan-300/10" : "hover:bg-white/[0.025]"
                                                }`}
                                            >
                                                <span className="min-w-0 text-sm font-semibold text-white">{module.title}</span>

                                                <span className="flex shrink-0 items-center gap-3 text-xs text-white/60">
                                                    <span>{fa(module.lessons?.length || 0)} جلسه</span>

                                                    <span className="hidden text-white/25 sm:inline">•</span>

                                                    <span className="hidden sm:inline">{formatDuration(moduleMinutes)}</span>

                                                    <ChevronDown className={`h-4 w-4 shrink-0 text-cyan-300 transition-transform ${isOpen ? "" : "rotate-90"}`} />
                                                </span>
                                            </button>

                                            {/* Lessons (plain rows, no extra card borders) */}

                                            {isOpen && (
                                                <div className="divide-y divide-white/[0.06] border-t border-white/10">
                                                    {module.lessons?.map((lesson, lessonIndex) => {
                                                        const isSelected = selectedLesson?.id === lesson.id;
                                                        const locked = !canWatch(lesson);

                                                        return (
                                                            <div key={lesson.id}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleLessonClick(lesson)}
                                                                    aria-disabled={locked}
                                                                    className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-right text-sm transition-colors ${FOCUS_INSET} ${
                                                                        locked ? "cursor-not-allowed text-white/55 hover:bg-white/[0.02]" : "text-white/85 hover:bg-white/[0.03] hover:text-white"
                                                                    }`}
                                                                >
                                                                    <span className="flex min-w-0 items-center gap-3">
                                                                        <span className="w-5 shrink-0 text-center font-bold text-white/70">{fa(lessonIndex + 1)}</span>

                                                                        <span className="h-5 w-px shrink-0 bg-white/10" />

                                                                        <span className="truncate">{lesson.title}</span>
                                                                    </span>

                                                                    <span className="flex shrink-0 items-center gap-3">
                                                                        {lesson.isFree && !isEnrolled && (
                                                                            <span className="hidden rounded-md bg-cyan-400/10 px-2 py-0.5 text-[11px] text-cyan-300 sm:inline-block">
                                                                                پیش‌نمایش رایگان
                                                                            </span>
                                                                        )}

                                                                        <span className="text-xs tabular-nums text-white/55">{fa(lesson.durationMinutes || 0)} دقیقه</span>

                                                                        {locked ? (
                                                                            <Lock className="h-4 w-4 text-white/50" aria-label="قفل" />
                                                                        ) : (
                                                                            <PlayCircle className={`h-4 w-4 ${isSelected ? "text-cyan-300" : "text-white/55"}`} />
                                                                        )}
                                                                    </span>
                                                                </button>

                                                                {isSelected && !locked && (
                                                                    <div className="px-4 pb-4">
                                                                        <video
                                                                            controls
                                                                            autoPlay
                                                                            onEnded={() => handleLessonEnded(lesson.id)}
                                                                            onPause={(event) => handleLessonPause(event, lesson)}
                                                                            className="w-full rounded-xl border border-white/10 bg-black"
                                                                            src={`${API_URL}/Lesson/${lesson.id}/video`}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Panel>

                    {/* Instructor + Share (mobile / tablet only) */}

                    <div className="flex flex-col gap-4 lg:hidden">
                        <InstructorCard instructor={course.instructor} />

                        <SharePanel />
                    </div>

                    {/* Comments */}

                    <CommentsSection courseId={course.id} instructorId={course.instructorId} onNotEnrolled={() => showNotification("در این دوره ثبت‌نام نکرده‌اید.", "error")} />
                </div>
            </div>

            {/* =====================================================
                MOBILE BOTTOM BAR (price + CTA)
            ===================================================== */}

            {!isEnrolled && (
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b1020]/90 px-4 pt-3 backdrop-blur-xl pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
                    <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-col">
                            {discount && discountPercent > 0 && <span className="whitespace-nowrap text-xs text-white/50 line-through">{formatToman(price)}</span>}

                            <span className="whitespace-nowrap text-lg font-extrabold leading-tight text-cyan-300">{formatToman(finalPrice)}</span>
                        </div>

                        <CartButton onClick={handleAddToCart} loading={addingToCart} label={ctaLabel} className="min-h-[48px] flex-1 sm:max-w-[240px]" />
                    </div>
                </div>
            )}
        </div>
    );
}
