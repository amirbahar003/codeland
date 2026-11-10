import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, ClipboardList, Clock, ChevronLeft } from "lucide-react";

const fa = (n) => n.toLocaleString("fa-IR", { useGrouping: false });

const defaultStats = [
    { icon: <User size={28} strokeWidth={1.6} />, value: 34262, label: "دانشجو" },
    { icon: <ClipboardList size={28} strokeWidth={1.6} />, value: 17, label: "دوره تخصصی" },
    { icon: <Clock size={28} strokeWidth={1.6} />, value: 498, label: "ساعت آموزش" },
];

const defaultCrumbs = [{ label: "خانه", href: "/" }, { label: "همه دوره‌های آموزشی" }];

export default function CoursesHeader({ title = "همه دوره‌های آموزشی", crumbs = defaultCrumbs, stats = defaultStats }) {

   const pathname=usePathname();
   const courseSlug = pathname.split("/")[2];

const courseNames = {
    "front-end": "فرانت‌اند",
    "back-end": "بک‌اند",
    "full-stack": "فول‌استک",
    javascript: "جاوااسکریپت",
    react: "React",
    nextjs: "Next.js",
};    
const dynamicCrumbs =
    courseSlug && courseNames[courseSlug]
        ? [
              { label: "خانه", href: "/" },
              { label: "همه دوره‌های آموزشی", href: "/courses" },
              { label: courseNames[courseSlug] },
          ]
        : crumbs;
    return (
        <section dir="rtl" className="mx-auto w-full max-w-[1600px] px-4 pt-32 sm:px-6 sm:pt-40">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-6 px-2 sm:px-5">
                <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/50">
                    {dynamicCrumbs.map((c, i) => {
                        const last = i === dynamicCrumbs.length - 1;

                        return (
                            <li key={c.label} className="flex items-center gap-2">
                                {c.href && !last ? (
                                    <Link href={c.href} className="transition-colors hover:text-[#A78BFA]">
                                        {c.label}
                                    </Link>
                                ) : (
                                    <span aria-current="page" className="font-medium text-white">
                                        {c.label}
                                    </span>
                                )}

                                {!last && <ChevronLeft size={14} aria-hidden="true" />}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* Header card */}
            <div className="relative">
                {/* باکس‌های رنگی دو طرف کارت */}
                <span
                    aria-hidden="true"
                    className="absolute -right-2 top-14 hidden h-[200px] w-8 rounded-2xl
                     bg-gradient-to-b from-[#8B5CF6] to-[#3B82F6]
                     shadow-[0_0_40px_-6px_rgba(139,92,246,.7)] sm:block"
                />

                <span
                    aria-hidden="true"
                    className="absolute -left-2 top-14 hidden h-[200px] w-8 rounded-2xl
                     bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6]
                     shadow-[0_0_40px_-6px_rgba(59,130,246,.7)] sm:block"
                />

                <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#100D24] px-6 py-10 sm:px-10 sm:py-12">
                    {/* درخشش پس‌زمینه */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0
                       bg-[radial-gradient(600px_220px_at_15%_0%,rgba(139,92,246,.28),transparent_70%),radial-gradient(600px_220px_at_85%_100%,rgba(59,130,246,.25),transparent_70%)]"
                    />

                    <h1 className="relative text-center text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>

                    <ul className="relative mt-12 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 sm:mt-16">
                        {stats.map((s) => (
                            <li key={s.label} className="flex items-center gap-4">
                                <span
                                    className="grid h-16 w-16 place-items-center rounded-xl
                             border border-white/10 bg-white/[0.06] text-[#C4B5FD]
                             shadow-[inset_0_0_20px_rgba(139,92,246,.18)]"
                                >
                                    {s.icon}
                                </span>

                                <div className="text-right">
                                    <div dir="ltr" className="bg-gradient-to-l from-[#A78BFA] to-[#60A5FA] bg-clip-text text-lg font-bold text-transparent">
                                        {fa(s.value)}+
                                    </div>

                                    <div className="mt-1 text-[15px] text-white/60">{s.label}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
