"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/lib/api/Courses";

export default function useCourses({ categoryId, search, sort } = {}) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const sortConfig = {
        default: {},
        newest: {
            sortBy: "newest",
        },
        updated: {
            sortBy: "updated",
        },
        popular: {
            sortBy: "popular",
        },
    };
    useEffect(() => {
        async function loadCourses() {
            try {
                setLoading(true);
                setError("");

                const data = await getCourses({
                    page: 1,
                    pageSize: 10,
                    categoryId,
                    search,
                    ...sortConfig[sort],
                });

                const mappedCourses = data.items.map((course) => ({
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    slug: course.slug,
                    category: course.category?.name ?? "بدون دسته‌بندی",
                    price: course.price,

                    cover: course.thumbnailId ? `${process.env.NEXT_PUBLIC_API_URL}/Files/${course.thumbnailId}` : null,

                    level: course.level === "Beginner" ? 1 : course.level === "Intermediate" ? 2 : 3,

                    hours: Math.round(course.durationMinutes / 60),

                    students: 0,
                    rating: 0,

                    teacher: course.instructorId ? "مدرس دوره" : "مدرس مشخص نشده",

                    href: `/courses/${course.id}`,
                }));

                setCourses(mappedCourses);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadCourses();
    }, [categoryId, search, sort]);

    return {
        courses,
        loading,
        error,
    };
}
