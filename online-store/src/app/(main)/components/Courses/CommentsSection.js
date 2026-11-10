"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, UserRound, ArrowLeft, MessagesSquare, Send } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CommentsSection({ courseId, instructorId, onNotEnrolled, onNotify }) {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState("");

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);

    // Check login
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch(`${API_URL}/Auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Auth check error:", error);
                setUser(null);
            } finally {
                setCheckingAuth(false);
            }
        }

        checkAuth();
    }, []);

    // Get comments
    const fetchComments = useCallback(async () => {
        if (!courseId) {
            setLoadingComments(false);
            return;
        }

        try {
            setLoadingComments(true);

            const response = await fetch(`${API_URL}/Comment/course/${courseId}`);

            if (!response.ok) {
                throw new Error("دریافت نظرات با خطا مواجه شد.");
            }

            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error("Comments error:", error);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Send comment
    async function handleSubmit(event) {
        event.preventDefault();

        if (!content.trim()) {
            setMessage("لطفاً متن نظر را وارد کنید.");
            return;
        }

        if (!courseId) {
            setMessage("شناسه دوره پیدا نشد.");
            return;
        }

        try {
            setSending(true);
            setMessage("");

            const response = await fetch(`${API_URL}/Comment`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId,
                    content: content.trim(),
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMessage = [data?.message, data?.title, data?.detail, typeof data === "string" ? data : ""].filter(Boolean).join(" ");

                const normalizedMessage = errorMessage.replace(/[\u200c\s]+/g, " ").toLowerCase();

                if (response.status === 403 && normalizedMessage.includes("you do not have access to comment on this course")) {
                    if (onNotEnrolled) {
                        onNotEnrolled();
                    } else if (onNotify) {
                        onNotify("در این دوره ثبت‌نام نکرده‌اید.", "error");
                    }

                    return;
                }

                if (response.status === 401) {
                    throw new Error("برای ثبت نظر، لطفاً دوباره وارد حساب کاربری شوید.");
                }

                throw new Error(errorMessage || "ثبت نظر با خطا مواجه شد.");
            }

            setContent("");

            onNotify?.("نظر شما با موفقیت ثبت شد.", "success");

            await fetchComments();
        } catch (error) {
            console.error("Submit comment error:", error);

            onNotify?.(error.message || "ثبت نظر با خطا مواجه شد.", "error");
        } finally {
            setSending(false);
        }
    }

    return (
        <section dir="rtl" className="mt-10 rounded-3xl border border-white/10 bg-[#080B1D]/70 p-5 backdrop-blur-xl sm:p-6">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
                    <MessageSquare className="h-5 w-5 text-cyan-300" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white">نظرات کاربران</h2>

                    <p className="mt-1 text-xs text-slate-400">نظر خود را درباره این دوره با ما به اشتراک بگذارید.</p>
                </div>
            </div>

            {/* Auth checking */}
            {checkingAuth ? (
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">در حال بررسی وضعیت ورود...</div>
            ) : user ? (
                /* Logged in */
                <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10">
                            <UserRound className="h-5 w-5 text-cyan-300" />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-white">{user.username}</p>

                            <p className="text-xs text-slate-400">شما وارد حساب کاربری خود شده‌اید.</p>
                        </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="نظر خود را درباره این دوره بنویسید..."
                        rows={5}
                        disabled={sending}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                    />

                    {message && <p className="mt-3 text-sm text-cyan-300">{message}</p>}

                    <button
                        type="submit"
                        disabled={sending}
                        className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                        {sending ? "در حال ارسال..." : "ثبت نظر"}
                    </button>
                </form>
            ) : (
                /* Not logged in */
                <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10">
                                <UserRound className="h-5 w-5 text-cyan-300" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-white">برای ثبت نظر، لطفاً وارد حساب کاربری خود شوید.</p>

                                <p className="mt-1 text-xs text-slate-400">بعد از ورود می‌توانید در این دوره نظر ثبت کنید.</p>
                            </div>
                        </div>

                        <Link href="/login" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                            ورود یا عضویت
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Comments list */}
            <div className="space-y-4">
                {loadingComments ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-10 text-center">
                        <p className="text-sm text-slate-400">در حال دریافت نظرات...</p>
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => {
                        const isReply = !!comment.parentCommentId;

                        return (
                            <div
                                key={comment.id}
                                className={
                                    isReply
                                        ? "mr-8 rounded-2xl border border-white/5 border-r-2 border-r-cyan-400/40 bg-cyan-400/[0.02] p-4 sm:mr-12"
                                        : "rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                                }
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div
                                        className={
                                            isReply ? "flex h-9 w-9 items-center justify-center rounded-full bg-blue-400/10" : "flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10"
                                        }
                                    >
                                        <UserRound className={isReply ? "h-4 w-4 text-blue-300" : "h-5 w-5 text-cyan-300"} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-white">{comment.userName || "کاربر"}</p>

                                            {comment.userId === instructorId && <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-bold text-cyan-300">مدرس دوره</span>}

                                            {isReply && <span className="text-[10px] font-medium text-slate-500">پاسخ</span>}
                                        </div>

                                        <p className="mt-1 text-xs text-slate-500">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString("fa-IR") : ""}</p>
                                    </div>
                                </div>

                                <p className={isReply ? "text-sm leading-7 text-slate-400" : "text-sm leading-7 text-slate-300"}>{comment.content}</p>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
                        <MessagesSquare className="mb-3 h-10 w-10 text-slate-600" />

                        <h3 className="text-sm font-bold text-slate-300">هنوز هیچ نظری ثبت نشده!</h3>

                        <p className="mt-2 text-xs text-slate-500">اولین نفری باشید که درباره این دوره نظر می‌دهد.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
