"use client";

import { useEffect, useState } from "react";

import useCourses from "@/hooks/useCourse";
import CoursesCard from "../components/Courses/CoursesCard";
import CoursesHeader from "../components/Courses/CoursesHeader";
import CoursesSidebar from "../components/Courses/CoursesSidebar";
import ViewMoreButton from "../components/ViewmoreButton/Viewmorebutton";
import useCategories from "@/hooks/useCategories";
import CartToast from "../components/CartToast/CartToast";
import useCart from "@/hooks/useCart";

export default function CoursesPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [categoryId, setCategoryId] = useState("");
    const [showCartToast, setShowCartToast] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [cartToastType, setCartToastType] = useState("success");
    const { categories } = useCategories();

    const { addToCart } = useCart();

    const { courses, loading, error } = useCourses({
        search,
        sort,
        categoryId,
    });

    const handleAddToCart = async (course) => {
        try {
            await addToCart(course.id);

            setCartMessage("دوره با موفقیت به سبد خرید اضافه شد.");
            setCartToastType("success");
            setShowCartToast(true);
        } catch (error) {
            if (error.message.includes("ابتدا وارد حساب کاربری شوید")) {
                setCartMessage("برای افزودن دوره، ابتدا وارد حساب کاربری شوید.");
                setCartToastType("error");
                setShowCartToast(true);
                return;
            }

            console.error(error);
            setCartMessage("افزودن دوره به سبد خرید با خطا مواجه شد.");
            setCartToastType("error");
            setShowCartToast(true);
        }
    };

    useEffect(() => {
        if (!showCartToast) return;

        const timer = setTimeout(() => {
            setShowCartToast(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [showCartToast]);

    return (
        <main className="min-h-screen">
            <CartToast show={showCartToast} onClose={() => setShowCartToast(false)} message={cartMessage} type={cartToastType} />

            <CoursesHeader />

            <div className="mx-auto mt-10 grid w-[96%] max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                    {loading && <div className="py-20 text-center text-slate-400">در حال دریافت دوره‌ها...</div>}

                    {error && <div className="py-20 text-center text-red-400">{error}</div>}

                    {!loading && !error && (
                        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {courses.map((course, index) => (
                                <CoursesCard key={course.id} variant={index % 3} course={course} onAddToCart={handleAddToCart} />
                            ))}
                        </section>
                    )}

                    <ViewMoreButton />
                </div>

                <CoursesSidebar categories={categories} onSearch={setSearch} onSortChange={setSort} onCategoriesChange={setCategoryId} />
            </div>
        </main>
    );
}
