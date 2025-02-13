import { request } from '@/utils/request';
import type { ResponseResult, TableResponseResult } from '@/app.global';
import { tableResponseAdapter, tableRequestParamsAdapter } from '@/utils/adapters';

// 新建部署单

export async function createDeployOrder(data: {
  envId: number;
  describe: string;
  branch: string;
  commit: string;
  image: string;
  versionType: number; //版本类型: 1:deployBranch + deployCommit，2:image; deployBranch + deployCommit 与 image 二传一
  operationType: number;
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deployOrder/create`, {
    method: 'POST',
    data,
  });
}

//环境总览

export async function getEnvSummary(envId: string | number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/summary/${envId}`, {
    method: 'GET',
  });
}

// 实例列表

export function getInsList(envId?: number) {
  return async (params: {
    params: {
      pageNo?: number;
      pageSize?: number;
    };
    options?: Record<string, any>;
  }) => {
    const r = await request<TableResponseResult<any[]>>(
      `/devops-env-manager/v1/env/instance/list`,
      {
        method: 'GET',
        params: {
          ...tableRequestParamsAdapter(params),
          envId,
        },
      },
    );
    return tableResponseAdapter<any[]>(r);
  };
}

// 事件列表

export function getEventList(envId?: number) {
  return async (params: {
    params: {
      pageNo?: number;
      pageSize?: number;
    };
    options?: Record<string, any>;
  }) => {
    const r = await request<TableResponseResult<any[]>>(`/devops-env-manager/v1/env/event/list`, {
      method: 'GET',
      params: {
        ...tableRequestParamsAdapter(params),
        envId,
      },
    });
    return tableResponseAdapter<any[]>(r);
  };
}

// 部署列表

export function getDeployList(envId?: number) {
  return async (params: {
    params: {
      pageNo?: number;
      pageSize?: number;
    };
    options?: Record<string, any>;
  }) => {
    const r = await request<TableResponseResult<any[]>>(`/devops-env-manager/v1/env/deploy/list`, {
      method: 'GET',
      params: {
        ...tableRequestParamsAdapter(params),
        envId,
      },
    });
    return tableResponseAdapter<any[]>(r);
  };
}

// 基本信息详情

export async function getBaseinfo(envId: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/info/detail/${envId}`, {
    method: 'GET',
  });
}

// 基本信息修改

export async function updateBaseinfo(
  id: number,
  data: { name: string; envIdent: string; manager: string; describe: string },
) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/info/update/${id}`, {
    method: 'POST',
    data,
  });
}

// 创建回滚

export async function rollBack(data: { envId: number; rollBackId: number }) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/rollBack/create`, {
    method: 'POST',
    data,
  });
}

// 实例重启

export async function insRestart(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/instance/restart/${id}`, {
    method: 'POST',
  });
}

// 容器重启

export async function envRestart(data: { appId: number; sprintId: number }) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/restart`, {
    method: 'POST',
    data,
  });
}

// 获取制品列表

export async function getImageList(envId: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/image/list`, {
    method: 'GET',
    params: {
      envId,
    },
  });
}

// 获取回滚列表

export async function getRollbackList(envId: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/rollBack/list`, {
    method: 'GET',
    params: {
      envId,
    },
  });
}

// 查看环境部署单id

export async function getDeployOrder(envId: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deployOrder/current`, {
    method: 'GET',
    params: {
      envId,
    },
  });
}
// 域名列表

export async function getDomainList(envId?: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/zone/list`, {
    method: 'GET',
    params: { envId },
  });
}
