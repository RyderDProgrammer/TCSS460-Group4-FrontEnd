// third-party
import { FormattedMessage } from 'react-intl';

// assets
import VideoCameraOutlined from '@ant-design/icons/VideoCameraOutlined';
import PlaySquareOutlined from '@ant-design/icons/PlaySquareOutlined';

// type
import { NavItemType } from 'types/menu';

const icons = { VideoCameraOutlined, PlaySquareOutlined };

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-pages',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'tv-movies',
      title: <FormattedMessage id="tv-movies" defaultMessage="TV Shows & Movies" />,
      type: 'item',
      url: '/tv-movies',
      icon: icons.VideoCameraOutlined
    },
    {
      id: 'movies',
      title: <FormattedMessage id="movies" defaultMessage="Movies" />,
      type: 'item',
      url: '/movies',
      icon: icons.VideoCameraOutlined
    },
    {
      id: 'tvshows',
      title: <FormattedMessage id="tvshows" defaultMessage="TV Shows" />,
      type: 'item',
      url: '/tvshows',
      icon: icons.PlaySquareOutlined
    }
  ]
};

export default pages;
