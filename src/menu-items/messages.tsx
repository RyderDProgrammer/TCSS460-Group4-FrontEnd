// third-party
import { FormattedMessage } from 'react-intl';

// assets
import VideoCameraOutlined from '@ant-design/icons/VideoCameraOutlined';

// type
import { NavItemType } from 'types/menu';

const icons = { VideoCameraOutlined };

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
    }
  ]
};

export default pages;
