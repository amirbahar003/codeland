import "./globals.css";
import localFont from "next/font/local";

export const metadata = {
    title: "CodeLand",
    description: "Learn programming with CodeLand",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

const peyda = localFont({
    src: [
        { path: "./fonts/Peyda-Regular.ttf", weight: "400", style: "normal" },
        { path: "./fonts/Peyda-Medium.ttf", weight: "500", style: "normal" },
        { path: "./fonts/Peyda-SemiBold.ttf", weight: "600", style: "normal" },
        { path: "./fonts/Peyda-Bold.ttf", weight: "700", style: "normal" },
        { path: "./fonts/Peyda-ExtraBold.ttf", weight: "800", style: "normal" },
    ],
    variable: "--font-peyda",
});

export default function RootLayout({ children }) {
    return (
        <html lang="fa">
            <body className={`${peyda.className} font-[var(--font-peyda)] bg-[#030712] text-slate-100 overflow-x-hidden`}>{children}</body>
        </html>
    );
}
