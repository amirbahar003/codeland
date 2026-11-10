"use client";

import { SiHtml5, SiJavascript, SiReact, SiNextdotjs, SiNodedotjs, SiPython, SiSharp, SiDotnet } from "react-icons/si";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fa = (n) => Number(n).toLocaleString("fa-IR");

const categories = [
    { id: 1, title: "HTML & CSS", href: "/courses?category=html-css", icon: SiHtml5, courses: 8 },
    { id: 2, title: "JavaScript", href: "/courses?category=javascript", icon: SiJavascript, courses: 8 },
    { id: 3, title: "React", href: "/courses?category=react", icon: SiReact, courses: 4 },
    { id: 4, title: "Next.js", href: "/courses?category=nextjs", icon: SiNextdotjs, courses: 5 },
    { id: 5, title: "Node.js", href: "/courses?category=nodejs", icon: SiNodedotjs, courses: 3 },
    { id: 6, title: "Python", href: "/courses?category=python", icon: SiPython, courses: 6 },
    { id: 7, title: "C#", href: "/courses?category=csharp", icon: SiSharp, courses: 5 },
    { id: 8, title: "ASP.NET Core", href: "/courses?category=aspnet-core", icon: SiDotnet, courses: 4 },
];

export default function CourseCategories() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef(null);

    const updateCarousel = useCallback(
        (newIndex) => {
            if (isAnimating) return;
            setIsAnimating(true);
            setCurrentIndex((newIndex + categories.length) % categories.length);
            setTimeout(() => setIsAnimating(false), 500);
        },
        [isAnimating]
    );

    const nextSlide = () => updateCarousel(currentIndex + 1);
    const prevSlide = () => updateCarousel(currentIndex - 1);

    // Keyboard — فقط وقتی فوکوس یا هاور روی همین سکشن است، نه کل صفحه
    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;

        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
            if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
        };

        node.addEventListener("keydown", handleKeyDown);
        return () => node.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, updateCarousel]);

    // Touch / Swipe — فقط روی همین سکشن، نه کل document
    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;

        let touchStartX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            if (Math.abs(diff) > swipeThreshold) {
                updateCarousel(diff > 0 ? currentIndex + 1 : currentIndex - 1);
            }
        };

        node.addEventListener("touchstart", handleTouchStart);
        node.addEventListener("touchend", handleTouchEnd);
        return () => {
            node.removeEventListener("touchstart", handleTouchStart);
            node.removeEventListener("touchend", handleTouchEnd);
        };
    }, [currentIndex, updateCarousel]);

    return (
        <section ref={sectionRef} dir="rtl" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="دسته‌بندی دوره‌ها" className="relative overflow-hidden py-24 outline-none">
            {/* Section Header */}
            <div className="mx-auto mb-12 w-[92%] max-w-7xl">
                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#22D3EE]/70 to-[#FF2E93]/70" />
                    <h2 className="whitespace-nowrap text-xl font-extrabold text-white sm:text-2xl md:text-3xl">
                        دسته‌بندی <span className="bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#FF2E93] bg-clip-text text-transparent">دوره‌ها</span>
                    </h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-[#22D3EE]/70 to-[#FF2E93]/70" />
                </div>
            </div>

            {/* Carousel */}
            <div className="relative mx-auto h-[300px] w-[92%] max-w-7xl sm:h-[280px] md:h-[300px]">
                {/* Left Arrow */}
                <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="دسته‌بندی قبلی"
                    className="absolute left-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#22D3EE]/40 hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] sm:h-10 sm:w-10"
                >
                    <ChevronLeft size={18} className="sm:h-5 sm:w-5" />
                </button>

                {/* Track */}
                <div className="relative flex h-full items-center justify-center">
                    {categories.map((category, i) => {
                        const Icon = category.icon;
                        const offset = (i - currentIndex + categories.length) % categories.length;

                        let position = "hidden";
                        if (offset === 0) position = "center";
                        else if (offset === 1) position = "right-1";
                        else if (offset === 2) position = "right-2";
                        else if (offset === categories.length - 1) position = "left-1";
                        else if (offset === categories.length - 2) position = "left-2";

                        const positionClasses = {
                            center: `z-20 scale-105 sm:scale-110 opacity-100`,
                            "left-1": `z-10 -translate-x-[100px] sm:-translate-x-[140px] md:-translate-x-[180px] lg:-translate-x-[210px] scale-90 opacity-80`,
                            "left-2": `z-[5] hidden sm:block -translate-x-[280px] md:-translate-x-[350px] lg:-translate-x-[400px] scale-80 opacity-50`,
                            "right-1": `z-10 translate-x-[100px] sm:translate-x-[140px] md:translate-x-[180px] lg:translate-x-[210px] scale-90 opacity-80`,
                            "right-2": `z-[5] hidden sm:block translate-x-[280px] md:translate-x-[350px] lg:translate-x-[400px] scale-80 opacity-50`,
                            hidden: `pointer-events-none opacity-0 scale-75`,
                        };

                        const isCenter = position === "center";

                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => updateCarousel(i)}
                                aria-current={isCenter}
                                aria-label={`${category.title} — ${fa(category.courses)} دوره`}
                                className={`group absolute w-[180px] cursor-pointer text-right transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] sm:w-[200px] md:w-[220px] ${positionClasses[position]}`}
                            >
                                <div
                                    className={`relative flex h-[190px] flex-col items-center justify-center overflow-hidden rounded-2xl border bg-white/[0.035] backdrop-blur-xl transition-all duration-300 group-hover:bg-white/[0.06] sm:h-[205px] md:h-[220px] ${
                                        isCenter ? "border-[#22D3EE]/30 group-hover:border-[#FF2E93]/40" : "border-white/10 group-hover:border-[#FF2E93]/30"
                                    }`}
                                >
                                    {/* Glow */}
                                    <div className="pointer-events-none absolute -top-20 h-32 w-32 rounded-full bg-[#3B82F6]/10 blur-3xl transition-all duration-500 group-hover:bg-[#FF2E93]/20" />

                                    {/* Active Glow */}
                                    {isCenter && <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.14),0_0_80px_rgba(255,46,147,0.10)]" />}

                                    {/* Icon */}
                                    <div
                                        className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border bg-white/[0.06] text-3xl shadow-[0_0_30px_rgba(34,211,238,0.10)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#FF2E93]/40 group-hover:text-[#F472B6] ${
                                            isCenter ? "scale-110 border-[#22D3EE]/40 text-[#22D3EE]" : "border-white/10 text-white/60"
                                        }`}
                                    >
                                        <Icon />
                                    </div>

                                    {/* Title */}
                                    <h3 className="relative text-base font-bold text-white">{category.title}</h3>

                                    {/* Courses */}
                                    <span className="relative mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/50">{fa(category.courses)} دوره آموزشی</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="دسته‌بندی بعدی"
                    className="absolute right-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#22D3EE]/40 hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] sm:h-10 sm:w-10"
                >
                    <ChevronRight size={18} className="sm:h-5 sm:w-5" />
                </button>
            </div>

            {/* Dots */}
            <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="رفتن به دسته‌بندی">
                {categories.map((category, i) => (
                    <button
                        key={category.id}
                        type="button"
                        role="tab"
                        aria-selected={i === currentIndex}
                        onClick={() => updateCarousel(i)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                            i === currentIndex ? "w-5 bg-gradient-to-r from-[#22D3EE] to-[#FF2E93] shadow-[0_0_10px_rgba(255,46,147,0.5)] sm:w-6" : "w-2 bg-white/20 hover:bg-white/40 sm:w-2.5"
                        }`}
                        aria-label={`رفتن به ${category.title}`}
                    />
                ))}
            </div>
        </section>
    );
}
