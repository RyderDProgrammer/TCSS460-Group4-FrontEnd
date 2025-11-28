// third-party
import { FormattedMessage } from 'react-intl';

// assets
import LockOutlined from '@ant-design/icons/LockOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  LockOutlined,
  UserOutlined,
  UnorderedListOutlined
};

// ==============================|| MENU ITEMS - ACCOUNT ||============================== //

const account: NavItemType = {
  id: 'account',
  title: <FormattedMessage id="account" />,
  type: 'group',
  children: [
    {
      id: 'watch-list',
      title: <FormattedMessage id="watch-list" defaultMessage="Watch List" />,
      type: 'item',
      url: '/watch-list',
      icon: icons.UnorderedListOutlined
    },
    {
      id: 'change-password',
      title: <FormattedMessage id="change-password" />,
      type: 'item',
      url: '/change-password',
      icon: icons.LockOutlined
    }
  ]
};

export default account;
