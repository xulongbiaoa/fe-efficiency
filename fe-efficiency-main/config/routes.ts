export default [
  {
    path: '/',
    redirect: '/app',
  },

  {
    path: '/app',
    icon: 'home',
    name: 'app',
    component: './app',
  },
  {
    path: '/app-manage',
    icon: 'car',
    name: 'app-manage',
    component: '@/layouts/AppLayout',
    hideInMenu: true,
    menuRender: false,
    headerRender: false,
    routes: [
      {
        path: '/app-manage/overview',
        name: 'overview',
        component: './app/overview',
      },
      {
        path: '/app-manage/detailInfo',
        name: 'detailInfo',
        component: './app/app-manage/detailInfo',
      },
      {
        path: '/app-manage/env-manage',
        name: 'env-manage',
        component: './app/env-manage',
      },
      {
        path: '/app-manage/env-manage/view',
        name: 'env-view',
        component: './app/env-manage/overview',
      },
      {
        path: '/app-manage/env-manage/env-config',
        name: 'env-config',
        component: './app/env-manage/env-config',
      },
      {
        path: '/app-manage/env-manage/deploy-order',
        name: 'deploy-order',
        component: './app/env-manage/deploy-order',
      },
      {
        path: '/app-manage/process-manage',
        name: 'process-manage',
        component: './app/process-manage',
      },
      {
        path: '/app-manage/sprint-manage',
        name: 'sprint-manage',
        component: './app/sprint-manage/list',
      },
      {
        path: '/app-manage/sprint-manage/sprint-detial',
        name: 'sprint-detial',
        component: './app/sprint-manage/detial',
      },
      {
        path: '/app-manage/product-manage',
        name: 'product-manage',
        component: './app/product-manage',
      },
    ],
  },
  {
    path: '/pipeline',
    icon: 'NodeIndexOutlined',
    name: 'pipeline',

    routes: [
      {
        name: 'list',
        path: '/pipeline/list',
        component: './pipeline/list',
      },
      {
        name: 'template-list',
        path: '/pipeline/template-list',
        component: './pipeline/template-list',
      },
      {
        name: 'detail',
        path: '/pipeline/detail',
        component: './pipeline/detail',
        hideInMenu: true,
        menuRender: false,
        headerRender: false,
      },
      {
        name: 'edit',
        path: '/pipeline/edit',
        component: './pipeline/edit',
        hideInMenu: true,
        menuRender: false,
        headerRender: false,
      },
    ],
  },
  {
    path: '/envs',
    icon: 'NodeIndexOutlined',
    name: 'envs',
    routes: [
      {
        path: '/envs/sourcepool',
        component: './envs/sourcepool',
        icon: 'NodeIndexOutlined',
        name: 'sourcepool',
      },
    ],
  },
  {
    path: '/domain',
    icon: 'AlignLeftOutlined',
    name: 'domain',
    component: './domain',
  },
  {
    component: '404',
  },
];
