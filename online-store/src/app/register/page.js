"use client";

import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { ArrowLeft, Check, ChevronDown, Eye, EyeOff, Gift, GraduationCap, LockKeyhole, Mail, Smartphone, User } from "lucide-react";

/* ---------- URL helpers ---------- */

const subscribeToLocation = (callback) => {
    window.addEventListener("popstate", callback);

    return () => {
        window.removeEventListener("popstate", callback);
    };
};

const getLocationSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

/* ---------- helpers ---------- */

// ارقام فارسی و عربی -> انگلیسی
const toEnglishDigits = (value = "") => value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

const validators = {
    username: (v) => {
        if (!v.trim()) return "نام کاربری را وارد کنید.";

        if (!/^[a-zA-Z0-9_.]{3,20}$/.test(v.trim())) {
            return "۳ تا ۲۰ کاراکتر، فقط حروف انگلیسی، عدد، _ و .";
        }

        return "";
    },

    phone: (v) => {
        const n = toEnglishDigits(v).trim();

        if (!n) return "شماره موبایل را وارد کنید.";

        if (!/^09\d{9}$/.test(n)) {
            return "شماره باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
        }

        return "";
    },

    email: (v) => {
        if (!v.trim()) return "ایمیل را وارد کنید.";

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) {
            return "فرمت ایمیل درست نیست.";
        }

        return "";
    },

    password: (v) => {
        if (!v) return "رمز عبور را وارد کنید.";

        if (v.length < 8) {
            return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
        }

        return "";
    },
};

const swalTheme = {
    background: "#0B1020",
    color: "#E2E8F0",
    confirmButtonColor: "#22D3EE",
};

/* ---------- field ---------- */

function Field({ id, label, icon: Icon, error, trailing, ltr, ...inputProps }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </label>

            <div className="relative">
                <Icon className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" strokeWidth={1.6} />

                <input
                    id={id}
                    dir={ltr ? "ltr" : undefined}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`h-12 w-full rounded-xl border bg-white/[0.03] pr-11 text-sm text-white outline-none transition-colors duration-200 placeholder:text-slate-600 focus:bg-cyan-400/[0.03] focus:ring-2 ${
                        trailing ? "pl-11" : "pl-4"
                    } ${error ? "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/15" : "border-white/[0.08] focus:border-cyan-400/40 focus:ring-cyan-400/15"} ${
                        ltr ? "text-left placeholder:text-right" : ""
                    }`}
                    {...inputProps}
                />

                {trailing}
            </div>

            {error && (
                <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-300">
                    {error}
                </p>
            )}
        </div>
    );
}

/* ---------- page ---------- */

