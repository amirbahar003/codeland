"use client";

import { useEffect, useState } from "react";

export default function useGlobalDiscount() {
    const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalDiscount = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Discount/global`);

                if (!response.ok) {
                    setDiscount(null);
                    return;
                }

                const data = await response.json();

                setDiscount(data);
            } catch (error) {
                console.error("Error fetching global discount:", error);
                setDiscount(null);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalDiscount();
    }, []);

    return {
        discount,
        loading,
    };
}
