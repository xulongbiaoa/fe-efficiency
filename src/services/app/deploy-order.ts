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

//部署单详情

export async function getOrderDetial(id: string | number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deployOrder/detail/${id}`, {
    method: 'GET',
  });
}

// 部署单列表

export function getOrderRunList(envId?: number) {
  return async (params: {
    params: {
      pageNo?: number;
      pageSize?: number;
    };
    options?: Record<string, any>;
  }) => {
    const r = await request<TableResponseResult<any[]>>(
      `/devops-env-manager/v1/env/deployOrder/list`,
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

// 批次列表

export function getDeployBatchList(id?: number) {
  return async (params: {
    params: {
      pageNo?: number;
      pageSize?: number;
    };
    options?: Record<string, any>;
  }) => {
    const r: any = await request<TableResponseResult<any[]>>(
      `/devops-env-manager/v1/env/deployBatch/list/${id}`,
      {
        method: 'GET',
        params: {
          ...tableRequestParamsAdapter(params),
          id,
        },
      },
    );

    return { data: [r.data], total: 1, pageSize: 5, current: 1 };
  };
}

// 批次重跑

export async function deployBatchRestart(data: { id: number; deployId: number }) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deployBatch/restart`, {
    method: 'POST',
    data,
  });
}

// 工单审批

export async function deployOrderApproval(data: {
  envId: number;
  deployOrderId: number; //部署单id
  approvalId: number;
  approvalStatus: number; //审批状态： 1：通过，3：拒绝
  approvalDesc: string;
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deployOrder/approval`, {
    method: 'POST',
    data,
  });
}

// 获取部署策略
export async function getDeployStrategy(envId: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deploypolicy/detail`, {
    method: 'GET',
    params: { envId },
  });
}

// 更新部署策略
export async function updateDeployStrategy(id: number, data: { needApproval: string }) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deploypolicy/update/${id}`, {
    method: 'POST',
    data,
  });
}

// 终止部署

export async function stopDeploy(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deployOrder/cancel`, {
    method: 'POST',
    data: [id],
  });
}

// 发起部署  /devops-env-manager/v1/env/deploy/{id}

export async function startDeploy(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deploy/${id}`, {
    method: 'POST',
  });
}

// 获取代码变更 /devops-env-manager/v1/env/deploy/diff/list

export async function getDeployDiffList(params: {
  envId: number;
  type?: number;
  deployOrderId?: number;
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/deploy/diff/list`, {
    method: 'GET',
    params,
  });
}
