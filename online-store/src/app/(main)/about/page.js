import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Code2, Users, Rocket, BadgeCheck, Target, Eye, CircleCheck } from "lucide-react";

// ارزش‌های کدلند
const values = [
    {
        icon: Code2,
        title: "یادگیری با پروژه واقعی",
        text: "هر مفهوم را در یک پروژه عملی می‌سازید تا فقط تماشاچی نباشید.",
        color: "#22D3EE",
    },
    {
        icon: Users,
        title: "جامعه و پشتیبانی",
        text: "کنار مدرس و هم‌دوره‌ای‌ها هستید و جواب سؤال‌هایتان را سریع می‌گیرید.",
        color: "#FF2E93",
    },
    {
        icon: Rocket,
        title: "محتوای به‌روز",
        text: "دوره‌ها با تغییرات ابزارها و زبان‌ها هم‌قدم می‌مانند.",
        color: "#3B82F6",
    },
    {
        icon: BadgeCheck,
        title: "کیفیت مدرسین",
        text: "مدرس‌ها با تجربه کار واقعی در صنعت آموزش می‌دهند.",
        color: "#22D3EE",
    },
];

// اعضای تیم؛ image, github و linkedin اختیاری‌اند و فقط در صورت وجود نمایش داده می‌شوند
// نمونه: { name: "علی رضایی", role: "مدرس", color: "#22D3EE", image: "/team/ali.jpg", github: "https://github.com/...", linkedin: "https://linkedin.com/in/..." }
const team = [
    { name: "[نام عضو تیم]", role: "[سمت]", color: "#22D3EE" },
    { name: "[نام عضو تیم]", role: "[سمت]", color: "#FF2E93" },
    { name: "[نام عضو تیم]", role: "[سمت]", color: "#3B82F6" },
    { name: "[نام عضو تیم]", role: "[سمت]", color: "#22D3EE" },
];

// مزایای کدلند
const reasons = [
    "مسیر یادگیری مشخص از صفر تا پروژه نهایی",
    "آموزش کاملاً فارسی و بدون وابستگی به زبان دوم",
    "پروژه‌هایی که می‌توانید در رزومه نشان دهید",
    "پرسش و پاسخ با مدرس زیر هر دوره",
    "دسترسی همیشگی به دوره‌های خریداری‌شده",
    "پرداخت امن و پشتیبانی در همه مراحل",
];

// حلقه فوکوس کیبورد هماهنگ با پالت
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]";

// کارت شیشه‌ای؛ برای کارت‌های کوچک blur سبک‌تر پاس بدهید
function Glass({ children, className = "", style, blur = "backdrop-blur-xl" }) {
    return (
        <div style={style} className={`rounded-3xl border border-white/10 bg-white/5 ${blur} ${className}`}>
            {children}
        </div>
    );
}

// عنوان هر بخش
function SectionTitle({ children, color = "#22D3EE" }) {
    return (
        <div className="mb-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-8 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 16px ${color}` }} />

            <h2 className="text-2xl font-extrabold text-white md:text-3xl">{children}</h2>
        </div>
    );
}

// آیکون اختصاصی GitHub
function GithubIcon({ size = 20 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.3-2.61 5.25-5.1 5.52.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.53A11.1 11.1 0 0 0 12 .9Z" />
        </svg>
    );
}

// آیکون اختصاصی LinkedIn
function LinkedinIcon({ size = 20 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM8 18H5V9h3v9ZM6.5 7.73a1.74 1.74 0 1 1 0-3.48 1.74 1.74 0 0 1 0 3.48ZM19 18h-3v-4.38c0-1.05-.02-2.4-1.46-2.4-1.47 0-1.69 1.14-1.69 2.32V18h-3V9h2.88v1.23h.04c.4-.71 1.38-1.46 2.84-1.46 3.03 0 3.59 1.99 3.59 4.58V18Z" />
        </svg>
    );
}

