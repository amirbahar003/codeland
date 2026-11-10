"use client";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import useCourses from "@/hooks/useCourse";
import useCategories from "@/hooks/useCategories";
import CoursesCard from "../../components/Courses/CoursesCard";
import CoursesHeader from "../../components/Courses/CoursesHeader";
import CoursesSidebar from "../../components/Courses/CoursesSidebar";
import ViewMoreButton from "../../components/ViewmoreButton/Viewmorebutton";
import useCart from "@/hooks/useCart";
import CartToast from "../../components/CartToast/CartToast";

export default function FrontEndCoursesPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [categoryId, setCategoryId] = useState("");
    const { categories } = useCategories();
    const { addToCart } = useCart();
    const [showCartToast, setShowCartToast] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [cartToastType, setCartToastType] = useState("success");

    const frontEndCategory = categories.find((category) => category.name?.toLowerCase() === "front-end" || category.name?.toLowerCase() === "frontend");

    const { courses, loading, error } = useCourses({
        categoryId: categoryId || frontEndCategory?.id,
        search,
        sort,
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

            {/* Mobile Filter Button */}
            <div className="mx-auto mt-6 flex w-[96%] max-w-7xl justify-end lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#100D24] px-4 py-3 text-sm font-medium text-white transition hover:border-[#A78BFA]/40 hover:bg-[#15112f]"
                >
                    <SlidersHorizontal size={18} className="text-[#A78BFA]" />
                    فیلتر و مرتب‌سازی
                </button>
            </div>

            {/* Courses + Desktop Sidebar */}
            <div className="mx-auto mt-10 grid w-[96%] max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                {/* Courses */}
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

                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                    <CoursesSidebar categories={categories} onSearch={setSearch} onSortChange={setSort} onCategoriesChange={setCategoryId} />
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />

                    {/* Drawer */}
                    <div className="animate-[slideInRight_0.3s_ease-out] absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto border-l border-white/10 bg-[#080B1D] p-5 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between" dir="rtl">
                            <h2 className="text-lg font-bold text-white">فیلتر و مرتب‌سازی</h2>

                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(false)}
                                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <CoursesSidebar categories={categories} onSearch={setSearch} onSortChange={setSort} onCategoriesChange={setCategoryId} />
                    </div>
                </div>
            )}
        </main>
    );
}
