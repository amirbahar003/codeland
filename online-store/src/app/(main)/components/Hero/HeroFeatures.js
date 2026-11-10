"use client";
import { Grid2X2, BriefcaseBusiness, Brain } from "lucide-react";
export default function HeroFeatures() {
    const features = [
        {
            icon: Grid2X2,
            text: "یادگیری از پایه تا پیشرفته",
        },
        {
            icon: BriefcaseBusiness,
            text: "پروژه واقعی برای تمرین",
        },
        {
            icon: Brain,
            text: "مهارت کاربردی",
        },
    ];
    return (
        <div className="mt-6 flex shrink-0 items-center justify-center  gap-10  text-sm text-slate-300 sm:justify-between">
            {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                    <div key={feature.text} className=" flex items-center gap-2.5 whitespace-nowrap transition-colors duration-300 hover:text-slate-100">
                        <Icon size={22} strokeWidth={1.7} className=" text-blue-400/80 transition-all duration-300 " />

                        <span>{feature.text}</span>
                    </div>
                );
            })}
        </div>
    );
}
