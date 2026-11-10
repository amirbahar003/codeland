"use client";

import { useEffect, useRef, useState } from "react";
import { useMegaMenu } from "../context/MegaMenuContext";

export default function useCodeEditor(code) {
    const [displayedCode, setDisplayedCode] = useState("");

    const { isMegaMenuOpen } = useMegaMenu();

    // وضعیت باز بودن Mega Menu را همیشه به‌روز نگه می‌داریم
    const megaMenuOpenRef = useRef(isMegaMenuOpen);

    useEffect(() => {
        megaMenuOpenRef.current = isMegaMenuOpen;
    }, [isMegaMenuOpen]);

    const lines = displayedCode.split("\n");

    useEffect(() => {
        let index = 0;
        let deleting = false;
        let pause = false;
        let pauseTimeout;

        const interval = setInterval(() => {
            // اگر Mega Menu باز است، هیچ تغییری در کد نده
            if (megaMenuOpenRef.current) {
                return;
            }

            // مکث وقتی کد کامل شده
            if (pause) {
                return;
            }

            // Typing
            if (!deleting) {
                setDisplayedCode(code.slice(0, index));

                index++;

                // وقتی کد کامل شد
                if (index > code.length) {
                    pause = true;

                    pauseTimeout = setTimeout(() => {
                        pause = false;
                        deleting = true;
                    }, 2000);
                }
            }

            // Deleting
            else {
                index--;

                setDisplayedCode(code.slice(0, index));

                // وقتی کد کامل پاک شد
                if (index <= 0) {
                    deleting = false;
                    index = 0;
                }
            }
        }, 45);

        return () => {
            clearInterval(interval);
            clearTimeout(pauseTimeout);
        };
    }, [code]);

    return {
        displayedCode,
        lines,
    };
}
