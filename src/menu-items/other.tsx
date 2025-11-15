// third-party
import { FormattedMessage } from 'react-intl';

// assets
import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  FullscreenOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other: NavItemType = {
  id: 'other',
  title: <FormattedMessage id="others" />,
  type: 'group',
  children: [
    {
      id: 'full-page',
      title: <FormattedMessage id="full-page" />,
      type: 'item',
      url: '/full-page',
      icon: icons.FullscreenOutlined
    }
  ]
};

export default other;
