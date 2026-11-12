"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, User, AtSign, Mail, Lock, Eye, EyeOff, Check, Loader2 } from "lucide-react";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/60";

function Field({ label, icon: Icon, error, trailing, ltr, readOnly, ...props }) {
    const id = useId();
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm text-white/80">
                {label}
            </label>
            <div className="relative">
                <Icon size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                    id={id}
                    readOnly={readOnly}
                    aria-readonly={readOnly || undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-err` : undefined}
                    dir={ltr ? "ltr" : undefined}
                    className={`h-[54px] w-full rounded-xl border px-11 text-sm outline-none transition-colors
            ${ltr ? "text-right" : ""}
            ${readOnly ? "cursor-not-allowed border-white/5 bg-white/[0.03] text-white/50" : "border-white/10 bg-white/5 text-white focus:border-[#22D3EE]/50"}
            ${error ? "!border-[#FF2E93]/60" : ""}`}
                    {...props}
                />
                {trailing && <div className="absolute left-3 top-1/2 -translate-y-1/2">{trailing}</div>}
            </div>
            {error && (
                <p id={`${id}-err`} className="mt-1.5 text-xs text-[#FF2E93]">
                    {error}
                </p>
            )}
        </div>
    );
}

function SubmitButton({ disabled, loading, children }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className={`flex h-[50px] items-center justify-center gap-2 rounded-xl px-8 text-sm font-bold transition-colors ${focusRing}
        ${disabled ? "cursor-not-allowed bg-white/10 text-white/40" : "bg-[#22D3EE] text-[#0b0f1a] hover:bg-[#22D3EE]/90"}`}
        >
            {loading && <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />}
            {children}
        </button>
    );
}

export default function SettingsModal({ open, onClose, user, onSaveProfile, onChangePassword }) {
    const [mounted, setMounted] = useState(false);
    const [tab, setTab] = useState("account");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null); // { type: "ok" | "error", text }

    // تب حساب کاربری
    const [name, setName] = useState(user.name);
    const [savedName, setSavedName] = useState(user.name);

    // تب رمز عبور
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);

    const dialogRef = useRef(null);
    const lastFocused = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    const titleId = useId();

    useEffect(() => setMounted(true), []);

    // ریست فرم با هر بار باز شدن
    useEffect(() => {
        if (!open) return;
        setTab("account");
        setName(user.name);
        setSavedName(user.name);
        setCurrent("");
        setNext("");
        setConfirm("");
        setShowPass(false);
        setMessage(null);
        setSaving(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Esc، قفل اسکرول، تله فوکوس و برگرداندن فوکوس
    useEffect(() => {
        if (!open) return;
        lastFocused.current = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e) => {
            if (e.key === "Escape") {
                onCloseRef.current();
                return;
            }
            if (e.key !== "Tab" || !dialogRef.current) return;
            const items = dialogRef.current.querySelectorAll("button:not([disabled]), input:not([readonly]):not([disabled])");
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        const t = setTimeout(() => dialogRef.current?.querySelector("input:not([readonly])")?.focus(), 50);

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            clearTimeout(t);
            lastFocused.current?.focus?.();
        };
    }, [open]);

    if (!mounted || !open) return null;

    const switchTab = (value) => {
        setTab(value);
        setMessage(null);
    };

    // --- حساب کاربری ---
    const trimmedName = name.trim();
    const nameError = name.length > 0 && trimmedName.length < 3 ? "نام کامل باید حداقل ۳ حرف باشد" : "";
    const canSaveProfile = trimmedName !== savedName && trimmedName.length >= 3 && !saving;

    const submitProfile = async (e) => {
        e.preventDefault();
        if (!canSaveProfile) return;
        setSaving(true);
        setMessage(null);
        try {
            // TODO: درخواست واقعی به API
            await (onSaveProfile ? onSaveProfile(trimmedName) : new Promise((r) => setTimeout(r, 600)));
            setSavedName(trimmedName);
            setName(trimmedName);
            setMessage({ type: "ok", text: "تغییرات با موفقیت ذخیره شد" });
        } catch {
            setMessage({ type: "error", text: "ذخیره‌سازی انجام نشد. دوباره تلاش کنید." });
        } finally {
            setSaving(false);
        }
    };

    // --- رمز عبور ---
    const nextError = next.length > 0 && next.length < 8 ? "رمز عبور جدید باید حداقل ۸ کاراکتر باشد" : next && next === current ? "رمز جدید نباید با رمز فعلی یکسان باشد" : "";
    const confirmError = confirm.length > 0 && confirm !== next ? "تکرار رمز عبور مطابقت ندارد" : "";
    const canSavePass = !!current && next.length >= 8 && next !== current && confirm === next && !saving;

    const submitPassword = async (e) => {
        e.preventDefault();
        if (!canSavePass) return;
        setSaving(true);
        setMessage(null);
        try {
            // TODO: درخواست واقعی به API
            await (onChangePassword ? onChangePassword(current, next) : new Promise((r) => setTimeout(r, 600)));
            setCurrent("");
            setNext("");
            setConfirm("");
            setMessage({ type: "ok", text: "رمز عبور با موفقیت تغییر کرد" });
        } catch {
            setMessage({
                type: "error",
                text: error.message || "تغییر رمز عبور ناموفق بود. دوباره تلاش کنید.",
            });
        } finally {
            setSaving(false);
        }
    };

    const eyeToggle = (
        <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:text-[#22D3EE] ${focusRing}`}
        >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    );

    const tabs = [
        { value: "account", label: "حساب کاربری" },
        { value: "password", label: "رمز عبور" },
    ];

    const onTabKey = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            switchTab(tab === "account" ? "password" : "account");
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div
                ref={dialogRef}
                dir="rtl"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="max-h-[92vh] w-full max-w-[500px] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0f1a]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
                {/* سربرگ */}
                <div className="flex items-center justify-between">
                    <h2 id={titleId} className="text-lg font-bold text-white sm:text-xl">
                        ویرایش حساب کاربری
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="بستن"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white ${focusRing}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* تب‌ها */}
                <div role="tablist" aria-label="بخش‌های تنظیمات" className="mt-6 flex border-b border-white/10">
                    {tabs.map((t) => (
                        <button
                            key={t.value}
                            role="tab"
                            id={`tab-${t.value}`}
                            aria-selected={tab === t.value}
                            aria-controls={`panel-${t.value}`}
                            tabIndex={tab === t.value ? 0 : -1}
                            onClick={() => switchTab(t.value)}
                            onKeyDown={onTabKey}
                            className={`-mb-px flex-1 border-b-2 py-3 text-sm transition-colors ${focusRing}
                ${tab === t.value ? "border-[#22D3EE] font-bold text-[#22D3EE]" : "border-transparent text-white/60 hover:text-white"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* پیام نتیجه */}
                <div role="status" aria-live="polite" className="mt-5 min-h-0">
                    {message && (
                        <p className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${message.type === "ok" ? "bg-emerald-400/15 text-emerald-300" : "bg-[#FF2E93]/15 text-[#FF2E93]"}`}>
                            {message.type === "ok" && <Check size={16} className="shrink-0" />}
                            {message.text}
                        </p>
                    )}
                </div>

                {/* حساب کاربری */}
                {tab === "account" && (
                    <form id="panel-account" role="tabpanel" aria-labelledby="tab-account" onSubmit={submitProfile} className="mt-5 space-y-5">
                        <Field label="نام کامل" icon={User} value={name} onChange={(e) => setName(e.target.value)} error={nameError} autoComplete="name" />
                        <Field label="نام کاربری" icon={AtSign} value={user.username} readOnly ltr />
                        <Field label="ایمیل" icon={Mail} value={user.email} readOnly ltr />

                        <SubmitButton disabled={!canSaveProfile} loading={saving}>
                            ذخیره تغییرات
                        </SubmitButton>
                    </form>
                )}

                {/* رمز عبور */}
                {tab === "password" && (
                    <form id="panel-password" role="tabpanel" aria-labelledby="tab-password" onSubmit={submitPassword} className="mt-5 space-y-5">
                        <Field
                            label="رمز عبور فعلی"
                            icon={Lock}
                            type={showPass ? "text" : "password"}
                            value={current}
                            onChange={(e) => setCurrent(e.target.value)}
                            autoComplete="current-password"
                            ltr
                            trailing={eyeToggle}
                        />
                        <Field
                            label="رمز عبور جدید"
                            icon={Lock}
                            type={showPass ? "text" : "password"}
                            value={next}
                            onChange={(e) => setNext(e.target.value)}
                            error={nextError}
                            autoComplete="new-password"
                            ltr
                        />
                        <Field
                            label="تکرار رمز عبور جدید"
                            icon={Lock}
                            type={showPass ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            error={confirmError}
                            autoComplete="new-password"
                            ltr
                        />

                        <SubmitButton disabled={!canSavePass} loading={saving}>
                            تغییر رمز عبور
                        </SubmitButton>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}
