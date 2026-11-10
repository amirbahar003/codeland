"use client";
import { useEffect, useState } from "react";
import { getCurriculum } from "@/lib/api/Courses";
export default function useCurriculum(courseId) {
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!courseId) return;

        async function loadCurriculum() {
            try {
                setLoading(true);
                setError("");

                const data = await getCurriculum(courseId);

                setCurriculum(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadCurriculum();
    }, [courseId]);

    return {
        curriculum,
        loading,
        error,
    };
}
