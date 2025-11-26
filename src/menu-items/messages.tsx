// third-party
import { FormattedMessage } from 'react-intl';

// assets
import VideoCameraOutlined from '@ant-design/icons/VideoCameraOutlined';
import PlaySquareOutlined from '@ant-design/icons/PlaySquareOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';

// type
import { NavItemType } from 'types/menu';

const icons = {
  VideoCameraOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
};

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
      type: 'collapse',
      url: '/movies',
      icon: icons.VideoCameraOutlined,
      children: [
        {
          id: 'add-movie',
          title: <FormattedMessage id="add-movie" defaultMessage="Add Movie" />,
          type: 'item',
          url: '/movies/add',
          icon: icons.PlusOutlined
        },
        {
          id: 'delete-movie',
          title: <FormattedMessage id="delete-movie" defaultMessage="Delete Movie" />,
          type: 'item',
          url: '/movies/delete',
          icon: icons.DeleteOutlined
        },
        {
          id: 'update-movie',
          title: <FormattedMessage id="update-movie" defaultMessage="Update Movie" />,
          type: 'item',
          url: '/movies/update',
          icon: icons.EditOutlined,
          disabled: true
        }
      ]
    },
    {
      id: 'tvshows',
      title: <FormattedMessage id="tvshows" defaultMessage="TV Shows" />,
      type: 'collapse',
      url: '/tvshows',
      icon: icons.PlaySquareOutlined,
      children: [
        {
          id: 'add-tvshow',
          title: <FormattedMessage id="add-tvshow" defaultMessage="Add TV Show" />,
          type: 'item',
          url: '/tvshows/add',
          icon: icons.PlusOutlined
        },
        {
          id: 'delete-tvshow',
          title: <FormattedMessage id="delete-tvshow" defaultMessage="Delete TV Show" />,
          type: 'item',
          url: '/tvshows/delete',
          icon: icons.DeleteOutlined
        },
        {
          id: 'update-tvshow',
          title: <FormattedMessage id="update-tvshow" defaultMessage="Update TV Show" />,
          type: 'item',
          url: '/tvshows/update',
          icon: icons.EditOutlined,
          disabled: true
        }
      ]
    }
  ]
};

export default pages;
