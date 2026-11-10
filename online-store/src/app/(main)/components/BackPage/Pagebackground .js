export default function PageBackground() {
    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {/* شبکه‌ی خطی (کم‌رنگ‌تر از کارت تا متن‌ها خوانا بمانند) + محو شدن در لبه‌ها */}
            <div
                className="absolute inset-0 opacity-[0.07]
                           bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
                           bg-[size:40px_40px]
                           [mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,#000_30%,transparent_100%)]"
            />

            {/* درخشش صورتی بالا راست */}
            <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#FF2E93] opacity-20 blur-[120px]" />

            {/* درخشش آبی پایین چپ */}
            <div className="absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full bg-[#22D3EE] opacity-15 blur-[120px]" />

            {/* درخشش آبی ملایم وسط برای عمق */}
            <div className="absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#3B82F6] opacity-10 blur-[140px]" />
        </div>
    );
}
