"use client";

import {useEffect, useState} from "react";
import { api } from "@/lib/api";

interface Book {
    _id: string;
    title: string;
    author: string;
    status: string;
}

export default function Dashboard({ token }: { token: string }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await api.getBooks(token);
                if (res.success) {
                    setBooks(res.data);
                }
            } catch (err) {
                console.error("Error fetching books:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [token]);

    return (
        <div className="p-12 z-10 relative h-full flex flex-col">
            <h1 className="text-5xl border-b-2 border-white pb-2 mb-8">
                INKWELL.EXE 
            </h1>

            {loading ? (
                <p className="text-3xl animate-pulse">FETCHING DATA...</p>
            ) : (
                <table className="w-full text-2xl bg-black/40 border-collapse">
                <thead>
                    <tr>
                    <th className="border-2 border-white p-3 text-left">TITLE</th>
                    <th className="border-2 border-white p-3 text-left">AUTHOR</th>
                    <th className="border-2 border-white p-3 text-left">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="border-2 border-white p-3 text-center text-zinc-500">
                        NO DATA FOUND IN DATABASE.
                        </td>
                    </tr>
                    ) : (
                    books.map((book) => (
                        <tr key={book._id} className="hover:bg-blue-800 transition-colors">
                        <td className="border-2 border-white p-3 uppercase">{book.title}</td>
                        <td className="border-2 border-white p-3 uppercase">{book.author}</td>
                        <td className="border-2 border-white p-3 uppercase">{book.status}</td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            )}
        </div>
    );
}