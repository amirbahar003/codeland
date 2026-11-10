"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, Gift, Copy, SlidersHorizontal, Check, ReceiptText } from "lucide-react";

// TODO: با دیتای واقعی از API جایگزین کن
const referralLink = "https://codeland.ir/register?ref=YOUR_CODE"; // TODO: لینک دعوت اختصاصی کاربر

const statusMap = {
    paid: { label: "پرداخت‌شده", cls: "bg-emerald-400/15 text-emerald-300" },
    pending: { label: "در انتظار پرداخت", cls: "bg-amber-400/15 text-amber-300" },
    failed: { label: "ناموفق", cls: "bg-[#FF2E93]/15 text-[#FF2E93]" },
};

const filters = [
    { value: "all", label: "همه" },
    { value: "paid", label: "پرداخت‌شده" },
    { value: "pending", label: "در انتظار پرداخت" },
    { value: "failed", label: "ناموفق" },
];

const fa = (n) => Number(n).toLocaleString("fa-IR");
const faId = (value) => String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
const faDate = (iso) =>
    new Date(iso).toLocaleDateString("fa-IR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
const faAmount = (n) => (n === 0 ? "رایگان" : `${fa(n)} تومان`);

const glass = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/60";

function StatusBadge({ status }) {
    const s = statusMap[status];
    return <span className={`inline-block whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

export default function TransactionsPage() {
    const [filter, setFilter] = useState("all");
    const [filterOpen, setFilterOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [walletLoading, setWalletLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [referralCode, setReferralCode] = useState("");
    const [referralLoading, setReferralLoading] = useState(true);
    const filterRef = useRef(null);
    const copyTimer = useRef(null);
    const referralLink = referralCode ? `https://codeland.ir/register?ref=${encodeURIComponent(referralCode)}` : "";
    useEffect(() => {
        let cancelled = false;
        async function fetchReferralCode() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Referral/stats`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("دریافت کد دعوت ناموفق بود.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setReferralCode(data.referralCode ?? "");
                }
            } catch (error) {
                console.error("Referral code error:", error);
            } finally {
                if (!cancelled) {
                    setReferralLoading(false);
                }
            }
        }

        async function fetchWallet() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Wallet`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("دریافت موجودی کیف پول ناموفق بود.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setWalletBalance(data.balance ?? 0);
                }
            } catch (error) {
                console.error("Wallet error:", error);
            } finally {
                if (!cancelled) {
                    setWalletLoading(false);
                }
            }
        }

        async function fetchTransactions() {
            try {
                const [walletResponse, paymentsResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/Wallet/transactions`, {
                        method: "GET",
                        credentials: "include",
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/Payments/my`, {
                        method: "GET",
                        credentials: "include",
                    }),
                ]);

                if (!walletResponse.ok) {
                    throw new Error("دریافت تراکنش‌های کیف پول ناموفق بود.");
                }

                if (!paymentsResponse.ok) {
                    throw new Error("دریافت پرداخت‌های دوره ناموفق بود.");
                }

                const walletData = await walletResponse.json();
                const paymentsData = await paymentsResponse.json();

                const walletTransactions = walletData.map((item) => {
                    const match = item.referenceId?.match(/^REFERRAL-.+-(\d+)$/);

                    const rewardNumber = match ? Number(match[1]) : null;
                    const milestone = rewardNumber ? rewardNumber * 10 : null;

                    const isReferralReward = milestone !== null;

                    return {
                        id: `wallet-${item.id}`,
                        title: isReferralReward ? `پاداش دعوت دوستان - حدنصاب ${fa(milestone)} نفر` : item.description || "تراکنش کیف پول",
                        date: item.createdAt,
                        amount: item.amount,
                        status: "paid",
                        transactionType: isReferralReward ? "referral" : "wallet",
                        milestone,
                    };
                });

                const coursePayments = paymentsData.map((item) => ({
                    id: `payment-${item.id}`,
                    title: item.courseTitle || "خرید دوره",
                    date: item.createdAt,
                    amount: item.amount,
                    status: String(item.status).toLowerCase(),
                    transactionType: "course",
                }));

                const combinedTransactions = [...walletTransactions, ...coursePayments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                if (!cancelled) {
                    setTransactions(combinedTransactions);
                }
            } catch (error) {
                console.error("Transactions error:", error);
            } finally {
                if (!cancelled) {
                    setTransactionsLoading(false);
                }
            }
        }

        fetchWallet();
        fetchTransactions();
        fetchReferralCode();
        return () => {
            cancelled = true;
        };
    }, []);
    // بستن منوی فیلتر با کلیک بیرون یا Esc
    useEffect(() => {
        if (!filterOpen) return;
        const onClick = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
        };
        const onKey = (e) => e.key === "Escape" && setFilterOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [filterOpen]);

    // پاک کردن تایمر کپی هنگام خروج از صفحه
    useEffect(() => () => clearTimeout(copyTimer.current), []);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            clearTimeout(copyTimer.current);
            copyTimer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // اگر مرورگر اجازه نداد، کاربر می‌تواند متن فیلد را دستی کپی کند
        }
    };

    const list = filter === "all" ? transactions : transactions.filter((t) => t.status === filter);

    return (
        <div dir="rtl" className="space-y-6">
            {/* عنوان صفحه */}
            <header>
                <h1 className="text-xl font-bold text-white sm:text-2xl">تراکنش‌ها</h1>
                <p className="mt-1 text-sm text-white/60">موجودی کیف پول و سابقهٔ پرداخت‌های شما</p>
            </header>

            {/* کارت‌های بالا */}
            <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                {/* موجودی کیف پول */}
                <div className={`${glass} flex items-center gap-4 p-6`}>
                    <div className="flex h-[75px] w-[75px] shrink-0 items-center justify-center rounded-xl bg-[#22D3EE]/15 text-[#22D3EE]">
                        <Wallet size={34} strokeWidth={1.6} />
                    </div>
                    <div>
                        <p className="text-sm text-white/60">موجودی کیف پول</p>
                        <p className="mt-2 text-2xl font-bold text-white">
                            {fa(walletBalance)} <span className="text-sm font-normal text-white/70">تومان</span>
                        </p>
                    </div>
                </div>

                {/* دعوت دوستان */}
                <div className={`${glass} p-6`}>
                    <div className="flex items-center gap-4">
                        <div className="flex h-[75px] w-[75px] shrink-0 items-center justify-center rounded-xl bg-[#FF2E93]/15 text-[#FF2E93]">
                            <Gift size={34} strokeWidth={1.6} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-base font-bold text-white">دعوت دوستان</p>
                            <p className="mt-1.5 text-sm leading-6 text-white/60">با دعوت هر دوست، اعتبار هدیه بگیرید</p>
                        </div>
                    </div>

                    {/* لینک دعوت */}
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/5 p-1.5">
                        <input
                            readOnly
                            dir="ltr"
                            value={referralLoading ? "در حال دریافت کد دعوت..." : referralLink || "کد دعوت در دسترس نیست"}
                            aria-label="لینک دعوت"
                            onFocus={(e) => e.target.select()}
                            className="min-w-0 flex-1 bg-transparent px-3 text-right text-[13px] text-white/70 outline-none"
                        />
                        <button
                            onClick={copyLink}
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${focusRing}
                ${copied ? "bg-emerald-400/15 text-emerald-300" : "bg-[#22D3EE]/15 text-[#22D3EE] hover:bg-[#22D3EE]/25"}`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? "کپی شد" : "کپی لینک"}
                        </button>
                    </div>
                </div>
            </section>

            {/* لیست تراکنش‌ها */}
            <section className={`${glass} p-5 sm:p-6`}>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">لیست تراکنش‌های من</h2>

                    {/* فیلتر */}
                    <div ref={filterRef} className="relative">
                        <button
                            onClick={() => setFilterOpen((v) => !v)}
                            aria-label="فیلتر تراکنش‌ها"
                            aria-expanded={filterOpen}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${focusRing}
                ${filter !== "all" ? "border-[#22D3EE]/40 bg-[#22D3EE]/10 text-[#22D3EE]" : "border-transparent bg-white/5 text-white/70 hover:text-[#22D3EE]"}`}
                        >
                            <SlidersHorizontal size={20} />
                        </button>

                        {filterOpen && (
                            <ul className="absolute left-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0b0f1a]/95 py-1 shadow-xl backdrop-blur-xl">
                                {filters.map((f) => (
                                    <li key={f.value}>
                                        <button
                                            onClick={() => {
                                                setFilter(f.value);
                                                setFilterOpen(false);
                                            }}
                                            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
                                        >
                                            {f.label}
                                            {filter === f.value && <Check size={16} className="text-[#22D3EE]" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {list.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-14 text-white/60">
                        <ReceiptText size={40} strokeWidth={1.4} />
                        <p className="text-sm">تراکنشی برای نمایش وجود ندارد</p>
                    </div>
                ) : (
                    <>
                        {/* جدول (دسکتاپ) */}
                        <div className="hidden md:block">
                            <table className="w-full table-fixed border-separate border-spacing-y-2 text-right">
                                <colgroup>
                                    <col className="w-24" />
                                    <col />
                                    <col className="w-44" />
                                    <col className="w-36" />
                                    <col className="w-40" />
                                </colgroup>
                                <thead>
                                    <tr className="text-sm text-white/60">
                                        <th className="px-4 py-3 font-medium">شناسه</th>
                                        <th className="px-4 py-3 font-medium">شرح تراکنش</th>
                                        <th className="px-4 py-3 font-medium">تاریخ</th>
                                        <th className="px-4 py-3 font-medium">مبلغ</th>
                                        <th className="px-4 py-3 font-medium">وضعیت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((t, index) => (
                                        <tr key={t.id} className="bg-white/5 text-sm text-white/90 transition-colors hover:bg-white/10">
                                            <td className="rounded-r-xl px-4 py-4">{faId(index + 1)}</td>

                                            <td className="px-4 py-4 leading-6">{t.title}</td>

                                            <td className="whitespace-nowrap px-4 py-4">{faDate(t.date)}</td>

                                            <td className="whitespace-nowrap px-4 py-4">{faAmount(t.amount)}</td>

                                            <td className="rounded-l-xl px-4 py-4">
                                                <StatusBadge status={t.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* کارت‌ها (موبایل) */}
                        <ul className="space-y-3 md:hidden">
                            {list.map((t) => (
                                <li key={t.id} className="rounded-xl bg-white/5 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm leading-6 text-white">{t.title}</p>
                                        <StatusBadge status={t.status} />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[13px] text-white/60">
                                        <span>شناسه: {faId(t.id)}</span>
                                        <span>{faDate(t.date)}</span>
                                        <span>{faAmount(t.amount)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </section>
        </div>
    );
}
