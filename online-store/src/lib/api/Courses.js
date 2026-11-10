import { apiFetch } from "./Client";

export async function getCourses(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) {
        searchParams.set("Page", params.page);
    }

    if (params.pageSize !== undefined) {
        searchParams.set("PageSize", params.pageSize);
    }

    if (params.search) {
        searchParams.set("Search", params.search);
    }

    if (params.categoryId) {
        searchParams.set("CategoryId", params.categoryId);
    }

    if (params.minPrice !== undefined) {
        searchParams.set("MinPrice", params.minPrice);
    }

    if (params.maxPrice !== undefined) {
        searchParams.set("MaxPrice", params.maxPrice);
    }

    if (params.sortBy) {
        searchParams.set("SortBy", params.sortBy);
    }

    if (params.sortOrder) {
        searchParams.set("SortOrder", params.sortOrder);
    }

    const query = searchParams.toString();

    return apiFetch(`/Courses${query ? `?${query}` : ""}`);
}

export async function getCourseById(id) {
    return apiFetch(`/Courses/${id}`);
}

export async function getCourseBySlug(slug) {
    return apiFetch(`/Courses/slug/${slug}`);
}
export async function getCurriculum(courseId) {
    return apiFetch(`/Curriculum/course/${courseId}`);
}

export async function createCourse(formData, token) {
    return apiFetch("/Courses", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
}

export async function updateCourse(id, formData, token) {
    return apiFetch(`/Courses/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
}

export async function deleteCourse(id, token) {
    return apiFetch(`/Courses/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
