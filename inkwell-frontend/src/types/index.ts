export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  rating: number | null;
  status: 'Plan to Read' | 'Reading' | 'Finished';
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Insights {
  totalBooks: number;
  averageRating: number;
  topGenre: string;
}