export default function AboutPage() {
    return (
        <main dir="rtl" className="px-4 pb-24 pt-10 text-slate-200">
            {/* عنوان اصلی صفحه برای سئو و صفحه‌خوان‌ها */}
            <h1 className="sr-only">درباره کدلند</h1>

            <div className="mx-auto flex max-w-5xl flex-col gap-20">
                {/* مسیر صفحه */}
                <nav aria-label="مسیر صفحه" className="flex items-center gap-2 text-sm text-slate-400">
                    <Link href="/" className={`rounded transition-colors hover:text-[#22D3EE] ${focusRing}`}>
                        کدلند
                    </Link>

                    <ChevronLeft size={16} aria-hidden="true" />

                    <span aria-current="page" className="text-[#FF2E93]">
                        درباره ما
                    </span>
                </nav>

                {/* بخش اول: درباره کدلند */}
                <section aria-labelledby="about-title">
                    <SectionTitle>
                        <span id="about-title">درباره کدلند</span>
                    </SectionTitle>

                    <Glass className="p-8 md:p-10">
                        <p className="max-w-3xl text-lg leading-[2.2] text-slate-300">
                            کدلند یک پلتفرم آموزش برنامه‌نویسی فارسی است. ما تلاش می‌کنیم یادگیری برنامه‌نویسی را ساده‌تر، کاربردی‌تر و قابل‌دسترس‌تر کنیم تا بتوانید با تمرین و ساخت پروژه‌های واقعی،
                            مهارت‌های خود را توسعه دهید.
                        </p>

                        <div className="mt-8 grid gap-5 md:grid-cols-2">
                            {/* مأموریت */}
                            <div className="rounded-2xl border border-[#22D3EE]/40 bg-[#22D3EE]/5 p-6 shadow-[0_0_32px_rgba(34,211,238,0.12)]">
                                <h3 className="mb-3 flex items-center gap-2 font-bold text-[#22D3EE]">
                                    <Target size={20} aria-hidden="true" />
                                    مأموریت
                                </h3>

                                <p className="leading-8 text-slate-300">فراهم‌کردن مسیری روشن برای یادگیری برنامه‌نویسی، از مفاهیم پایه تا ساخت پروژه‌های کاربردی، با آموزش فارسی و تمرین‌های عملی.</p>
                            </div>

                            {/* چشم‌انداز */}
                            <div className="rounded-2xl border border-[#FF2E93]/40 bg-[#FF2E93]/5 p-6 shadow-[0_0_32px_rgba(255,46,147,0.12)]">
                                <h3 className="mb-3 flex items-center gap-2 font-bold text-[#FF2E93]">
                                    <Eye size={20} aria-hidden="true" />
                                    چشم‌انداز
                                </h3>

                                <p className="leading-8 text-slate-300">ایجاد فضایی برای رشد برنامه‌نویسان، تقویت مهارت‌های فنی و تبدیل دانش به تجربه‌ای واقعی در دنیای فناوری.</p>
                            </div>
                        </div>
                    </Glass>
                </section>

                {/* بخش دوم: ارزش‌های کدلند */}
                <section>
                    <SectionTitle color="#FF2E93">ارزش‌های کدلند</SectionTitle>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((v) => (
                            <Glass
                                key={v.title}
                                blur="backdrop-blur-md"
                                className="p-6 transition-shadow duration-300 motion-reduce:transition-none"
                                style={{ borderColor: `${v.color}55`, boxShadow: `0 0 28px ${v.color}14` }}
                            >
                                <div
                                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                                    style={{
                                        background: `${v.color}1A`,
                                        color: v.color,
                                        boxShadow: `0 0 24px ${v.color}40`,
                                    }}
                                >
                                    <v.icon size={24} aria-hidden="true" />
                                </div>

                                <h3 className="mb-2 text-lg font-bold text-white">{v.title}</h3>

                                <p className="text-sm leading-7 text-slate-400">{v.text}</p>
                            </Glass>
                        ))}
                    </div>
                </section>

                {/* بخش سوم: تیم کدلند */}
                <section>
                    <SectionTitle color="#3B82F6">تیم کدلند</SectionTitle>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {team.map((m, i) => (
                            <Glass key={i} blur="backdrop-blur-md" className="p-7 text-center">
                                {/* تصویر یا آواتار عضو تیم */}
                                <div
                                    className="relative mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-2 bg-white/5"
                                    style={{
                                        borderColor: m.color,
                                        boxShadow: `0 0 28px ${m.color}73`,
                                    }}
                                >
                                    {m.image ? <Image src={m.image} alt={m.name} fill sizes="112px" className="object-cover" /> : <Users size={36} style={{ color: m.color }} aria-hidden="true" />}
                                </div>

                                <div className="font-bold text-white">{m.name}</div>

                                <div className="mt-1 text-sm text-slate-400">{m.role}</div>

                                {/* شبکه‌های اجتماعی؛ فقط در صورت وجود لینک */}
                                {(m.github || m.linkedin) && (
                                    <div className="mt-4 flex justify-center gap-1 text-slate-400">
                                        {m.github && (
                                            <a
                                                href={m.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`گیت‌هاب ${m.name}`}
                                                title="GitHub"
                                                className={`rounded-lg p-2 transition-colors hover:text-[#22D3EE] ${focusRing}`}
                                            >
                                                <GithubIcon />
                                            </a>
                                        )}

                                        {m.linkedin && (
                                            <a
                                                href={m.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`لینکدین ${m.name}`}
                                                title="LinkedIn"
                                                className={`rounded-lg p-2 transition-colors hover:text-[#FF2E93] ${focusRing}`}
                                            >
                                                <LinkedinIcon />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </Glass>
                        ))}
                    </div>
                </section>

                {/* بخش چهارم: چرا کدلند؟ */}
                <section>
                    <SectionTitle>چرا کدلند؟</SectionTitle>

                    <Glass className="p-8 md:p-10">
                        <ul className="grid gap-x-10 gap-y-5 md:grid-cols-2">
                            {reasons.map((r) => (
                                <li key={r} className="flex items-start gap-3 leading-8">
                                    <CircleCheck size={22} aria-hidden="true" className="mt-1 shrink-0 text-[#22D3EE]" />

                                    <span className="text-slate-300">{r}</span>
                                </li>
                            ))}
                        </ul>

                        {/* دعوت به مشاهده دوره‌ها */}
                        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-[#FF2E93]/40 bg-[#FF2E93]/5 p-8 text-center shadow-[0_0_48px_rgba(255,46,147,0.15)]">
                            <h3 className="text-xl font-extrabold text-white">اولین خط کدتان را همین امروز بنویسید</h3>

                            <p className="max-w-lg leading-7 text-slate-400">مسیر یادگیری خود را انتخاب کنید و قدم اول را برای تبدیل‌شدن به یک برنامه‌نویس بردارید.</p>

                            <Link
                                href="/courses"
                                className={`rounded-xl bg-[#FF2E93] px-10 py-3 font-extrabold text-[#07060F] shadow-[0_0_32px_rgba(255,46,147,0.5)] transition hover:brightness-110 motion-reduce:transition-none ${focusRing}`}
                            >
                                مشاهده دوره‌ها
                            </Link>
                        </div>
                    </Glass>
                </section>
            </div>
        </main>
    );
}
