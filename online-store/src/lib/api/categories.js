import { apiFetch } from "./Client";

export async function getCategories() {
    return apiFetch("/Category");
}