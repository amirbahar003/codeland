const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function getCurriculumByCourseId(courseId) {
    const response = await fetch(
        `${API_URL}/Curriculum/course/${courseId}`
    );

    if (!response.ok) {
        throw new Error("خطا در دریافت سرفصل‌های دوره");
    }

    return response.json();
}