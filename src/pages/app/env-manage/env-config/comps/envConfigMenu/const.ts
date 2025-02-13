import { cloneDeep } from 'lodash';

export type menuItemsType = {
  id: number;
  label: string;
  key: string;
  fileName?: string;
  children?: menuItemsType[];
  allowDel?: number;
  fileValue?: string;
  diffFlag?: boolean;
  sourceFileValue?: string;
};

export const menuNameMap = {
  envBaseInfo: '基础信息',
  envSourceConfig: '资源配置',
  envChoreography: '环境编排',
  paramsInfo: '环境变量',
  DockerFile: 'DockerFile',
  Kubernetes: 'Kubernetes',
};

export const menuItems: menuItemsType[] = [
  {
    id: 100,
    label: '基础信息',
    fileName: '基础信息',
    key: 'envBaseInfo',
  },
  {
    id: 99,
    label: '资源配置',
    fileName: '资源配置',
    key: 'envSourceConfig',
  },
  {
    id: 98,
    label: '环境编排',
    fileName: '环境编排',
    key: 'envChoreography',
    children: [
      {
        id: 97,
        label: '环境变量',
        fileName: '环境变量',
        key: 'paramsInfo',
      },
    ],
  },
  {
    id: 96,
    label: '部署策略',
    fileName: '部署策略',
    key: 'deloyStrategy',
  },
  {
    id: 95,
    label: '域名管理',
    fileName: '域名管理',
    key: 'domainManage',
  },
];

export const dynamicSetMenuItems = (fileList: menuItemsType[], key: string) => {
  const newMenuItems = cloneDeep(menuItems);
  const idx = newMenuItems.findIndex((item) => item.key === key);
  if (newMenuItems[idx].children) {
    newMenuItems[idx].children?.push(...fileList);
  } else {
    newMenuItems[idx].children = fileList;
  }
  return newMenuItems;
};

type transforMenuType = {
  id: number;
  fileName: string;
  type: string;
  subType: string;
  fileValue: string;
  sourceFileValue: string;
  allowDel?: number;
  diffFlag?: boolean;
};

export const transforMenuItems = (items: transforMenuType[]) => {
  const tmp: any[] = [
    {
      id: Math.random().toString().substring(2),
      label: 'Kubernetes',
      key: 'Kubernetes',
      children: [],
    },
  ];

  items.forEach((item: transforMenuType) => {
    if (!item.subType) {
      tmp.push({
        id: item.id,
        label: item.type,
        key: item.type,
        fileName: item.fileName,
        diffFlag: item?.diffFlag,
        sourceFileValue: item?.sourceFileValue,
        fileValue: item?.fileValue,
      });
    } else {
      const _id = tmp.findIndex((_it) => _it.key === item.type);
      if (_id >= 0) {
        tmp[_id].children.push({
          id: item.id,
          label: item.subType,
          key: item.subType,
          fileName: item.fileName,
          allowDel: item.allowDel,
          sourceFileValue: item?.sourceFileValue,
          fileValue: item?.fileValue,
          diffFlag: item?.diffFlag,
        });
      } else {
        tmp.push({
          id: Math.random().toString().substring(2),
          label: item.type,
          key: item.type,
          children: [
            {
              id: item.id,
              label: item.subType,
              key: item.subType,
              fileName: item.fileName,
              allowDel: item.allowDel,
              sourceFileValue: item?.sourceFileValue,
              fileValue: item?.fileValue,
              diffFlag: item?.diffFlag,
            },
          ],
        });
      }
    }
  });
  return tmp;
};
