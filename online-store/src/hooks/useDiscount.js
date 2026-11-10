"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useDiscount() {
    const [discountResult, setDiscountResult] = useState(null);
    const [discountLoading, setDiscountLoading] = useState(false);
    const [discountError, setDiscountError] = useState("");


    const applyDiscount = async (code, price) => {
        try {
            setDiscountLoading(true);
            setDiscountError("");
            setDiscountResult(null);

            const response = await fetch(`${API_URL}/Discount/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    price,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "اعمال کد تخفیف ناموفق بود.");
            }

            setDiscountResult(data);

            return data;
        } catch (error) {
            console.error("Discount error:", error);

            setDiscountError(error.message);
            return null;
        } finally {
            setDiscountLoading(false);
        }
    };

    return {
        applyDiscount,
        discountResult,
        discountLoading,
        discountError,
    };
}
