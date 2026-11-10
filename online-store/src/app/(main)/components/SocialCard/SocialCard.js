import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const socialLinks = [
    {
        id: 1,
        title: "اینستاگرام CodeLand",
        description: "اخبار، نکات برنامه‌نویسی و محتوای آموزشی",
        action: "Follow Us",
        href: "https://instagram.com/yourusername",
        icon: FaInstagram,
        gradient: "from-pink-500 via-purple-500 to-violet-600",
        textColor: "text-pink-400",
    },
    {
        id: 2,
        title: "کانال تلگرام CodeLand",
        description: "اطلاع‌رسانی دوره‌ها، فایل‌ها و محتوای آموزشی",
        action: "Join Us",
        href: "https://t.me/yourchannel",
        icon: FaTelegramPlane,
        gradient: "from-cyan-400 via-blue-500 to-violet-600",
        textColor: "text-cyan-400",
    },
];

export default function SocialLinks() {
    return (
        <section dir="rtl" className="px-4 py-20">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-violet-400">
                        <span className="h-px w-6 bg-violet-500/70" />
                        ارتباط با CodeLand
                        <span className="h-px w-6 bg-violet-500/70" />
                    </span>

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        همیشه همراه <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">CodeLand</span> باشید
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">جدیدترین آموزش‌ها، نکات برنامه‌نویسی و اخبار CodeLand را در شبکه‌های اجتماعی دنبال کنید.</p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {socialLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                            <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.title} className="group relative overflow-hidden rounded-3xl p-[1px]">
                                {/* Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-70`} />

                                {/* Card */}
                                <div className="relative flex h-full items-center gap-6 rounded-[23px] border border-white/10 bg-[#0B1020]/90 p-6 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20">
                                    {/* Icon */}
                                    <div className={`shrink-0 rounded-2xl bg-gradient-to-tr ${item.gradient} p-[2px]`}>
                                        <div className="flex h-20 w-20 items-center justify-center rounded-[14px] bg-[#0B1020] transition-colors duration-300 group-hover:bg-transparent">
                                            <Icon size={34} className={`${item.textColor} transition-colors duration-300 group-hover:text-white`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold text-white sm:text-xl">{item.title}</h3>

                                        <p className="mt-1 text-sm font-medium leading-6 text-gray-400">{item.description}</p>

                                        <span className={`mt-3 flex items-center gap-1 text-xs font-bold ${item.textColor} transition-all duration-300 group-hover:gap-2`}>
                                            {item.action}
                                            <ArrowLeft size={14} />
                                        </span>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
