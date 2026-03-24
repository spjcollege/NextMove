const API = "http://127.0.0.1:8000";

function getToken() {
    const data = localStorage.getItem("auth");
    if (!data) return null;
    return JSON.parse(data).token;
}

function getUser() {
    const data = localStorage.getItem("auth");
    if (!data) return null;
    return JSON.parse(data).user;
}

function setAuth(token, user) {
    localStorage.setItem("auth", JSON.stringify({ token, user }));
}

function clearAuth() {
    localStorage.removeItem("auth");
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Network error" }));
        throw new Error(err.detail || "Something went wrong");
    }

    return res.json();
}

export { API, getToken, getUser, setAuth, clearAuth, apiFetch };
