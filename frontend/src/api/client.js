import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api";
export const api = axios.create({ baseURL });
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("scholarpath_token");
    if (token)
        cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});
export async function sendChat(payload) {
    const { data } = await api.post("/chat", payload);
    return data;
}
export async function getHealth() {
    const { data } = await api.get("/health");
    return data;
}
export async function apiRegister(name, studentId, email, password) {
    const { data } = await api.post("/auth/register", { name, studentId, email, password });
    return data;
}
export async function apiLogin(identifier, password) {
    const { data } = await api.post("/auth/login", { identifier, password });
    return data;
}
