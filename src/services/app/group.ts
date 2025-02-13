import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

const env = `${APP_ENV}`;

// 业务线搜索
type TGroupSearch = {
  orgCode?: string;
  searchCode?: string;
  unitCode?: string;
};

export const searchGroupList = () => {
  const defaultParams: TGroupSearch = {
    orgCode: 'orgf95689665acc467eadabbb18d0aa0532',
    searchCode: 'unite52bbaed0a7b47a18fc0bed0b533633f',
  };

  if (env.includes('dev')) {
    defaultParams.orgCode = 'orgba84d81af4d541e1821e57c8691cbea5';
    defaultParams.searchCode = 'unit98abeb9d51424840aeb2a5b5c242e915';
  }
  if (env.includes('test')) {
    defaultParams.orgCode = 'orgba84d81af4d541e1821e57c8691cbea5';
    defaultParams.searchCode = 'unit901232ad5a594c38bcc5e6dd8bb06f3b';
  }

  return request<ResponseResult>(`/idaasweb/org/descendant`, {
    method: 'GET',
    params: defaultParams,
  });
};

// 根据unitCode获取路径
type TGetCodePathByUnitcode = {
  orgCode?: string;
  unitcode: string;
  searchCode?: string;
};

export const getCodePathByUnitcode = (params: TGroupSearch) => {
  const defaultParams: TGetCodePathByUnitcode = {
    orgCode: 'deepway',
    searchCode: 'unit73f0f094d49b4fed81f551befc953cea',
    unitcode: '',
  };

  return request<ResponseResult>(`/idaasweb/org/getUnitByCode`, {
    method: 'GET',
    params: Object.assign(params, defaultParams),
  });
};

// 获取开发语言类型
export const getDevLangType = () => {
  return request<ResponseResult>(`/devops-manager/v1/dict/query`, {
    method: 'GET',
    params: { parentKeys: 'APP_DEV_LANG' },
  });
};

// 获取开发模式
export const getDevMode = () => {
  return request<ResponseResult>(`/devops-manager/v1/dict/query`, {
    method: 'GET',
    params: { parentKeys: 'APP_DEV_MODE' },
  });
};

// 获取构建类型
export const getBuildType = () => {
  return request<ResponseResult>(`/devops-manager/v1/dict/query`, {
    method: 'GET',
    params: { parentKeys: 'APP_BUILD_TYPE' },
  });
};
