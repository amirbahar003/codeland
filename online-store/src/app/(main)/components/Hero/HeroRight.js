import { Search } from "lucide-react";
import "./hero.css";
import HeroFeatures from "./HeroFeatures";

export default function HeroRight() {
    return (
        // پس‌زمینه‌ی تخت حذف شد تا PageBackground (شبکه + درخشش) دیده شود
        <section dir="rtl" className="relative isolate flex min-h-[620px] flex-col items-center overflow-hidden">
            {/* درخشش‌های موضعی هیرو: آبی بالا، صورتی پایین راست، فیروزه‌ای چپ */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#3B82F6]/15 blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#FF2E93]/15 blur-[140px]" />
                <div className="absolute left-0 top-1/2 h-[300px] w-[300px] rounded-full bg-[#22D3EE]/10 blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex w-full flex-col items-center px-4 pb-16 pt-16 text-center sm:px-5 sm:pt-20">
                {/* Badge */}
                <div className="mb-8 flex w-fit items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/[0.06] px-3 py-2 text-[11px] text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.10)] backdrop-blur-xl sm:px-4 sm:text-xs">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2E93] opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF2E93] shadow-[0_0_12px_rgba(255,46,147,0.9)]" />
                    </span>
                    <span>پلتفرم آموزش برنامه‌نویسی</span>
                </div>

                {/* CodeLand Logo */}
                <div className="relative mb-10">
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#22D3EE]/20 to-[#FF2E93]/20 blur-2xl" />

                    {/* گوشه‌ها: فیروزه‌ای (بالا چپ / پایین راست)، صورتی (بالا راست / پایین چپ) */}
                    <span aria-hidden="true" className="absolute -left-2 -top-2 h-3 w-3 border-l border-t border-cyan-300/70" />
                    <span aria-hidden="true" className="absolute -right-2 -top-2 h-3 w-3 border-r border-t border-pink-400/70" />
                    <span aria-hidden="true" className="absolute -bottom-2 -left-2 h-3 w-3 border-b border-l border-pink-400/70" />
                    <span aria-hidden="true" className="absolute -bottom-2 -right-2 h-3 w-3 border-b border-r border-cyan-300/70" />

                    <div className="relative border border-white/15 bg-white/[0.03] px-5 py-3 backdrop-blur-xl sm:px-7 sm:py-4">
                        {/* h2 به p تبدیل شد: تنها heading اصلی صفحه باید h1 پایین باشد */}
                        <p dir="ltr" className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-[#FF2E93] bg-clip-text text-transparent">CodeLand</span>
                        </p>
                    </div>
                </div>

                {/* Main Title */}
                <h1 className="max-w-4xl px-2 font-[var(--font-vazirmatn)] text-2xl font-bold leading-[1.8] tracking-tight text-white sm:px-0 sm:text-4xl sm:leading-[1.7] md:text-5xl">
                    از اولین خط کد
                    <br />
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-pink-400 bg-clip-text text-transparent">تا ساختن آینده.</span>
                </h1>

                {/* Description */}
                <div className="relative mt-6 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_8px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:mt-7 sm:px-5 sm:py-4">
                    <p className="font-[var(--font-vazirmatn)] text-xs leading-7 text-white/60 sm:text-base sm:leading-8">
                        در
                        <span className="code-land-glass relative mx-1 inline-flex items-center rounded-lg px-2 py-0.5 text-sm font-medium text-white/90">
                            <span className="relative z-10">CodeLand</span>
                        </span>{" "}
                        قدم‌به‌قدم، از اولین خط کد تا ساختن پروژه‌های واقعی، مهارت‌هایی رو یاد می‌گیری که تو رو برای دنیای واقعی برنامه‌نویسی آماده می‌کنن.
                    </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full max-w-md pt-6">
                    {/* form واقعی: بدون JS هم کار می‌کند و به /courses?q=... می‌رود */}
                    <form action="/courses" method="get" role="search" className="group relative">
                        {/* هاله‌ی گرادیانی هنگام فوکوس */}
                        <div
                            aria-hidden="true"
                            className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#FF2E93] opacity-30 blur-sm transition-opacity duration-300 group-focus-within:opacity-70"
                        />

                        <div className="relative flex h-14 items-center rounded-2xl border border-white/10 bg-[#0C0924]/90 px-2 backdrop-blur-xl">
                            {/* Search Button */}
                            <button
                                type="submit"
                                aria-label="جستجو"
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#22D3EE] via-[#3B82F6] to-[#FF2E93] text-white shadow-[0_0_20px_rgba(255,46,147,0.35)] transition duration-300 hover:scale-105 active:scale-95"
                            >
                                <Search size={21} strokeWidth={2.5} />
                            </button>

                            {/* Input */}
                            <div className="relative h-full flex-1">
                                <input
                                    id="search"
                                    name="q"
                                    type="search"
                                    placeholder=" "
                                    autoComplete="off"
                                    className="peer h-full w-full bg-transparent px-4 pt-3 text-right text-sm text-white outline-none"
                                />

                                {/* Floating Label */}
                                <label
                                    htmlFor="search"
                                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/45 transition-all duration-300
                                               peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-cyan-300
                                               peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px]"
                                >
                                    دنبال چه دوره‌ای می‌گردی؟
                                </label>
                            </div>
                        </div>
                    </form>

                    <HeroFeatures />
                </div>
            </div>
        </section>
    );
}
