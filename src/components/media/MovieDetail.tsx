// Movie detail component - displays all movie information
import { Movie } from '@/types/movie.types';

interface MovieDetailProps {
  movie: Movie;
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  return (
    <div>
      <h1>{movie.title}</h1>
      {/* Display all movie information including images */}
      {/* All fields from movie object should be displayed */}
    </div>
  );
}
