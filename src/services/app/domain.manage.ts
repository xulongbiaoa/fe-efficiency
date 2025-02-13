import { request } from '@/utils/request';
import type { ResponseResult, TableResponseResult } from '@/app.global';
import { tableResponseAdapter, tableRequestParamsAdapter } from '@/utils/adapters';

// 获取域名列表

export function getDomainList(extraParams: { envId?: number }) {
  return async (
    params: {
      pageNo?: number;
      pageSize?: number;
      search?: string;
    },
    options?: Record<string, any>,
  ) => {
    const r = await request<TableResponseResult<any[]>>(`/devops-manager/v1/sprint/list`, {
      method: 'GET',
      params: {
        ...tableRequestParamsAdapter(params),
        ...options,
        ...extraParams,
      },
    });
    return tableResponseAdapter<any[]>(r);
  };
}

// 域名新增 /devops-env-manager/v1/zone/create

export async function createDomain(data: {
  envId?: number;
  name: string;
  feIdent: number;
  networkSegmentId: number;
  segmentType: number;
  ttl: string;
  description: string;
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/create`, {
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

// 删除 /devops-env-manager/v1/zone/del/{id}

export async function deleteDomain(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/del/${id}`, {
    method: 'POST',
  });
}

// 启用或者禁用 /devops-env-manager/v1/zone/isEnable/{id}

export async function enableDomain(id: number, isEnable: boolean) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/isEnable/${id}`, {
    method: 'POST',
    params: {
      isEnable,
    },
  });
}
