import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

// 资源池总览
export async function sourcePoolOverview() {
  return await request<ResponseResult>(`/devops-env-manager/v1/resource/pool/summary`, {
    method: 'GET',
  });
}

// 资源池列表
interface IPoolList {
  pageNo: number;
  pageSize: number;
  type: string;
}
export async function sourcePoolList(params: IPoolList) {
  const defaultParams = {
    pageNo: 1,
    pageSize: 20,
    type: 'k8s',
  };
  return await request<ResponseResult>(`/devops-env-manager/v1/resource/pool/list`, {
    method: 'GET',
    params: Object.assign(defaultParams, params),
  });
}

// 更新资源池
export async function updateSourcePool(
  id: number,
  data: {
    type: string;
    name: string;
    data: {
      kubeConfig: string;
    };
  },
) {
  return await request<ResponseResult>(`/devops-env-manager/v1/resource/pool/update/${id}`, {
    method: 'POST',
    data,
  });
}

// 新建资源池
export async function createSourcePool(data: {
  type: string;
  name: string;
  data: {
    kubeConfig: string;
  };
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/resource/pool/create`, {
    method: 'POST',
    data,
  });
}

// 删除资源池
export async function deleteSourcePool(id: number, type: string) {
  return await request<ResponseResult>(
    `/devops-env-manager/v1/resource/pool/del/${id}?type=${type}`,
    {
      method: 'POST',
    },
  );
}

// 资源池配额
export async function quotaSourcePool(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/resource/pool/quota/${id}`, {
    method: 'GET',
  });
}

// 获取命名空间

export async function getNamespaceList(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/namespace/list`, {
    method: 'GET',
    params: { poolTypeId: id },
  });
}
