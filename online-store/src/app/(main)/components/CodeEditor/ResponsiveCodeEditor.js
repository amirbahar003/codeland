"use client";

import { useEffect, useState } from "react";
import MobileCodeEditor from "./MobileCodeEditor";
import CodeEditor from "./CodeEditor";
export default function ResponsiveCodeEditor() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function checkScreen() {
            setIsMobile(window.innerWidth < 768);
        }

        checkScreen();

        window.addEventListener("resize", checkScreen);

        return () => {
            window.removeEventListener("resize", checkScreen);
        };
    }, []);

    if (isMobile) {
        return <MobileCodeEditor />;
    }

    return <CodeEditor />;
}
