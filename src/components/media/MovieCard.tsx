// Movie card component for list view
import { Movie } from '@/types/movie.types';

interface MovieCardProps {
  movie: Movie;
  onClick?: (id: string) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div onClick={() => onClick?.(movie.id)}>
      <h3>{movie.title}</h3>
      {/* Movie card content will be implemented here */}
      {/* Display some information and images */}
    </div>
  );
}
