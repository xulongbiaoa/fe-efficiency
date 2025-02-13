import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
  FileZipOutlined,
} from '@ant-design/icons';
import { getParamsToJson } from '@/utils';
import { SessionInstance } from '@/utils/storage';

type TMenuItem = {
  label: string;
  key: string;
  icon: React.ReactNode;
  link: string;
};

// 真实菜单关系
const menuMap = [
  { label: '应用总览', key: 'overview', link: '/app-manage/overview' },
  {
    label: '应用详情',
    key: 'detailInfo',
    link: '/app-manage/detailInfo',
  },
  {
    label: '环境管理',
    key: 'env-manage',
    link: '/app-manage/env-manage',
    children: [
      {
        label: '环境总览',
        key: 'view',
        link: '/app-manage/env-manage/view',
      },
      {
        label: '部署单详情',
        key: 'deploy-order',
        link: '/app-manage/env-manage/deploy-order',
      },
      {
        label: '环境配置',
        key: 'env-config',
        link: '/app-manage/env-manage/env-config',
      },
    ],
  },
  {
    label: '流程管理',
    key: 'process-manage',
    link: '/app-manage/process-manage',
  },
  {
    label: '迭代管理',
    key: 'sprint-manage',
    link: '/app-manage/sprint-manage',
    children: [
      {
        label: '迭代详情',
        key: 'sprint-detial',
        link: '/app-manage/sprint-manage/sprint-detial',
      },
    ],
  },
];

// 左侧菜单
const menuItems: TMenuItem[] = [
  { label: '应用总览', key: 'overview', icon: <AppstoreOutlined />, link: '/app-manage/overview' },
  {
    label: '应用详情',
    key: 'detailInfo',
    icon: <CalendarOutlined />,
    link: '/app-manage/detailInfo',
  },
  { label: '环境管理', key: 'env-manage', icon: <LinkOutlined />, link: '/app-manage/env-manage' },
  {
    label: '流程管理',
    key: 'process-manage',
    icon: <MailOutlined />,
    link: '/app-manage/process-manage',
  },
  {
    label: '迭代管理',
    key: 'sprint-manage',
    icon: <SettingOutlined />,
    link: '/app-manage/sprint-manage',
  },
  {
    label: '制品管理',
    key: 'product-manage',
    icon: <FileZipOutlined />,
    link: '/app-manage/product-manage',
  },
];

export const getMenuLabel = (link: string): string => {
  const _filterMenu = menuItems.filter((item) => link.includes(item.key));
  if (_filterMenu.length > 0) {
    return _filterMenu[0]?.label === '迭代详情' ? '迭代管理' : _filterMenu[0]?.label;
  }
  return '';
};

export const getMenuKey = (link: string): string => {
  const _filterMenu = menuItems.filter((item) => link.includes(item.key));
  if (_filterMenu.length > 0) {
    return _filterMenu[0]?.key;
  }
  return 'unknown';
};

export const getSubMenuKey = (link: string): string => {
  let str = '';
  menuMap.forEach((menu) => {
    if (link.includes(menu.key)) {
      if (link === menu.link || link === `${menu.link}/`) {
        str = menu.key;
      } else {
        if (menu.children) {
          menu.children.forEach((item) => {
            if (link === item.link || link === `${item.link}/`) {
              str = item.key;
            }
          });
        }
      }
    }
  });
  return str;
};

const getAppInfo = () => {
  const { appId, unitCode, devMode } = getParamsToJson();
  if (appId || unitCode || devMode) {
    SessionInstance?.set('appInfo', {
      appId,
      unitCode,
      devMode,
    });
  }
  const appInfo = SessionInstance?.get('appInfo');
  return {
    appId: appInfo.appId || '',
    unitCode: appInfo.unitCode || '',
    devMode: appInfo.devMode || '',
  };
};

interface IAppLayoutMenu {
  // currActiveMenu: string;
  // onMenuChange: (menu: string) => void;
}

const AppLayoutMenu: React.FC<IAppLayoutMenu> = () => {
  const [currActiveMenu, setCurrActiveMenu] = useState<string>('overview');

  useEffect(() => {
    setCurrActiveMenu(getMenuKey(location.pathname));
  }, [location.pathname]);

  const history = useHistory();

  const jumpTo = (e: any) => {
    const { key } = e;
    const { appId, unitCode, devMode } = getAppInfo();
    history.push(`/app-manage/${key}?appId=${appId}&unitCode=${unitCode}&devMode=${devMode}`);
  };

  return (
    <Menu
      selectedKeys={[currActiveMenu]}
      items={menuItems}
      onClick={jumpTo}
      mode="vertical"
      theme="light"
    />
  );
};

export default AppLayoutMenu;
