"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, GraduationCap, LockKeyhole, User } from "lucide-react";
import CartToast from "../(main)/components/CartToast/CartToast";

/* ---------- helpers ---------- */

// ارقام فارسی و عربی -> انگلیسی
const toEnglishDigits = (value = "") => value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

// اگر ورودی شبیه موبایل بود ارقامش نرمال می‌شود، وگرنه (ایمیل) فقط trim می‌شود
const normalizeIdentifier = (value) => {
    const v = value.trim();
    const asEnglish = toEnglishDigits(v);
    return /^\d+$/.test(asEnglish) ? asEnglish : v;
};

// فقط مسیرهای داخلی سایت مجاز هستند (جلوگیری از open redirect)
const getSafeRedirect = () => {
    if (typeof window === "undefined") return "/";
    const target = new URLSearchParams(window.location.search).get("redirect");
    return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
};

const validators = {
    emailOrMobile: (v) => (v.trim() ? "" : "ایمیل یا شماره موبایل را وارد کنید."),
    password: (v) => (v ? "" : "رمز عبور را وارد کنید."),
};

/* ---------- field ---------- */

function Field({ id, label, icon: Icon, error, trailing, labelExtra, ltr, ...inputProps }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label htmlFor={id} className="block text-sm font-medium text-slate-300">
                    {label}
                </label>
                {labelExtra}
            </div>

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

export default function LoginCard() {
    const router = useRouter();

    const [values, setValues] = useState({ emailOrMobile: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const notify = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const setField = (name) => (e) => {
        const value = e.target.value;
        setValues((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateField = (name) => () => {
        setErrors((prev) => ({ ...prev, [name]: validators[name](values[name]) }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const nextErrors = Object.fromEntries(Object.keys(validators).map((name) => [name, validators[name](values[name])]));
        setErrors(nextErrors);

        const firstInvalid = Object.keys(nextErrors).find((name) => nextErrors[name]);
        if (firstInvalid) {
            document.getElementById(firstInvalid)?.focus();
            return;
        }

        let succeeded = false;

        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailOrMobile: normalizeIdentifier(values.emailOrMobile),
                    password: values.password,
                }),
            });

            // اگر سرور پاسخ غیر JSON بدهد، خطای نامفهوم نمی‌گیریم
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "ایمیل، شماره موبایل یا رمز عبور اشتباه است.");
            }

            succeeded = true;
            notify("با موفقیت وارد حساب کاربری شدید.", "success");

            const target = getSafeRedirect();
            setTimeout(() => {
                router.push(target);
                router.refresh();
            }, 1200);
        } catch (err) {
            const isNetwork = err instanceof TypeError;
            notify(isNetwork ? "ارتباط با سرور برقرار نشد. اینترنت خود را بررسی کنید." : err.message, "error");
        } finally {
            // بعد از ورود موفق، دکمه تا ریدایرکت غیرفعال می‌ماند
            if (!succeeded) setLoading(false);
        }
    };

    return (
        <main dir="rtl" className="relative flex min-h-[calc(100dvh-120px)] items-center justify-center overflow-clip bg-transparent px-4 py-8">
            <CartToast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} type={toastType} />

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
                        <h1 className="text-2xl font-extrabold text-white sm:text-[28px]">ورود به حساب کاربری</h1>
                        <p className="mt-2.5 text-sm text-slate-400">
                            هنوز ثبت‌نام نکرده‌اید؟
                            <Link href="/register" className="mr-1 font-semibold text-cyan-400 transition-colors hover:text-cyan-300">
                                ساخت حساب
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-4" onSubmit={handleLogin} noValidate>
                        <Field
                            id="emailOrMobile"
                            label="ایمیل یا شماره موبایل"
                            icon={User}
                            type="text"
                            inputMode="email"
                            autoComplete="username"
                            placeholder="example@gmail.com یا 09123456789"
                            ltr
                            value={values.emailOrMobile}
                            onChange={setField("emailOrMobile")}
                            onBlur={validateField("emailOrMobile")}
                            error={errors.emailOrMobile}
                        />

                        <Field
                            id="password"
                            label="رمز عبور"
                            icon={LockKeyhole}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="رمز عبور"
                            ltr
                            value={values.password}
                            onChange={setField("password")}
                            onBlur={validateField("password")}
                            error={errors.password}
                            labelExtra={
                                <Link href="/forgot-password" className="text-xs font-medium text-slate-400 transition-colors hover:text-cyan-300">
                                    رمز عبور را فراموش کرده‌اید؟
                                </Link>
                            }
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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative !mt-6 flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-l from-cyan-400 to-blue-500 text-sm font-bold text-slate-950 shadow-[0_8px_30px_-8px_rgba(34,211,238,0.5)] transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D1A] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                    <span>در حال ورود...</span>
                                </>
                            ) : (
                                <>
                                    <span>ورود به حساب</span>
                                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
