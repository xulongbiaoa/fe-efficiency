import { request } from '@/utils/request';
import type { ResponseResult, TableResponseResult } from '@/app.global';
import { tableResponseAdapter, tableRequestParamsAdapter } from '@/utils/adapters';
import gateway from '@/gateway.config';

const { poolCode } = gateway;

// 获取迭代列表

export function getSprintList(app: number, extraParams: { scope?: number }) {
  return async (
    params: {
      pageNo?: number;
      pageSize?: number;
      search?: string;
      status?: 0 | 1 | 2;
    },
    options?: Record<string, any>,
  ) => {
    const r = await request<TableResponseResult<any[]>>(`/devops-manager/v1/sprint/list`, {
      method: 'GET',
      params: {
        ...tableRequestParamsAdapter(params),
        ...options,
        ...extraParams,
        appId: app,
      },
    });
    return tableResponseAdapter<any[]>(r);
  };
}

// 创建迭代

export async function createSprint(
  appId: number,
  data: {
    appId?: number;
    name: string;
    owner: string;
    roleMember: {
      members: string[];
    };
  },
) {
  data.appId = appId;
  return await request<ResponseResult>(`/devops-manager/v1/sprint/create`, {
    method: 'POST',
    data,
  });
}

// 搜索分支

export async function searchBranch(params: { limitSize?: number; search: string; appId: number }) {
  return await request<ResponseResult>(`/devops-manager/v1/code/branch/list`, {
    method: 'GET',
    params,
  });
}

// 获取成员

export async function getMember(params: {
  poolCode?: string;
  nickName?: string;
  limitSize?: number;
}) {
  params.poolCode = poolCode;
  params.limitSize = 5;
  return await request<ResponseResult>(`/idaasweb/user/listAccountByNickName`, {
    method: 'GET',
    params,
  });
}

// 查询流水线

export async function searchPipeline(params: { appId?: number; stageId?: number; name?: string }) {
  return await request<ResponseResult>(`/devops-manager/v1/stage/pipeline/list`, {
    method: 'GET',
    params,
  });
}

// 删除迭代

export async function deleteSprint(id: number) {
  return await request<ResponseResult>(`/devops-manager/v1/sprint/del/${id}`, {
    method: 'POST',
  });
}

export async function getSprintListNew(params: {
  appId: number;
  scope?: number;
  search: string;
  pageNo?: number;
  pageSize?: number;
}) {
  const defaultParams = {
    appId: '',
    scope: 0,
    search: '',
    pageNo: 1,
    pageSize: 10,
  };
  return await request<ResponseResult>(`/devops-manager/v1/sprint/list`, {
    method: 'GET',
    params: Object.assign(defaultParams, params),
  });
}
