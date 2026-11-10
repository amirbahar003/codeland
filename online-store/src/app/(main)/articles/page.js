"use client";

import { apiFetch } from "@/lib/api/Client";
import { useEffect, useState } from "react";

export default function CoursesTest() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCourses() {
            try {
                const data = await apiFetch("/Courses");

                setCourses(data.items);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadCourses();
    }, []);
    if (loading) {
        return <div>در حال دریافت دوره‌ها...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {courses.map((course) => (
                <div key={course.id}>{course.title}</div>
            ))}
        </div>
    );
}
