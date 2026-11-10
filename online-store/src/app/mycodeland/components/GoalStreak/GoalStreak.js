
"use client";

import { useEffect, useState } from "react";
import { Flame, Target, Pencil } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const toFa = (n) =>
    String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const WEEK = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export default function GoalStreak() {
    const [stats, setStats] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // دریافت آمار یادگیری از بک‌اند
    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/LearningStats`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        response.status === 401
                            ? "برای مشاهده آمار، ابتدا وارد حساب شو."
                            : "دریافت آمار یادگیری ناموفق بود."
                    );
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message || "خطا در ارتباط با سرور");
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    // تغییر و ذخیره هدف هفتگی
    async function updateGoal(hours) {
        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                `${API_URL}/LearningStats/goal`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        goalMinutes: hours * 60,
                    }),
                }
            );

            if (!response.ok) {
                const result = await response.json().catch(() => null);

                throw new Error(
                    result?.message || "ذخیره هدف هفتگی ناموفق بود."
                );
            }

            const data = await response.json();

            setStats(data);
            setEditing(false);
        } catch (err) {
            setError(err.message || "خطا در ذخیره هدف");
        } finally {
            setSaving(false);
        }
    }

    // حالت بارگذاری
    if (loading) {
        return (
            <section
                dir="rtl"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300"
            >
                در حال دریافت آمار یادگیری...
            </section>
        );
    }

    // حالت خطا
    if (error && !stats) {
        return (
            <section
                dir="rtl"
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
                <p className="text-sm text-rose-400">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm text-white"
                >
                    تلاش مجدد
                </button>
            </section>
        );
    }

    if (!stats) return null;

    const goalMinutes = stats.weeklyGoalMinutes;
    const goalHours = goalMinutes / 60;
    const doneMinutes = stats.completedMinutesThisWeek;

    const percent = Math.min(
        100,
        Math.round(stats.weeklyProgressPercentage)
    );

    const remaining = Math.max(0, goalMinutes - doneMinutes);

    const streak = stats.currentStreak;
    const best = stats.bestStreak;

    // محاسبه روزهای فعال هفته جاری؛ هفته از شنبه شروع می‌شود
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayIndex = (today.getDay() + 1) % 7;

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - todayIndex);

    const activeDays = WEEK.map((_, dayIndex) => {
        const targetDate = new Date(weekStart);
        targetDate.setDate(weekStart.getDate() + dayIndex);

        return stats.activities.some((activity) => {
            const activityDate = new Date(activity.completedAtUtc);
            activityDate.setHours(0, 0, 0, 0);

            return activityDate.getTime() === targetDate.getTime();
        });
    });

    const R = 52;
    const C = 2 * Math.PI * R;

    return (
        <section
            dir="rtl"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
            {/* هدف هفتگی */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                        <Target className="h-5 w-5 text-cyan-400" />
                        هدف هفتگی
                    </h3>

                    <button
                        onClick={() => setEditing((v) => !v)}
                        disabled={saving}
                        className="flex items-center gap-1 text-xs text-slate-400 transition hover:text-cyan-400 disabled:opacity-50"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        تغییر هدف
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative h-32 w-32 shrink-0">
                        <svg
                            viewBox="0 0 120 120"
                            className="h-full w-full -rotate-90"
                        >
                            <defs>
                                <linearGradient
                                    id="goalGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#22D3EE" />
                                    <stop offset="100%" stopColor="#FF2E93" />
                                </linearGradient>
                            </defs>

                            <circle
                                cx="60"
                                cy="60"
                                r={R}
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="10"
                            />

                            <circle
                                cx="60"
                                cy="60"
                                r={R}
                                fill="none"
                                stroke="url(#goalGrad)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={C}
                                strokeDashoffset={C - (C * percent) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-white">
                                {toFa(percent)}٪
                            </span>
                            <span className="text-[11px] text-slate-400">
                                تکمیل شده
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-white">
                            <span className="text-xl font-bold">
                                {toFa(doneMinutes / 60)}
                            </span>
                            <span className="text-sm text-slate-400">
                                {" "}از {toFa(goalHours)} ساعت
                            </span>
                        </p>

                        <p className="text-sm text-slate-400">
                            {remaining > 0
                                ? `${toFa(remaining)} دقیقه تا رسیدن به هدفت`
                                : "هدف این هفته را کامل کردی 🎉"}
                        </p>
                    </div>
                </div>

                {editing && (
                    <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                        {[1, 3, 5, 7].map((h) => (
                            <button
                                key={h}
                                disabled={saving}
                                onClick={() => updateGoal(h)}
                                className={`flex-1 rounded-lg py-2 text-sm transition disabled:opacity-50 ${
                                    goalHours === h
                                        ? "bg-cyan-400 font-bold text-slate-900"
                                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                                }`}
                            >
                                {toFa(h)} ساعت
                            </button>
                        ))}
                    </div>
                )}

                {saving && (
                    <p className="mt-3 text-xs text-cyan-300">
                        در حال ذخیره هدف...
                    </p>
                )}

                {error && (
                    <p className="mt-3 text-xs text-rose-400">
                        {error}
                    </p>
                )}
            </div>

            {/* استمرار یادگیری */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                        <Flame className="h-5 w-5 text-pink-500" />
                        استمرار یادگیری
                    </h3>

                    <span className="text-xs text-slate-400">
                        رکورد: {toFa(best)} روز
                    </span>
                </div>

                <div className="mb-6 flex items-end gap-2">
                    <span className="text-5xl font-extrabold text-white">
                        {toFa(streak)}
                    </span>
                    <span className="pb-1.5 text-slate-400">
                        روز متوالی
                    </span>
                </div>

                <div className="flex justify-between">
                    {WEEK.map((day, i) => {
                        const active = activeDays[i];
                        const isToday = i === todayIndex;

                        return (
                            <div
                                key={day}
                                className="flex flex-col items-center gap-2"
                            >
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs transition ${
                                        active
                                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                                            : isToday
                                            ? "animate-pulse border-pink-500 text-pink-400"
                                            : "border-white/10 text-slate-600"
                                    }`}
                                >
                                    {active ? "✓" : ""}
                                </div>

                                <span
                                    className={`text-xs ${
                                        isToday
                                            ? "text-pink-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {day}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
