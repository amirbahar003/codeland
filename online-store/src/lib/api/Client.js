const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint, options = {}) {
    const headers = {
        ...options.headers,
    };

    // اگر body از نوع FormData نباشد، JSON ارسال می‌کنیم
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.detail || data?.title || "Something went wrong");
    }

    return data;
}
