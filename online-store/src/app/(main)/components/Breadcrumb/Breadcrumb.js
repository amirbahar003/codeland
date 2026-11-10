"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
    return (
        <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/45">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                            {isLast ? (
                                <span aria-current="page" className="max-w-[60vw] truncate font-medium text-white">
                                    {item.label}
                                </span>
                            ) : (
                                <>
                                    <Link href={item.href} className="rounded transition-colors hover:text-[#00B8FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00B8FF]">
                                        {item.label}
                                    </Link>

                                    <ChevronLeft size={14} aria-hidden="true" />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
