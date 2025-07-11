export const API_URL = "https://accident-monitor.onrender.com";

/* ── localStorage helpers ─────────────────────────── */
export const setToken = (t) => {
    if (typeof t === "string" && t.trim()) {
        localStorage.setItem("token", t);
    } else {
        console.error("setToken called with invalid token:", t);
    }
};

export const getToken = () => localStorage.getItem("token");
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const setUser = (u) => localStorage.setItem("user", JSON.stringify(u));
export const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

/* ── generic wrapper that adds JWT ────────────────── */
export const authFetch = async (url, opts = {}) => {
    const token = getToken();
    const res = await fetch(url, {
        ...opts,
        headers: {
            ...(opts.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    console.log("response: ", res);
    if (!res.ok) {
        const { detail } = await res.json().catch(() => ({}));
        throw new Error(detail || `Request failed (${res.status})`);
    }
    return res;
};

/* ── login / signup (store token + user) ───────────── */
export const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Bad credentials");

    // 🔹 READ THE BODY ONCE
    const data = await res.json();           // { access_token, user }

    const { access_token, user } = data;
    if (!access_token) throw new Error("No token returned");

    setToken(access_token);  
    setUser(user);          
    return data;             
};

export const signup = async (email, password, name = null) => {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email: email, 
            password, 
            ...(name ? { name } : {}),  // include only if provided
        }),
    });
    console.log(res)
    if (!res.ok) throw new Error("Signup failed");

    const { access_token } = await res.json();
    if (!access_token) throw new Error("access_token missing");

    setToken(access_token);
    setUser({ email });
    return access_token;
};

/* ── PATCH /profile helper (multipart) ─────────────── */
export const patchProfile = async ({ name, vehicleId, driverId, avatarFile }) => {
    const form = new FormData();
    if (name !== undefined) form.append("name", name);
    if (vehicleId !== undefined) form.append("vehicleId", vehicleId);
    if (driverId !== undefined) form.append("driverId", driverId);
    if (avatarFile !== undefined) form.append("avatar", avatarFile);

    const res = await authFetch(`${API_URL}/profile`, {
        method: "PATCH",
        body: form,
    });
    return await res.json(); // { msg, user }
};
