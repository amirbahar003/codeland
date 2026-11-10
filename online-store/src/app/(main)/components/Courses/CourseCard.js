import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CoursesCard from "./CoursesCard";


// داده‌ی نمونه — بعداً از API / دیتابیس بیاور
const latestCourses = [
    {
        id: 1,
        title: "آموزش جامع زبان C++",
        href: "/courses/cpp",
        cover: "/images/cpp-course.jpg",
        category: "C++",
        badge: "پرفروش",
        teacher: "امیر علی",
        description: "از مفاهیم پایه تا ساخت پروژه‌های واقعی، همه‌چیز را از صفر یاد بگیرید.",
        level: 2,
        hours: 16,
        students: 1280,
        rating: 4.9,
        price: 1250000,
        oldPrice: 2500000,
    },
    {
        id: 2,
        title: "دوره جامع Node.js و Express",
        href: "/courses/nodejs",
        glyph: "Node",
        category: "بک اند",
        badge: "جدید",
        teacher: "علی رضایی",
        description: "ساخت API حرفه‌ای، احراز هویت و دیتابیس با پروژه‌ی واقعی در پایان دوره.",
        level: 2,
        hours: 42,
        students: 3210,
        rating: 4.8,
        price: 1470000,
        oldPrice: 2100000,
    },
    {
        id: 3,
        title: "آموزش PHP از صفر",
        href: "/courses/php",
        glyph: "PHP",
        category: "پی اچ پی",
        teacher: "رضا نوری",
        description: "مقدمات زبان، فرم‌ها و کار با دیتابیس؛ مناسب شروع مسیر بک اند.",
        level: 1,
        hours: 12,
        students: 9650,
        rating: 4.7,
        price: 0,
    },
];

export default function LatestCourses() {
    return (
        <section dir="rtl" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            {/* عنوان سکشن */}
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-3 text-2xl font-extrabold text-white sm:text-3xl">
                        <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[#22D3EE] to-[#FF2E93]" />
                        جدیدترین دوره‌ها
                    </h2>
                    <p className="mt-2 text-sm text-white/50">تازه‌ترین دوره‌های پروژه‌محور کدلند</p>
                </div>

                <Link href="/courses" className="group flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-[#22D3EE]">
                    مشاهده همه دوره‌ها
                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
            </div>

            {/* گرید سه‌تایی */}
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
                {latestCourses.map((course, i) => (
                    <CoursesCard key={course.id} course={course} variant={i} />
                ))}
            </div>
        </section>
    );
}
