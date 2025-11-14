// third-party
import { FormattedMessage } from 'react-intl';

// assets
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { MovieIcon, TvIcon, LocalMoviesIcon };

// ==============================|| MENU ITEMS - ENTERTAINMENT ||============================== //

const entertainment: NavItemType = {
  id: 'group-entertainment',
  title: <FormattedMessage id="entertainment" />,
  type: 'group',
  children: [
    {
      id: 'movies',
      title: <FormattedMessage id="movies" />,
      type: 'collapse',
      icon: icons.MovieIcon,
      children: [
        {
          id: 'movie-1',
          title: 'The Shawshank Redemption',
          type: 'item',
          url: '/movies/1',
          icon: icons.LocalMoviesIcon
        },
        {
          id: 'movie-2',
          title: 'The Godfather',
          type: 'item',
          url: '/movies/2',
          icon: icons.LocalMoviesIcon
        },
        {
          id: 'movie-3',
          title: 'Inception',
          type: 'item',
          url: '/movies/3',
          icon: icons.LocalMoviesIcon
        }
      ]
    },
    {
      id: 'tvshows',
      title: <FormattedMessage id="tv-shows" />,
      type: 'collapse',
      icon: icons.TvIcon,
      children: [
        {
          id: 'tvshow-1',
          title: 'Breaking Bad',
          type: 'item',
          url: '/tvshows/1',
          icon: icons.TvIcon
        },
        {
          id: 'tvshow-2',
          title: 'Game of Thrones',
          type: 'item',
          url: '/tvshows/2',
          icon: icons.TvIcon
        },
        {
          id: 'tvshow-3',
          title: 'Stranger Things',
          type: 'item',
          url: '/tvshows/3',
          icon: icons.TvIcon
        }
      ]
    }
  ]
};

export default entertainment;
