"use client";

import { useState } from "react";
import { Search, LayoutGrid, Check } from "lucide-react";

const sortOptions = [
    { id: "default", label: "پیشفرض" },
    { id: "popular", label: "پرطرفدار ترین" },
    { id: "newest", label: "جدید ترین" },
    { id: "updated", label: "آخرین آپدیت" },
];

const cardClass = "rounded-2xl border border-white/10 bg-[#100D24] p-5 sm:p-6";

export default function CoursesSidebar({ categories = [], onSearch, onCategoriesChange, onSortChange }) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState([]);
    const [sort, setSort] = useState("default");
    const handleSort = (id) => {
        setSort(id);
        onSortChange?.(id);
    };

    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };
    const toggle = (id) => {
        const next = selected.includes(id) ? [] : [id];

        setSelected(next);
        onCategoriesChange?.(next[0] ?? "");
    };

    return (
        <aside dir="rtl" className="flex w-full flex-col gap-4 lg:sticky lg:top-28">
            {/* Search */}
            <div className={cardClass}>
                <label className="group flex items-center gap-3">
                    <Search size={22} className="shrink-0 text-white/40 transition-colors group-focus-within:text-[#A78BFA]" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="جستجو در بین دوره های کدلند"
                        className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
                    />
                </label>
            </div>

            {/* Categories */}
            <div className={cardClass}>
                <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                    <LayoutGrid size={26} strokeWidth={1.6} className="text-[#A78BFA]" />
                    <h3 className="text-lg font-bold text-white">دسته بندی</h3>
                </div>

                <ul
                    className="mt-5 max-h-[420px] space-y-4 overflow-y-auto pl-3
                     [&::-webkit-scrollbar]:w-1
                     [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/5
                     [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
                     [&::-webkit-scrollbar-thumb]:from-[#8B5CF6] [&::-webkit-scrollbar-thumb]:to-[#3B82F6]"
                >
                    {categories.map((c) => {
                        const checked = selected.includes(c.id);
                        return (
                            <li key={c.id}>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input type="checkbox" checked={checked} onChange={() => toggle(c.id)} className="peer sr-only" />
                                    <span
                                        className="grid h-6 w-6 shrink-0 place-items-center rounded-md
                               border border-white/10 bg-white/[0.06] text-transparent
                               transition-all
                               peer-checked:border-transparent peer-checked:bg-gradient-to-br
                               peer-checked:from-[#8B5CF6] peer-checked:to-[#3B82F6] peer-checked:text-white
                               peer-focus-visible:ring-2 peer-focus-visible:ring-[#A78BFA]"
                                    >
                                        <Check size={14} strokeWidth={3} />
                                    </span>
                                    <span className={`text-[15px] transition-colors ${checked ? "font-medium text-white" : "text-white/70 hover:text-white"}`}>{c.name}</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Sort */}
            <div className={cardClass}>
                <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                    <LayoutGrid size={26} strokeWidth={1.6} className="text-[#A78BFA]" />
                    <h3 className="text-lg font-bold text-white">مرتب سازی</h3>
                </div>

                <ul className="mt-5 space-y-4">
                    {sortOptions.map((o) => {
                        const active = sort === o.id;
                        return (
                            <li key={o.id}>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input type="radio" name="courses-sort" value={o.id} checked={active} onChange={() => handleSort(o.id)} className="peer sr-only" />
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full  border border-white/10 bg-white/[0.06] transition-all  peer-checked:border-transparent peer-checked:bg-gradient-to-br  peer-checked:from-[#8B5CF6] peer-checked:to-[#3B82F6] peer-checked:shadow-[0_0_14px_rgba(139,92,246,.55)] peer-focus-visible:ring-2 peer-focus-visible:ring-[#A78BFA]">
                                        <span className={`h-2 w-2 rounded-full bg-white transition-transform ${active ? "scale-100" : "scale-0"}`} />
                                    </span>
                                    <span className={`text-[15px] transition-colors ${active ? "font-medium text-white" : "text-white/70 hover:text-white"}`}>{o.label}</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
