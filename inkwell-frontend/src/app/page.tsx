"use client";

import { useState, useEffect } from 'react';
import { Book, Insights } from '../types';
import { InsightCard } from '../components/InsightCard';
import { BookCard } from '../components/BookCard';
import { BookModal } from '../components/BookModal';
import { Book as BookIcon, Star, TrendingUp, Plus, Library } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [booksRes, insightsRes] = await Promise.all([
        fetch(`${API_URL}/books`),
        fetch(`${API_URL}/insights`)
      ]);
      
      const booksData = await booksRes.json();
      const insightsData = await insightsRes.json();

      if (booksData.success) setBooks(booksData.data);
      if (insightsData.success) setInsights(insightsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBook = async (bookData: Partial<Book>) => {
    try {
      const res = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateBook = async (bookData: Partial<Book>) => {
    if (!editingBook) return;
    try {
      const res = await fetch(`${API_URL}/books/${editingBook._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingBook(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">Loading Inkwell...</div>;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 font-sans pb-20">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Library className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Inkwell</h1>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Plus className="w-4 h-4" />
            Log Book
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-10 space-y-12">
        {/* Insights Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Reading Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard 
              title="Total Books" 
              value={insights?.totalBooks || 0} 
              icon={BookIcon} 
              colorClass="bg-blue-500/20 text-blue-500" 
            />
            <InsightCard 
              title="Average Rating" 
              value={insights?.averageRating || '0.0'} 
              icon={Star} 
              colorClass="bg-yellow-500/20 text-yellow-500" 
            />
            <InsightCard 
              title="Top Genre" 
              value={insights?.topGenre || 'None'} 
              icon={TrendingUp} 
              colorClass="bg-emerald-500/20 text-emerald-500" 
            />
          </div>
        </section>

        {/* Library Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Library className="w-5 h-5 text-gray-400" />
              Your Library
            </h2>
            <span className="text-sm text-gray-400">{books.length} books</span>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Your library is empty</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">Start logging your reading journey by adding your first book to Inkwell.</p>
              <button 
                onClick={openAddModal}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Add Your First Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <BookCard 
                  key={book._id} 
                  book={book} 
                  onEdit={openEditModal} 
                  onDelete={handleDeleteBook} 
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <BookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingBook ? handleUpdateBook : handleAddBook}
        initialData={editingBook}
      />
    </main>
  );
}
