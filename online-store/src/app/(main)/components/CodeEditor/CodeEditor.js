"use client";

import { FileCode2 } from "lucide-react";
import { SiJavascript } from "react-icons/si";
import useCodeEditor from "./useCodeEditor";

export default function CodeEditor() {
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
        const parts = line.split(/(const|"[^"]*"|[a-zA-Z]+(?=\s*:)|[{}[\]]|[=:])/);

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
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-violet-500/5 blur-3xl" />

            {/* Code Editor */}
            <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0A0E24]/70 via-[#080B1D]/60 to-[#050816]/70 shadow-[0_0_60px_rgba(59,130,246,0.08)] backdrop-blur-2xl transition-transform duration-500 ease-out hover:rotate-3">
                {/* Top Glow Line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

                {/* Editor Header */}
                <div className="flex h-12 items-center border-b border-white/[0.06] px-3 sm:px-4">
                    {/* Traffic Lights */}
                    <div className="flex gap-1.5 sm:gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70 sm:h-3 sm:w-3" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70 sm:h-3 sm:w-3" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70 sm:h-3 sm:w-3" />
                    </div>

                    {/* File */}
                    <div className="ml-3 flex h-full items-center gap-1.5 border-b border-blue-400/60 px-2 sm:ml-5 sm:gap-2 sm:px-3">
                        <FileCode2 size={13} className="text-yellow-400/70 sm:h-3.5 sm:w-3.5" />

                        <span className="text-[11px] text-slate-300 sm:text-xs">developer.js</span>
                    </div>
                </div>

                {/* Code */}
                <div className="px-3 sm:px-6">
                    <pre className="overflow-x-auto font-mono text-xs leading-7 text-slate-300 sm:text-sm">
                        <code>
                            {lines.map((line, index) => (
                                <div key={index} className={`flex rounded-md ${index === lines.length - 1 ? "border-l border-blue-400/40 bg-white/[0.025]" : ""}`}>
                                    {/* Line Number */}
                                    <span className="mr-3 w-6 shrink-0 select-none border-r border-white/[0.06] pr-2 text-right text-[10px] text-slate-600/70 sm:mr-6 sm:w-8 sm:pr-4 sm:text-xs">
                                        {index + 1}
                                    </span>

                                    {/* Code */}
                                    <span className="inline-flex items-center">
                                        {highlightLine(line)}

                                        {index === lines.length - 1 && <span className="ml-1 h-4 w-[2px] animate-pulse bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
                                    </span>
                                </div>
                            ))}
                        </code>
                    </pre>
                    {/* Status Bar */}

                    <div className="flex h-8 items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-3 font-mono text-[9px] text-slate-500 sm:text-[10px]">
                        {/* Top Glow */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                        {/* Left Side */}
                        <div className="relative z-10 flex items-center gap-3">
                            <span className="transition-colors duration-300 hover:text-blue-300">Ln 1, Col 1</span>
                        </div>

                        {/* Right Side */}
                        <div className="relative z-10 flex items-center gap-2">
                            <SiJavascript size={12} className="text-yellow-400/80 transition-all duration-300 group-hover:text-yellow-300" />

                            <span className="transition-colors duration-300 hover:text-cyan-300">JavaScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
