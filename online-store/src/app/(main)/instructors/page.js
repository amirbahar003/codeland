"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function InstructorCard({ instructor }) {
    return (
        <article className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={instructor.avatar} alt={instructor.name} className="mx-auto mb-5 h-32 w-32 rounded-full object-cover ring-2 ring-[#22D3EE]/70" />

            <h3 className="mb-1 text-lg font-bold text-white">{instructor.name}</h3>

            <a href={`mailto:${instructor.email}`} dir="ltr" className="mb-6 block truncate text-sm text-slate-400 transition-colors hover:text-[#22D3EE]">
                {instructor.email}
            </a>

            <Link
                href={instructor.resumeUrl}
                className="block w-full rounded-xl border border-[#FF2E93]/60 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF2E93]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
            >
                مشاهده رزومه
            </Link>
        </article>
    );
}

export default function InstructorsSection() {
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Instructor`);

                if (!response.ok) {
                    throw new Error("Failed to fetch instructors");
                }

                const data = await response.json();

                const formattedInstructors = data.map((instructor) => ({
                    id: instructor.id,
                    slug: instructor.slug,
                    name: instructor.userName,
                    email: instructor.email,
                    avatar: instructor.avatarId ? `${process.env.NEXT_PUBLIC_API_URL}/Files/${instructor.avatarId}` : "/images/instructors/default.jpg",
                    resumeUrl: `/instructors/${instructor.slug}`,
                }));

                setInstructors(formattedInstructors);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };

        fetchInstructors();
    }, []);
    return (
        <section dir="rtl" className="mx-auto w-full max-w-6xl px-4 pt-36 pb-16">
            {/* Section Header */}
            <div className="mb-12 flex items-center gap-4">
                {/* Right Line */}
                <div className="relative h-px flex-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-l from-[#22D3EE]/70 via-[#22D3EE]/30 to-transparent" />

                    <div className="absolute right-0 top-1/2 h-2 w-32 -translate-y-1/2 bg-[#22D3EE]/20 blur-md" />
                </div>

                {/* Title */}
                <h2
                    className="
            whitespace-nowrap
            px-2
            text-2xl
            font-extrabold
            text-white
            drop-shadow-[0_0_18px_rgba(34,211,238,0.12)]
        "
                >
                    مدرسین
                </h2>

                {/* Left Line */}
                <div className="relative h-px flex-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E93]/70 via-[#FF2E93]/30 to-transparent" />

                    <div className="absolute left-0 top-1/2 h-2 w-32 -translate-y-1/2 bg-[#FF2E93]/20 blur-md" />
                </div>
            </div>
            {/* Instructors */}
            <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {instructors.map((instructor) => (
                    <InstructorCard key={instructor.id} instructor={instructor} />
                ))}
            </div>
        </section>
    );
}
