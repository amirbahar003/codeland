"use client";

import { useEffect, useState } from "react";

export default function useCountdown(deadline) {
    const [left, setLeft] = useState({
        h: 0,
        m: 0,
        s: 0,
    });

    useEffect(() => {
        const target = new Date(deadline).getTime();

        const tick = () => {
            const diff = Math.max(0, target - Date.now());

            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            setLeft({ h, m, s });
        };

        tick();

        const id = setInterval(tick, 1000);

        return () => clearInterval(id);
    }, [deadline]);

    return left;
}