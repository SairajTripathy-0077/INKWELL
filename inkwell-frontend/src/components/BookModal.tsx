import { useState, useEffect } from 'react';
import { Book } from '../types';
import { X } from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Book>) => void;
  initialData?: Book | null;
}

export function BookModal({ isOpen, onClose, onSubmit, initialData }: BookModalProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: '',
    rating: null,
    status: 'Plan to Read',
    review: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        rating: null,
        status: 'Plan to Read',
        review: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title *</label>
            <input 
              required
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Author *</label>
              <input 
                required
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Genre *</label>
              <input 
                required
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.genre}
                onChange={e => setFormData({...formData, genre: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="Plan to Read">Plan to Read</option>
                <option value="Reading">Reading</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Rating (1-5)</label>
              <input 
                type="number"
                min="1" max="5"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.rating || ''}
                onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || null})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Review (max 500 chars)</label>
            <textarea 
              maxLength={500}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              value={formData.review}
              onChange={e => setFormData({...formData, review: e.target.value})}
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium shadow-lg shadow-blue-500/20"
            >
              {initialData ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
