// mockMovies.ts - Mock movie data for development

import { IMovie } from 'types/movie';

export const mockMovies: IMovie[] = [
  {
    id: '1',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseDate: '1994-09-23',
    rating: 9.3,
    runtime: 142,
    genre: ['Drama', 'Crime'],
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    language: 'English',
    budget: 25000000,
    revenue: 28341469,
    tagline: 'Fear can hold you prisoner. Hope can set you free.'
  },
  {
    id: '2',
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    releaseDate: '1972-03-24',
    rating: 9.2,
    runtime: 175,
    genre: ['Drama', 'Crime'],
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan', 'Diane Keaton'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    language: 'English',
    budget: 6000000,
    revenue: 246120974,
    tagline: "An offer you can't refuse."
  },
  {
    id: '3',
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseDate: '2010-07-16',
    rating: 8.8,
    runtime: 148,
    genre: ['Action', 'Science Fiction', 'Thriller'],
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    language: 'English',
    budget: 160000000,
    revenue: 836848102,
    tagline: 'Your mind is the scene of the crime.'
  }
];

// Get a single movie by ID
export const getMockMovieById = (id: string): IMovie | undefined => {
  return mockMovies.find((movie) => movie.id === id);
};
