"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function checkAuth() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    router.replace("/login");
                    return;
                }

                if (!cancelled) {
                    setAuthorized(true);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        checkAuth();

        return () => {
            cancelled = true;
        };
    }, [router]);

    if (loading) {
        return (
            <div dir="rtl" role="status" aria-live="polite" className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#030712] text-white">
                <style>{`
                @keyframes cart-dot {
                    0%, 80%, 100% {
                        transform: scale(0.5);
                        opacity: 0.4;
                    }
                    40% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }

                .cart-dot {
                    animation: cart-dot 1.2s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .cart-dot {
                        animation: none;
                        opacity: 0.8;
                    }
                }
            `}</style>

                <div className="flex items-center gap-2" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                        <span key={i} className="cart-dot block h-2.5 w-2.5 rounded-full bg-white/80" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>

                <p className="text-sm text-white/60">در حال بررسی اطلاعات ورود...</p>
            </div>
        );
    }

    if (!authorized) return null;

    return children;
}
