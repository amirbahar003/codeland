"use client";

import { getCategories } from "@/lib/api/categories";
import { useEffect, useState } from "react";

export default function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories();

                setCategories(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    return {
        categories,
        loading,
        error,
    };
}
