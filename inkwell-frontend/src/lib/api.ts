const API_URL = 'http://localhost:3000';

export const api ={
    login: async(username: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },

    getBooks: async(token: string) => {
        const res = await fetch(`${API_URL}/books`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },
    register: async(username: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },
    createBook: async (token: string, title: string, author: string, status: string) => {
        const res = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, author, status })
        });
        return res.json();
    },
    deleteBook: async (token: string, id: string) => {
        const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },
    updateBook: async (token: string, id: string, status: string) => {
        const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
        });
        return res.json();
    }
}