import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';
import { tableResponseAdapter, tableRequestParamsAdapter } from '@/utils/adapters';
// 域名新增

export async function createDomain(data: {
  envId: number;
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

// 域名删除
export async function deleteDomain(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/del/${id}`, {
    method: 'POST',
  });
}

// 域名列表

export function getDomainList(envId?: number) {
  return async (params: {
    pageNo: number;
    pageSize: number;
    envId?: number;
    name?: string;
    status?: number;
    envIdent?: string;
    networkSegment?: string;
  }) => {
    params.envId = envId;
    const r = await request<ResponseResult>(`/devops-env-manager/v1/zone/list`, {
      method: 'GET',
      params: tableRequestParamsAdapter(params),
    });
    return tableResponseAdapter<any[]>(r);
  };
}

// 域名修改 /devops-env-manager/v1/zone/update/{id}

export async function updateDomain(
  id: number,
  data: {
    name: string;
    feIdent: number;
    networkSegmentId: number;
    ttl: string;
    description: string;
  },
) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/update/${id}`, {
    method: 'POST',
    data,
  });
}

// 域名启用禁用 /devops-env-manager/v1/zone/isEnable/{id}

export async function enableDomain(id: number, isEnable: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/isEnable/${id}`, {
    method: 'POST',
    data: {
      isEnable,
    },
  });
}

// 域名恢复  /devops-env-manager/v1/zone/restore/{id}

export async function restoreDomain(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/restore/${id}`, {
    method: 'POST',
  });
}

// 内外网域名网段列表 /devops-env-manager/v1/zone/segment/list

export async function domainSegmentList(segmentType: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/segment/list`, {
    method: 'GET',
    params: {
      segmentType,
      pageNo: 1,
      pageSize: 1000,
    },
  });
}

// 获取开发语言类型
export const getDomainStatusType = () => {
  return request<ResponseResult>(`/devops-env-manager/v1/dict/query`, {
    method: 'GET',
    params: { parentKeys: 'zone_status' },
  });
};

// 获取工单状态
export const getOrderType = () => {
  return request<ResponseResult>(`/devops-env-manager/v1/dict/query`, {
    method: 'GET',
    params: { parentKeys: 'ORDER_TYPE' },
  });
};

// 工单审批 /devops-env-manager/zone/approval

export async function approvalDomain(
  id: number,
  data: {
    status: number; // 1 通过 2拒绝
    describe: string;
  },
) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/approval/${id}`, {
    method: 'POST',
    data,
  });
}

// 工单节点重试 /devops-env-manager/v1/zone/retry/{id}

export async function retryDomain(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/retry/${id}`, {
    method: 'POST',
  });
}

// 工单节点取消 /devops-env-manager/v1/zone/cancel/{id}

export async function cancelDomain(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/order/cancel/${id}`, {
    method: 'POST',
  });
}

// 工作节点列表 /devops-env-manager/v1/zone/order/list

export async function domainOrderList(params: {
  pageNo?: number;
  pageSize?: number;
  zoneId?: number;
}) {
  const r = await request<ResponseResult>(`/devops-env-manager/v1/zone/order/list`, {
    method: 'GET',
    params,
  });
  return r;
}
