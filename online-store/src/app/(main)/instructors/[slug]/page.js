"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const toFa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const glass = "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl";

function SkillDial({ name, value }) {
    return (
        <div className="text-center">
            <div
                className="mx-auto mb-2 grid h-[76px] w-[76px] place-items-center rounded-full text-sm font-extrabold text-white"
                style={{
                    background: `radial-gradient(closest-side, #12122a 78%, transparent 80%), conic-gradient(#22D3EE, #FF2E93 ${value}%, rgba(255,255,255,0.08) 0)`,
                }}
            >
                {toFa(value)}٪
            </div>

            <span dir="ltr" className="block text-xs text-slate-400">
                {name}
            </span>
        </div>
    );
}

export default function TeacherPage() {
    const { slug } = useParams();

    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!slug) return;

        const fetchTeacher = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_URL}/Instructor/slug/${slug}`);

                if (!response.ok) {
                    const errorText = await response.text();

                    console.log("Instructor API Status:", response.status);
                    console.log("Instructor API Error:", errorText);
                    console.log("Requested Slug:", slug);

                    throw new Error(`خطای دریافت مدرس: ${response.status}`);
                }

                const data = await response.json();

                setTeacher(data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [slug]);

    if (loading) {
        return (
            <main dir="rtl" className="mx-auto w-full max-w-5xl px-5 pb-14 pt-32">
                <div className={`${glass} p-10 text-center text-slate-400`}>در حال دریافت اطلاعات مدرس...</div>
            </main>
        );
    }

    if (error || !teacher) {
        return (
            <main dir="rtl" className="mx-auto w-full max-w-5xl px-5 pb-14 pt-32">
                <div className={`${glass} p-10 text-center text-red-400`}>{error || "مدرس پیدا نشد."}</div>
            </main>
        );
    }

    const avatar = teacher.avatarId ? `${API_URL}/Files/${teacher.avatarId}` : "/images/instructors/default.jpg";

    return (
        <main dir="rtl" className="mx-auto w-full max-w-5xl px-5 pb-14 pt-32">
            {/* Hero */}
            <header className={`${glass} mb-6 overflow-hidden`}>
                <div className="h-36 bg-gradient-to-r from-[#22D3EE]/55 via-[#7C3AED]/35 to-[#FF2E93]/55" />

                <div className="-mt-14 flex flex-wrap items-end gap-6 px-5 pb-7 sm:px-8 max-sm:justify-center max-sm:text-center">
                    <div className="h-[120px] w-[120px] flex-none rounded-full bg-gradient-to-br from-[#22D3EE] to-[#FF2E93] p-[3px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatar} alt={teacher.userName} className="h-full w-full rounded-full border-4 border-[#0B0B1A] object-cover" />
                    </div>

                    <div className="min-w-[200px] flex-1 pt-14 max-sm:pt-0">
                        <h1 className="text-2xl font-extrabold text-white">{teacher.userName}</h1>

                        <p className="text-sm text-[#22D3EE]">{teacher.expertise}</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 max-sm:justify-center">
                        <a
                            href={`mailto:${teacher.email}`}
                            dir="ltr"
                            className="rounded-full border border-white/10 px-[18px] py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:border-[#22D3EE] hover:text-[#22D3EE]"
                        >
                            {teacher.email}
                        </a>

                        <Link
                            href="/courses"
                            className="rounded-full bg-gradient-to-l from-[#FF2E93] to-[#22D3EE] px-[18px] py-2.5 text-sm font-semibold text-[#0B0B1A] transition-opacity hover:opacity-90"
                        >
                            دوره‌های مدرس
                        </Link>
                    </div>
                </div>
            </header>

            {/* About + Skills */}
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1.4fr_1fr]">
                {/* About */}
                <section className={`${glass} p-7`}>
                    <h2 className="mb-4 text-[17px] font-extrabold text-white">
                        <span className="bg-gradient-to-l from-[#22D3EE] to-[#FF2E93] bg-clip-text text-transparent">دربارهٔ</span> من
                    </h2>

                    <p className="text-justify text-[15px] leading-8 text-slate-300">{teacher.bio || "اطلاعاتی ثبت نشده است."}</p>
                </section>

                {/* Skills */}
                <section className={`${glass} p-7`}>
                    <h2 className="mb-4 bg-gradient-to-l from-[#22D3EE] to-[#FF2E93] bg-clip-text text-[17px] font-extrabold text-transparent">مهارت‌ها</h2>

                    <div className="grid grid-cols-3 gap-x-2 gap-y-5">
                        {teacher.skills?.map((skill) => (
                            <SkillDial key={skill.name} name={skill.name} value={skill.value} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
