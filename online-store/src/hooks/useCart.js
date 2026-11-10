"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = async (url) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    if (response.status === 401) {
        return {
            items: [],
        };
    }

    if (!response.ok) {
        throw new Error("دریافت سبد خرید با خطا مواجه شد.");
    }

    return response.json();
};

const fetchCourse = async (courseId) => {
    const response = await fetch(`${API_URL}/Courses/${courseId}`, {
        method: "GET",
        credentials: "include",
    });

    if (response.status === 401) {
        return {
            items: [],
        };
    }

    if (!response.ok) {
        throw new Error("دریافت سبد خرید با خطا مواجه شد.");
    }

    return response.json();
};

export default function useCart() {
    const { data: cart, error, isLoading, mutate } = useSWR(`${API_URL}/Cart`, fetcher);

    const [items, setItems] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesError, setCoursesError] = useState("");

    useEffect(() => {
        const loadCartCourses = async () => {
            if (!cart?.items?.length) {
                setItems([]);
                return;
            }

            try {
                setCoursesLoading(true);
                setCoursesError("");

                const enrichedItems = await Promise.all(
                    cart.items.map(async (item) => {
                        const course = await fetchCourse(item.courseId);

                        return {
                            ...item,
                            ...course,
                        };
                    })
                );

                setItems(enrichedItems);
            } catch (error) {
                console.error(error);
                setCoursesError("دریافت اطلاعات دوره‌های سبد خرید با خطا مواجه شد.");
                setItems([]);
            } finally {
                setCoursesLoading(false);
            }
        };

        loadCartCourses();
    }, [cart]);

    const addToCart = async (courseId) => {
        const response = await fetch(`${API_URL}/Cart/items`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                courseId,

                quantity: 1,
            }),
        });

        if (response.status === 401) {
            throw new Error("برای افزودن دوره به سبد خرید ابتدا وارد حساب کاربری شوید.");
        }

        if (!response.ok) {
            throw new Error("افزودن دوره به سبد خرید با خطا مواجه شد.");
        }

        const updatedCart = await response.json();

        await mutate();

        return updatedCart;
    };

    const updateQuantity = async (courseId, quantity) => {
        const response = await fetch(`${API_URL}/Cart/items/${courseId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quantity,
            }),
        });

        if (response.status === 401) {
            throw new Error("برای تغییر تعداد ابتدا وارد حساب کاربری شوید.");
        }

        if (!response.ok) {
            throw new Error("تغییر تعداد دوره با خطا مواجه شد.");
        }

        const updatedCart = await response.json();

        await mutate();

        return updatedCart;
    };

    const removeItem = async (courseId) => {
        const response = await fetch(`${API_URL}/Cart/items/${courseId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.status === 401) {
            throw new Error("برای حذف دوره ابتدا وارد حساب کاربری شوید.");
        }

        if (!response.ok) {
            throw new Error("حذف دوره از سبد خرید با خطا مواجه شد.");
        }

        const updatedCart = await response.json();

        await mutate();

        return updatedCart;
    };
    return {
        items,
        loading: isLoading || coursesLoading,
        error: error?.message || coursesError,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart: mutate,
    };
}
