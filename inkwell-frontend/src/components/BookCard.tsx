import { Book } from '../types';
import { Edit2, Trash2, Star, BookOpen, Clock, CheckCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const getStatusIcon = () => {
    switch (book.status) {
      case 'Finished': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Reading': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Plan to Read': return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusBg = () => {
    switch (book.status) {
      case 'Finished': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Reading': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Plan to Read': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-white line-clamp-2">{book.title}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(book)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(book._id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-400 mb-4">{book.author}</p>
      
      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300">
            {book.genre}
          </span>
          {book.rating && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{book.rating}</span>
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${getStatusBg()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{book.status}</span>
        </div>
        
        {book.review && (
          <p className="text-sm text-gray-500 italic line-clamp-2 pt-2 border-t border-white/10">
            "{book.review}"
          </p>
        )}
      </div>
    </div>
  );
}
