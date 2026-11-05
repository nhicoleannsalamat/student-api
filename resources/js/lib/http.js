const API_BASE = '/api';

export const getToken = () => localStorage.getItem('auth_token');

export const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem('auth_user'));
    } catch (e) {
        return null;
    }
};

export const saveSession = (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
};

export const clearSession = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
};

export async function apiRequest(path, { method = 'GET', body } = {}) {
    const headers = { Accept: 'application/json' };
    if (body) headers['Content-Type'] = 'application/json';

    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(API_BASE + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    let payload = null;
    try {
        payload = await response.json();
    } catch (e) {
    }

    if (!response.ok) {
        const err = new Error(payload?.message || 'Something went wrong.');
        err.status = response.status;
        err.errors = payload?.errors || {};
        throw err;
    }

    return payload;
}