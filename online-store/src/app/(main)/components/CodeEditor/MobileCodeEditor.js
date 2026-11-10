"use client";

import { FileCode2 } from "lucide-react";

import useCodeEditor from "./useCodeEditor";

export default function MobileCodeEditor() {
    const code = `const developer = {
    name: "CodeLand",
    skills: [
        "JavaScript",
        "React",
        "Next.js"
    ],
    passion: "Building the future"
};`;

    function getTokenClass(part, line) {
        if (part === "const") {
            return "text-blue-300";
        }

        if (line.includes(`const ${part}`)) {
            return "text-blue-200";
        }

        if (part.startsWith('"')) {
            return "text-cyan-300";
        }

        if (line.includes(`${part}:`)) {
            return "text-violet-300";
        }

        if (part === "{" || part === "}" || part === "[" || part === "]") {
            return "text-slate-300";
        }

        if (part === ":" || part === "=") {
            return "text-slate-400";
        }

        return "";
    }

    function highlightLine(line) {
        const parts = line.split(
            /(const|"[^"]*"|[a-zA-Z]+(?=\s*:)|[{}[\]]|[=:])/
        );

        return parts.map((part, index) => (
            <span key={index} className={getTokenClass(part, line)}>
                {part}
            </span>
        ));
    }

    const { lines } = useCodeEditor(code);

    return (
        <div className="relative w-full">
            {/* Glow */}
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-blue-500/10 blur-3xl" />

            {/* Editor */}
            <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0A0E24]/70 via-[#080B1D]/60 to-[#050816]/70 shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur-2xl">

                {/* Top Glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

                {/* Header */}
                <div className="flex h-10 items-center border-b border-white/[0.06] px-3">

                    {/* Traffic Lights */}
                    <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-400/70" />
                        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                        <span className="h-2 w-2 rounded-full bg-green-400/70" />
                    </div>

                    {/* File */}
                    <div className="ml-3 flex h-full items-center gap-1.5 border-b border-blue-400/60 px-2">
                        <FileCode2
                            size={12}
                            className="text-yellow-400/70"
                        />

                        <span className="text-[10px] text-slate-300">
                            developer.js
                        </span>
                    </div>
                </div>

                {/* Code */}
                <div className="px-2.5 py-3">
                    <pre className="overflow-x-auto font-mono text-[10px] leading-6 text-slate-300">
                        <code>
                            {lines.map((line, index) => (
                                <div
                                    key={index}
                                    className={`flex rounded-md ${
                                        index === lines.length - 1
                                            ? "border-l border-blue-400/40 bg-white/[0.025]"
                                            : ""
                                    }`}
                                >
                                    {/* Line Number */}
                                    <span className="mr-2 w-5 shrink-0 select-none border-r border-white/[0.06] pr-1.5 text-right text-[9px] text-slate-600/70">
                                        {index + 1}
                                    </span>

                                    {/* Code */}
                                    <span className="inline-flex items-center">
                                        {highlightLine(line)}

                                        {index === lines.length - 1 && (
                                            <span className="ml-1 h-3.5 w-[2px] animate-pulse bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                        )}
                                    </span>
                                </div>
                            ))}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    )
}