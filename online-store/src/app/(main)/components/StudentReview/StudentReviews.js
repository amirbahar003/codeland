"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
    {
        id: 1,
        name: "علی رضایی",
        role: "Frontend Developer",
        review: "مسیر یادگیری فرانت‌اند خیلی منظم و قابل فهم بود. بالاخره تونستم مباحث JavaScript و React رو به شکل اصولی یاد بگیرم.",
    },
    {
        id: 2,
        name: "سارا احمدی",
        role: "JavaScript Student",
        review: "چیزی که بیشتر از همه دوست داشتم، ترتیب مراحل یادگیری بود. دقیقاً می‌دونستم بعد از هر مرحله باید سراغ چه چیزی برم.",
    },
    {
        id: 3,
        name: "امیر محمدی",
        role: "React Developer",
        review: "توضیحات دوره‌ها و پروژه‌هایی که همراه مسیر قرار گرفته بودن باعث شد یادگیری فقط تئوری نباشه و واقعاً کدنویسی کنم.",
    },
];

export default function StudentReviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const updateCarousel = (newIndex) => {
        if (isAnimating) return;

        setIsAnimating(true);

        const nextIndex = (newIndex + reviews.length) % reviews.length;

        setCurrentIndex(nextIndex);

        setTimeout(() => {
            setIsAnimating(false);
        }, 500);
    };

    const nextSlide = () => {
        updateCarousel(currentIndex + 1);
    };

    const prevSlide = () => {
        updateCarousel(currentIndex - 1);
    };

    // Keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                updateCarousel(currentIndex - 1);
            }

            if (e.key === "ArrowRight") {
                updateCarousel(currentIndex + 1);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentIndex, isAnimating]);

    // Touch / Swipe
    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;

            const diff = touchStartX - touchEndX;
            const swipeThreshold = 50;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    updateCarousel(currentIndex + 1);
                } else {
                    updateCarousel(currentIndex - 1);
                }
            }
        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [currentIndex, isAnimating]);

    return (
        <section dir="rtl" className="relative overflow-hidden py-24">
            {/* Section Header */}
            <div className="mx-auto mb-14 w-[92%] max-w-7xl">
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                    {/* Left Line */}
                    <div className="hidden h-[2px] flex-1 rounded-full bg-gradient-to-r from-transparent via-violet-400/80 to-blue-400/80 sm:block" />

                    {/* Title */}
                    <h2 className="text-center text-3xl font-extrabold leading-[1.6] tracking-tight text-white sm:text-4xl">
                        تجربه‌ای که از{" "}
                        <span dir="ltr" className="inline-block bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            CodeLand
                        </span>{" "}
                        می‌مونه
                    </h2>

                    {/* Right Line */}
                    <div className="hidden h-[2px] flex-1 rounded-full bg-gradient-to-l from-transparent via-violet-400/80 to-blue-400/80 sm:block" />
                </div>
            </div>

            {/* Carousel */}
            <div className="relative mx-auto h-[390px] w-[92%] max-w-7xl sm:h-[360px] md:h-[340px]">
                {/* Left Arrow */}
                <button
                    type="button"
                    onClick={prevSlide}
                    className=" absolute left-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-violet-400/30  hover:bg-violet-400/10 hover:text-violet-400  sm:h-10 sm:w-10
                    "
                    aria-label="نظر قبلی"
                >
                    <ChevronLeft size={18} className="sm:h-5 sm:w-5" />
                </button>

                {/* Track */}
                <div className="relative flex h-full items-center justify-center">
                    {reviews.map((review, i) => {
                        const offset = (i - currentIndex + reviews.length) % reviews.length;

                        let position = "hidden";

                        if (offset === 0) {
                            position = "center";
                        } else if (offset === 1) {
                            position = "right-1";
                        } else if (offset === reviews.length - 1) {
                            position = "left-1";
                        }

                        const positionClasses = {
                            center: `
                                z-20
                                scale-100
                                sm:scale-105
                                opacity-100
                            `,

                            "left-1": `
                                z-10
                                -translate-x-[180px]
                                scale-90
                                opacity-60
                                sm:-translate-x-[280px]
                                md:-translate-x-[360px]
                            `,

                            "right-1": `
                                z-10
                                translate-x-[180px]
                                scale-90
                                opacity-60
                                sm:translate-x-[280px]
                                md:translate-x-[360px]
                            `,

                            hidden: `
                                pointer-events-none
                                opacity-0
                                scale-75
                            `,
                        };

                        return (
                            <article
                                key={review.id}
                                onClick={() => updateCarousel(i)}
                                className={`
                                    group
                                    absolute
                                    w-full
                                    max-w-[360px]
                                    cursor-pointer
                                    transition-all
                                    duration-500
                                    ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                                    sm:max-w-[400px]
                                    md:max-w-[430px]
                                    ${positionClasses[position]}
                                `}
                            >
                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        p-6
                                        backdrop-blur-xl
                                        transition-all
                                        duration-300
                                        group-hover:border-violet-400/20
                                        group-hover:bg-white/[0.04]
                                        sm:p-7
                                    "
                                >
                                    {/* Glow */}
                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            -right-10
                                            -top-10
                                            h-24
                                            w-24
                                            rounded-full
                                            bg-violet-500/10
                                            blur-3xl
                                            transition-all
                                            duration-500
                                            group-hover:bg-violet-500/20
                                        "
                                    />

                                    {/* Active Glow */}
                                    {position === "center" && (
                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                inset-0
                                                rounded-2xl
                                                shadow-[0_0_50px_rgba(139,92,246,0.10),0_0_80px_rgba(59,130,246,0.06)]
                                            "
                                        />
                                    )}

                                    {/* Stars */}
                                    <div dir="ltr" className="relative mb-5 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={15} fill="currentColor" className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.35)]" />
                                        ))}
                                    </div>

                                    {/* Review */}
                                    <p className="relative min-h-[120px] text-sm leading-7 text-slate-300">«{review.review}»</p>

                                    {/* Student */}
                                    <div className="relative mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                                        {/* Avatar */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-sm font-bold text-violet-300">
                                            {review.name.charAt(0)}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-100">{review.name}</h3>

                                            <p dir="ltr" className="mt-0.5 text-xs text-slate-500">
                                                {review.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    type="button"
                    onClick={nextSlide}
                    className="
                        absolute right-0 top-1/2 z-30
                        flex h-9 w-9 -translate-y-1/2
                        items-center justify-center
                        rounded-full
                        border border-white/10
                        bg-white/[0.05]
                        text-slate-300
                        backdrop-blur-xl
                        transition-all duration-300
                        hover:scale-110
                        hover:border-violet-400/30
                        hover:bg-violet-400/10
                        hover:text-violet-400
                        sm:h-10 sm:w-10
                    "
                    aria-label="نظر بعدی"
                >
                    <ChevronRight size={18} className="sm:h-5 sm:w-5" />
                </button>
            </div>

            {/* Dots */}
            <div className="mt-4 flex justify-center gap-1.5">
                {reviews.map((review, i) => (
                    <button
                        key={review.id}
                        type="button"
                        onClick={() => updateCarousel(i)}
                        className={`
                            h-2.5
                            rounded-full
                            transition-all
                            duration-300
                            ${i === currentIndex ? "w-5 bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)] sm:w-6" : "w-2 bg-white/20 hover:bg-white/40 sm:w-2.5"}
                        `}
                        aria-label={`رفتن به نظر ${review.name}`}
                    />
                ))}
            </div>
        </section>
    );
}
