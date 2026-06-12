"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface Book {
  _id: string;
  title: string;
  author: string;
  status: string;
}

export default function Dashboard({ token, onLogout }: { token: string; onLogout?: () => void }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Inside Dashboard component:
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");


  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newStatus, setNewStatus] = useState("PLAN TO READ");

  // Fetch books on load (Memorized!)
  const fetchBooks = useCallback(async () => {
    try {
      const res = await api.getBooks(token, debouncedQuery);
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  }, [token, debouncedQuery]); 

  useEffect(() => {
    (async () => {
      await fetchBooks();
    })();
  }, [fetchBooks]);

  useEffect(() => {
  // Set up a timer to update debouncedQuery after 400ms of inactivity
  const handler = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 400);
  // Clear timer if searchQuery changes before the 400ms is up (user is still typing)
  return () => {
    clearTimeout(handler);
  };
}, [searchQuery]);

  // --- NEW FEATURES ---

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;
    
    const res = await api.createBook(token, newTitle, newAuthor, newStatus);
    if (res.success) {
      setNewTitle("");
      setNewAuthor("");
      setNewStatus("PLAN TO READ");
      fetchBooks(); // Refresh the list
    }
  };

  const handleDelete = async (id: string) => {
    const res = await api.deleteBook(token, id);
    if (res.success) fetchBooks(); // Refresh the list
  };

  const handleCycleStatus = async (id: string, currentStatus: string) => {
    // Cycle through statuses
    let nextStatus = "PLAN TO READ";
    if (currentStatus === "PLAN TO READ") nextStatus = "READING";
    if (currentStatus === "READING") nextStatus = "FINISHED";

    const res = await api.updateBook(token, id, nextStatus);
    if (res.success) fetchBooks(); // Refresh the list
  };

  return (
    <div className="p-8 z-10 relative h-full flex flex-col font-sans">
      <div className="flex justify-between items-end border-b-2 border-white pb-2 mb-6 animate-pulse-subtle">
        <h1 className="text-4xl tracking-widest uppercase">INKWELL.EXE</h1>
        <button 
          onClick={onLogout || (() => window.location.reload())} 
          className="bg-red-700 text-white px-4 py-1 font-bold border-2 border-white hover:bg-red-500 active:bg-white active:text-black cursor-pointer"
        >
          LOGOUT
        </button>
      </div>

      {/* SEARCH PANEL */}
      <div className="flex gap-4 mb-6 bg-black/40 p-4 border-2 border-zinc-500 items-end">
        <div className="flex flex-col flex-1 gap-1">
          <label className="text-sm tracking-widest text-zinc-400">SEARCH DATABASE</label>
          <input 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="bg-transparent border-b-2 border-white outline-none text-xl p-1 uppercase focus:border-green-400 font-mono" 
            placeholder="SEARCH BY TITLE OR AUTHOR..." 
          />
        </div>
        {searchQuery && (
          <button 
            type="button"
            onClick={() => setSearchQuery("")} 
            className="bg-zinc-800 border-2 border-white px-4 py-1.5 text-lg hover:bg-zinc-600 active:bg-white active:text-black transition-colors tracking-widest cursor-pointer"
          >
            CLEAR [X]
          </button>
        )}
      </div>

      {/* NEW ENTRY FORM */}
      <form onSubmit={handleAddBook} className="flex gap-4 mb-8 bg-black/40 p-4 border-2 border-zinc-500">
        <div className="flex flex-col flex-1 gap-1">
          <label className="text-sm tracking-widest text-zinc-400">TITLE</label>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-transparent border-b-2 border-white outline-none text-xl p-1 uppercase focus:border-green-400" placeholder="ENTER TITLE..." />
        </div>
        <div className="flex flex-col flex-1 gap-1">
          <label className="text-sm tracking-widest text-zinc-400">AUTHOR</label>
          <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} className="bg-transparent border-b-2 border-white outline-none text-xl p-1 uppercase focus:border-green-400" placeholder="ENTER AUTHOR..." />
        </div>
        <div className="flex flex-col w-48 gap-1">
          <label className="text-sm tracking-widest text-zinc-400">STATUS</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="bg-transparent border-b-2 border-white outline-none text-xl p-1 uppercase cursor-pointer text-white [&>option]:bg-blue-900 focus:border-green-400">
            <option value="PLAN TO READ">PLAN TO READ</option>
            <option value="READING">READING</option>
            <option value="FINISHED">FINISHED</option>
          </select>
        </div>
        <button type="submit" className="self-end bg-green-700 border-2 border-white px-6 py-2 text-xl hover:bg-green-500 active:bg-white active:text-black transition-colors tracking-widest">
          ADD [+]
        </button>
      </form>

      {/* DATA TABLE */}
      {loading ? (
        <p className="text-3xl animate-pulse">FETCHING DATA...</p>
      ) : (
        <div className="overflow-y-auto max-h-[40vh] border-2 border-white custom-scrollbar">
          <table className="w-full text-xl bg-black/40 border-collapse">
            <thead className="sticky top-0 bg-blue-900 border-b-2 border-white">
              <tr>
                <th className="border-r-2 border-white p-3 text-left">TITLE</th>
                <th className="border-r-2 border-white p-3 text-left">AUTHOR</th>
                <th className="border-r-2 border-white p-3 text-center">STATUS</th>
                <th className="p-3 text-center w-32">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-400 tracking-widest">
                    NO LOGS FOUND. AWAITING INPUT.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="hover:bg-blue-800/50 transition-colors border-b border-white/20">
                    <td className="border-r-2 border-white/20 p-3 uppercase">{book.title}</td>
                    <td className="border-r-2 border-white/20 p-3 uppercase">{book.author}</td>
                    <td className="border-r-2 border-white/20 p-3 text-center">
                      <button 
                        onClick={() => handleCycleStatus(book._id, book.status)}
                        className={`px-3 py-1 text-sm border hover:bg-white hover:text-black transition-colors ${book.status === 'FINISHED' ? 'border-green-400 text-green-400' : book.status === 'READING' ? 'border-yellow-400 text-yellow-400' : 'border-zinc-400 text-zinc-400'}`}
                      >
                        [{book.status}]
                      </button>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button onClick={() => handleDelete(book._id)} className="text-red-400 hover:text-white hover:bg-red-600 px-2 py-1 border border-transparent hover:border-white transition-colors">
                        DEL
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}