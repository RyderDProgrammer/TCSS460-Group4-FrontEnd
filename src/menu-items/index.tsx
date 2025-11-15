// project import
import samplePage from './sample-page';
import other from './other';
import pages from './messages';
import account from './account';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, pages, account, other]
};

export default menuItems;
