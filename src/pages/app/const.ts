import { mapArrayToTree } from '@/utils/index';

export type TQuery = {
  name: string;
  value: number | string;
};

export const appScopes: TQuery[] = [
  {
    name: '所有应用',
    value: 0,
  },
  {
    name: '我参与的',
    value: 1,
  },
];

export const appTypes: TQuery[] = [
  {
    name: '自研应用',
    value: 0,
  },
  {
    name: '三方应用',
    value: 1,
  },
];

export const appLevels: TQuery[] = [
  {
    name: 'A1',
    value: 101,
  },
  {
    name: 'A2',
    value: 102,
  },
  {
    name: 'A3',
    value: 103,
  },
  {
    name: 'B1',
    value: 201,
  },
  {
    name: 'B2',
    value: 202,
  },
  {
    name: 'B3',
    value: 203,
  },
  {
    name: 'C1',
    value: 301,
  },
  {
    name: 'C2',
    value: 302,
  },
  {
    name: 'C3',
    value: 303,
  },
];

export const appStatus: TQuery[] = [
  {
    name: '初始化',
    value: 0,
  },
  {
    name: '发布中',
    value: 1,
  },
  {
    name: '已发布',
    value: 2,
  },
  {
    name: '下线中',
    value: 3,
  },
  {
    name: '已下线',
    value: 4,
  },
];

export const roles = [
  {
    roleId: 1,
    roleName: '负责人',
  },
  {
    roleId: 2,
    roleName: '测试人',
  },
];

export const sprintStatus = [
  { color: 'default', text: '未开始' },
  { color: 'processing', text: '进行中' },
  { color: 'success', text: '已结束' },
  { color: 'rgba(169,169,169,0.9)', text: '已关闭' },
];

export const deployStatus = [
  {
    name: '未部署',
    value: 0,
  },
  {
    name: '部署中',
    value: 1,
  },
  {
    name: '部署成功',
    value: 2,
  },
  {
    name: '部署异常',
    value: 3,
  },
  {
    name: '已销毁',
    value: 9,
  },
];

let cacheOrgNode: any = null;
export const formatOrgTree = (data: any[]) => {
  if (data.length === 0) return [];
  if (cacheOrgNode) return cacheOrgNode;
  const formatData = [...data];
  formatData.forEach((node: any) => {
    const [level1, level2, level3] = node.codePath.split('-');
    if (level1 && !level2) {
      node.children = [];
      node.parent = null;
      node.isLeaf = false;
    }
    if (level1 && level2 && !level3) {
      node.children = [];
      node.parent = level1;
      node.isLeaf = false;
    }
    if (level1 && level2 && level3) {
      node.children = [];
      node.parent = level2;
      node.isLeaf = true;
    }
    node.title = node.unitName;
    node.key = node.unitCode;
  });
  cacheOrgNode = mapArrayToTree(formatData as any, 'unitCode');
  return cacheOrgNode;
};