export default function RegisterCard() {
    const router = useRouter();

    // دریافت Query String با پشتیبانی از SSR و Hydration
    const search = useSyncExternalStore(subscribeToLocation, getLocationSnapshot, getServerSnapshot);

    // استخراج کد معرف از آدرس
    const urlReferral = new URLSearchParams(search).get("ref")?.trim().toUpperCase() || "";

    const [values, setValues] = useState({
        username: "",
        phone: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // اگر کاربر کد را دستی تغییر دهد، مقدار جدید جایگزین کد URL می‌شود
    const [referralInput, setReferralInput] = useState(null);

    const referral = referralInput ?? urlReferral;

    const [showReferral, setShowReferral] = useState(false);

    // اگر کد از URL آمده باشد، بخش معرف همیشه باز است
    const referralVisible = Boolean(urlReferral) || showReferral;

    const [loading, setLoading] = useState(false);

    /* ---------- form helpers ---------- */

    const setField = (name) => (e) => {
        const value = e.target.value;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateField = (name) => () => {
        setErrors((prev) => ({
            ...prev,
            [name]: validators[name](values[name]),
        }));
    };

    /* ---------- register ---------- */

    const handleRegister = async (e) => {
        e.preventDefault();

        const nextErrors = Object.fromEntries(Object.keys(validators).map((name) => [name, validators[name](values[name])]));

        setErrors(nextErrors);

        const firstInvalid = Object.keys(nextErrors).find((name) => nextErrors[name]);

        if (firstInvalid) {
            document.getElementById(firstInvalid)?.focus();
            return;
        }

        try {
            setLoading(true);

            const payload = {
                username: values.username.trim(),
                email: values.email.trim(),
                password: values.password,
                mobile: toEnglishDigits(values.phone).trim(),
            };

            // اضافه کردن کد معرف به درخواست ثبت‌نام
            if (referral.trim()) {
                payload.referralCode = referral.trim().toUpperCase();
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "ثبت‌نام انجام نشد. دوباره تلاش کنید.");
            }

            await Swal.fire({
                ...swalTheme,
                icon: "success",
                title: "ثبت‌نام موفق بود",
                text: "حساب کاربری شما با موفقیت ایجاد شد.",
                confirmButtonText: "ادامه",
            });

            router.push("/");
        } catch (err) {
            const isNetwork = err instanceof TypeError;

            Swal.fire({
                ...swalTheme,
                icon: "error",
                title: "ثبت‌نام ناموفق بود",
                text: isNetwork ? "ارتباط با سرور برقرار نشد. اینترنت خود را بررسی کنید." : err.message,
                confirmButtonText: "باشه",
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------- UI ---------- */

    return (
        <main dir="rtl" className="relative flex min-h-[calc(100dvh-120px)] items-center justify-center overflow-clip bg-transparent px-4 py-8">
            <div className="relative z-10 w-full max-w-[460px]">
                {/* Background glows */}

                <div className="pointer-events-none absolute -right-24 -top-10 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.08] blur-[120px]" />

                <div className="pointer-events-none absolute -bottom-16 -left-24 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/[0.07] blur-[130px]" />

                {/* Logo */}

                <div className="mb-6 flex items-center justify-center gap-2 text-3xl font-black">
                    <span className="text-slate-100">کد</span>

                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">لند</span>

                    <GraduationCap className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.35)]" strokeWidth={1.7} />
                </div>

                {/* Card */}

                <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#080D1A]/70 px-6 py-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-9 sm:py-9">
                    {/* Top gradient hairline */}

                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-cyan-400/60 to-transparent" />

                    {/* Header */}

                    <div className="text-center">
                        <h1 className="text-2xl font-extrabold text-white sm:text-[28px]">ساخت حساب کاربری</h1>

                        <p className="mt-2.5 text-sm text-slate-400">
                            قبلاً ثبت‌نام کرده‌اید؟
                            <Link href="/login" className="mr-1 font-semibold text-cyan-400 transition-colors hover:text-cyan-300">
                                ورود به حساب
                            </Link>
                        </p>
                    </div>

                    {/* Form */}

                    <form className="mt-8 space-y-4" onSubmit={handleRegister} noValidate>
                        <Field
                            id="username"
                            label="نام کاربری"
                            icon={User}
                            type="text"
                            autoComplete="username"
                            placeholder="مثلاً codeland_user"
                            ltr
                            value={values.username}
                            onChange={setField("username")}
                            onBlur={validateField("username")}
                            error={errors.username}
                        />

                        <Field
                            id="phone"
                            label="شماره موبایل"
                            icon={Smartphone}
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="09123456789"
                            ltr
                            value={values.phone}
                            onChange={setField("phone")}
                            onBlur={validateField("phone")}
                            error={errors.phone}
                        />

                        <Field
                            id="email"
                            label="آدرس ایمیل"
                            icon={Mail}
                            type="email"
                            autoComplete="email"
                            placeholder="example@gmail.com"
                            ltr
                            value={values.email}
                            onChange={setField("email")}
                            onBlur={validateField("email")}
                            error={errors.email}
                        />

                        <Field
                            id="password"
                            label="رمز عبور"
                            icon={LockKeyhole}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="حداقل ۸ کاراکتر"
                            ltr
                            value={values.password}
                            onChange={setField("password")}
                            onBlur={validateField("password")}
                            error={errors.password}
                            trailing={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                                    className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30"
                                >
                                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.6} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                                </button>
                            }
                        />

                        {/* Referral code */}

                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!urlReferral) {
                                        setShowReferral((s) => !s);
                                    }
                                }}
                                aria-expanded={referralVisible}
                                aria-controls="referral-panel"
                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/[0.07] text-fuchsia-300">
                                    <Gift className="h-[18px] w-[18px]" strokeWidth={1.6} />
                                </span>

                                <span className="flex-1 text-sm font-medium text-slate-200">
                                    کد معرف دارید؟
                                    <span className="mr-1.5 text-xs font-normal text-slate-500">(اختیاری)</span>
                                </span>

                                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${referralVisible ? "rotate-180" : ""}`} />
                            </button>

                            <div id="referral-panel" className={`grid transition-all duration-300 ease-out ${referralVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden">
                                    <div className="px-4 pb-4">
                                        <label htmlFor="referral" className="sr-only">
                                            کد معرف
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="referral"
                                                type="text"
                                                dir="ltr"
                                                tabIndex={referralVisible ? 0 : -1}
                                                autoComplete="off"
                                                autoCapitalize="characters"
                                                spellCheck={false}
                                                value={referral}
                                                onChange={(e) => setReferralInput(e.target.value.replace(/\s/g, ""))}
                                                placeholder="CODE1234"
                                                className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-left text-sm font-semibold uppercase tracking-widest text-white outline-none transition-colors duration-200 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:border-fuchsia-400/40 focus:ring-2 focus:ring-fuchsia-400/15"
                                            />

                                            {referral.trim().length > 0 && (
                                                <span className="pointer-events-none absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                                    <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-xs leading-6 text-slate-500">اگر دوستتان شما را دعوت کرده، کد او را اینجا وارد کنید.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-l from-cyan-400 to-blue-500 text-sm font-bold text-slate-950 shadow-[0_8px_30px_-8px_rgba(34,211,238,0.5)] transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D1A] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                    <span>در حال ثبت‌نام...</span>
                                </>
                            ) : (
                                <>
                                    <span>ساخت حساب کاربری</span>
                                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Terms */}

                <p className="mt-5 text-center text-xs leading-6 text-slate-500">
                    با ساخت حساب،{" "}
                    <Link href="/terms" className="text-cyan-400 transition-colors hover:text-cyan-300">
                        قوانین و شرایط
                    </Link>{" "}
                    سایت را می‌پذیرید.
                </p>
            </div>
        </main>
    );
}
