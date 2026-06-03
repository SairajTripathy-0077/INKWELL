const API_URL = 'https://localhost:3000/api';

export const api ={
    login: async(username: String, password: String) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },

    getBooks: async(token: String) => {
        const res = await fetch(`${API_URL}/books`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    }
}