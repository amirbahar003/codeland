"use client";
import Link from "next/link";
import { BookOpen, MessagesSquare, Mail, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const fa = (n) => Number(n).toLocaleString("fa-IR");

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultStats = {
    courses: 0,
    questions: 0,
    tickets: 0,
    wallet: 0,
};

export default function StatsStrip() {
    const [stats, setStats] = useState(defaultStats);

    useEffect(() => {
        async function fetchMyCourses() {
            try {
                const response = await fetch(`${API_URL}/Enrollments/my-course`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("دریافت دوره‌های کاربر ناموفق بود.");
                }

                const courses = await response.json();

                setStats((prev) => ({
                    ...prev,
                    courses: Array.isArray(courses) ? courses.length : 0,
                }));
            } catch (error) {
                console.error("خطا در دریافت دوره‌های من:", error);
            }
        }

        async function fetchMyWallet() {
            try {
                const response = await fetch(`${API_URL}/Wallet`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("دریافت موجودی کیف پول ناموفق بود.");
                }

                const wallet = await response.json();

                setStats((prev) => ({
                    ...prev,
                    wallet: wallet.balance ?? 0,
                }));
            } catch (error) {
                console.error("خطا در دریافت موجودی کیف پول:", error);
            }
        }

        fetchMyCourses();
        fetchMyWallet();
    }, []);

    const items = [
        {
            href: "/dashboard/courses",
            icon: BookOpen,
            value: fa(stats.courses),
            unit: "دوره",
            label: "دوره‌های من",
            tone: "text-[#22D3EE] bg-[#22D3EE]/15",
        },
        {
            href: "/dashboard/qa",
            icon: MessagesSquare,
            value: fa(stats.questions),
            unit: "پرسش",
            label: "پرسش و پاسخ",
            tone: "text-[#8B5CF6] bg-[#8B5CF6]/15",
        },
        {
            href: "/dashboard/tickets",
            icon: Mail,
            value: fa(stats.tickets),
            unit: "تیکت",
            label: "تیکت‌ها",
            tone: "text-[#FF2E93] bg-[#FF2E93]/15",
        },
        {
            href: "/mycodeland/transactions",
            icon: Wallet,
            value: fa(stats.wallet),
            unit: "تومان",
            label: "کیف پول",
            tone: "text-[#22D3EE] bg-[#22D3EE]/15",
        },
    ];

    return (
        <section dir="rtl" aria-label="خلاصه وضعیت" className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md lg:grid-cols-4">
            {items.map(({ href, icon: Icon, value, unit, label, tone }) => (
                <Link
                    key={href}
                    href={href}
                    className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/60"
                >
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform
              group-hover:scale-105 ${tone}`}
                    >
                        <Icon size={28} strokeWidth={1.6} />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                            {value} <span className="text-xs font-normal text-white/70">{unit}</span>
                        </p>
                        <p className="mt-1 truncate text-sm text-white/50">{label}</p>
                    </div>
                </Link>
            ))}
        </section>
    );
}
