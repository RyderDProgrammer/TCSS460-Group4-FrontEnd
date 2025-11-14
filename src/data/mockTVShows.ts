// mockTVShows.ts - Mock TV show data for development

import { ITVShow } from 'types/tvshow';

export const mockTVShows: ITVShow[] = [
  {
    id: '1',
    name: 'Breaking Bad',
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    firstAirDate: '2008-01-20',
    lastAirDate: '2013-09-29',
    rating: 9.5,
    numberOfSeasons: 5,
    numberOfEpisodes: 62,
    genre: ['Drama', 'Crime', 'Thriller'],
    creators: ['Vince Gilligan'],
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    language: 'English',
    status: 'Ended',
    network: 'AMC',
    episodeRuntime: [45, 47]
  },
  {
    id: '2',
    name: 'Game of Thrones',
    description:
      'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    firstAirDate: '2011-04-17',
    lastAirDate: '2019-05-19',
    rating: 9.3,
    numberOfSeasons: 8,
    numberOfEpisodes: 73,
    genre: ['Drama', 'Fantasy', 'Adventure'],
    creators: ['David Benioff', 'D.B. Weiss'],
    cast: ['Emilia Clarke', 'Peter Dinklage', 'Kit Harington', 'Lena Headey'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
    language: 'English',
    status: 'Ended',
    network: 'HBO',
    episodeRuntime: [60]
  },
  {
    id: '3',
    name: 'Stranger Things',
    description:
      'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    firstAirDate: '2016-07-15',
    rating: 8.7,
    numberOfSeasons: 4,
    numberOfEpisodes: 42,
    genre: ['Science Fiction', 'Drama', 'Mystery'],
    creators: ['Matt Duffer', 'Ross Duffer'],
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    language: 'English',
    status: 'Returning Series',
    network: 'Netflix',
    episodeRuntime: [50]
  }
];

// Get a single TV show by ID
export const getMockTVShowById = (id: string): ITVShow | undefined => {
  return mockTVShows.find((show) => show.id === id);
};
