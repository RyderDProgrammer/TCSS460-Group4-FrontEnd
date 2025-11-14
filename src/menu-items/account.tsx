// third-party
import { FormattedMessage } from 'react-intl';

// assets
import LockOutlined from '@ant-design/icons/LockOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  LockOutlined,
  UserOutlined
};

// ==============================|| MENU ITEMS - ACCOUNT ||============================== //

const account: NavItemType = {
  id: 'account',
  title: <FormattedMessage id="account" />,
  type: 'group',
  children: [
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
