export default function TimeBox({ value, label }) {
    return (
        <div className="flex min-w-[46px] flex-col items-center rounded-lg bg-white/5 px-2.5 py-1.5">
            <span className="text-sm font-bold tabular-nums text-white">{String(value).padStart(2, "0")}</span>

            <span className="text-[10px] text-white/50">{label}</span>
        </div>
    );
}
