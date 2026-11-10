import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaTelegramPlane } from "react-icons/fa";
import { Mail, AtSign } from "lucide-react";

const usefulLinks = [
    { label: "قوانین و مقررات", href: "/terms" },
    { label: "تیکت پشتیبانی", href: "/support" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
];

const courses = [
    { label: "آموزش CSS", href: "/courses/css" },
    { label: "آموزش HTML", href: "/courses/html" },
    { label: "آموزش جاوااسکریپت", href: "/courses/javascript" },
    { label: "آموزش پایتون", href: "/courses/python" },
];

const socials = [
    { label: "Telegram", href: "#", Icon: FaTelegramPlane },
    { label: "Instagram", href: "#", Icon: FaInstagram },
    { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
];

/* عنوان ستون‌ها با نوار گرادیانی کنارش */
function ColumnTitle({ children }) {
    return (
        <h3 className="mb-6 flex items-center gap-2.5 text-lg font-bold text-white">
            <span aria-hidden="true" className="h-4 w-1 rounded-full bg-gradient-to-b from-[#22D3EE] to-[#FF2E93]" />
            {children}
        </h3>
    );
}

/* لیست لینک‌ها (برای «لینک های مفید» و «دوره های پیشنهادی») */
function LinkList({ items }) {
    return (
        <ul className="space-y-4">
            {items.map(({ label, href }) => (
                <li key={label}>
                    <Link href={href} className="group flex w-fit items-center gap-2.5 text-sm text-white/60 transition-all duration-300 hover:text-white hover:-translate-x-1">
                        <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#22D3EE] to-[#FF2E93] transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_10px_rgba(255,46,147,.8)]"
                        />
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function Footer() {
    return (
        <footer dir="rtl" className="relative isolate mt-24 px-4 pb-6 sm:px-6">
            {/* درخشش پس‌زمینه: صورتی سمت راست، آبی سمت چپ */}
            <div aria-hidden="true" className="absolute right-8 top-0 -z-10 h-40 w-1/3 rounded-full bg-[#FF2E93] opacity-30 blur-3xl sm:right-10" />
            <div aria-hidden="true" className="absolute left-8 top-10 -z-10 h-40 w-1/3 rounded-full bg-[#22D3EE] opacity-20 blur-3xl sm:left-10" />

            {/* Main Footer */}
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-[#0C0924] px-6 py-10 shadow-2xl shadow-[#FF2E93]/10 sm:px-10 lg:px-12">
                {/* خط نئونی بالای کارت */}
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#22D3EE,#FF2E93,transparent)] shadow-[0_0_24px_2px_rgba(255,46,147,.45)]" />

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* About */}
                    <div>
                        <ColumnTitle>درباره ما</ColumnTitle>
                        <p className="text-sm leading-8 text-white/60">
                            شروع هر چیزی سخته، ولی وقتی مسیر درست رو انتخاب کنی، با خیال راحت و بدون استرس می‌تونی از مسیر لذت ببری. ما در کدلند تلاش می‌کنیم تجربه یادگیری برنامه‌نویسی رو برای شما
                            ساده و لذت‌بخش کنیم.
                        </p>
                    </div>

                    {/* Useful Links */}
                    <nav aria-label="لینک های مفید">
                        <ColumnTitle>لینک های مفید</ColumnTitle>
                        <LinkList items={usefulLinks} />
                    </nav>

                    {/* Courses */}
                    <nav aria-label="دوره های پیشنهادی">
                        <ColumnTitle>دوره های پیشنهادی</ColumnTitle>
                        <LinkList items={courses} />
                    </nav>

                    {/* Contact */}
                    <div>
                        <ColumnTitle>ارتباط با ما</ColumnTitle>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <AtSign size={17} className="shrink-0 text-[#F472B6]" />
                                <span dir="ltr">codeland_support</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <Mail size={17} className="shrink-0 text-[#22D3EE]" />
                                <span dir="ltr">info@codeland.ir</span>
                            </li>
                        </ul>

                        <div className="mt-6 flex gap-3">
                            {socials.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70
                                               transition-all duration-300 hover:-translate-y-1 hover:border-transparent
                                               hover:bg-gradient-to-br hover:from-[#3B82F6] hover:to-[#FF2E93] hover:text-white
                                               hover:shadow-[0_0_22px_-4px_rgba(255,46,147,.7)]"
                                >
                                    <Icon size={19} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.04] px-5 py-5 text-center sm:flex-row sm:text-right">
                    <p dir="ltr" className="text-xs text-white/50 sm:text-sm">
                        Built pixel by pixel by <span className="font-medium text-white">Amir Bahar</span> <span className="text-[#FF2E93]">♥</span>
                    </p>

                    <p className="text-xs text-white/50 sm:text-sm">
                        © تمامی حقوق مادی و معنوی این سایت برای <span className="bg-gradient-to-r from-[#22D3EE] to-[#F472B6] bg-clip-text font-bold text-transparent">CodeLand</span> محفوظ است.
                    </p>
                </div>
            </div>
        </footer>
    );
}
