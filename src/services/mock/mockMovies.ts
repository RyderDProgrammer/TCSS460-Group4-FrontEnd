// Mock movie data for development
import { Movie } from '@/types/movie.types';

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseDate: '1994-09-23',
    rating: 9.3,
    genre: ['Drama'],
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    posterUrl: '/images/movies/shawshank.jpg',
    backdropUrl: '/images/movies/shawshank-backdrop.jpg',
    duration: 142,
    language: 'English',
    tagline: 'Fear can hold you prisoner. Hope can set you free.',
  },
  {
    id: '2',
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    releaseDate: '1972-03-24',
    rating: 9.2,
    genre: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    posterUrl: '/images/movies/godfather.jpg',
    backdropUrl: '/images/movies/godfather-backdrop.jpg',
    duration: 175,
    language: 'English',
    tagline: 'An offer you can\'t refuse.',
  },
];

/**
 * Get all movies (mock data)
 */
export function getMockMovies(): Movie[] {
  return mockMovies;
}

/**
 * Get single movie by ID (mock data)
 */
export function getMockMovieById(id: string): Movie | undefined {
  return mockMovies.find(movie => movie.id === id);
}
