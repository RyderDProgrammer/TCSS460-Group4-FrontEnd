// third-party
import { FormattedMessage } from 'react-intl';

// assets
import VideoCameraOutlined from '@ant-design/icons/VideoCameraOutlined';

// type
import { NavItemType } from 'types/menu';

const icons = { VideoCameraOutlined };

const tvMovies: NavItemType = {
  id: 'tv-movies',
  title: <FormattedMessage id="tv-movies" defaultMessage="TV Shows & Movies" />,
  type: 'group',
  url: '/tv-movies',
  icon: icons.VideoCameraOutlined
};

export default tvMovies;
