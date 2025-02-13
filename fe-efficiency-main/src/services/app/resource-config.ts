import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

// 资源配置详情

export async function getResourceConfig(envId: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/configure/detail`, {
    method: 'GET',
    params: { envId },
  });
}

// 资源配置修改

export async function editResourceConfig(
  id: number,
  data: { inst: number; cpu: string; memory: string; disk: string },
) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/configure/update/${id}`, {
    method: 'POST',
    data,
  });
}

// 获取可用配额

export async function getAvailableResources(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/resource/pool/quota/${id}`, {
    method: 'GET',
  });
}
