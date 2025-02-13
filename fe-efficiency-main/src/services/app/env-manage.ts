import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

// 获取环境列表

export async function getEnvList(appId: number) {
  return await request<ResponseResult>(`/devops-manager/v1/env/list`, {
    method: 'GET',
    params: {
      appId,
    },
  });
}

// 新建环境

export async function createEnv(data: {
  appId: number;
  ident: string;
  name: string;
  status: string;
  deployType: string;
  deployName: string;
  deployConfig: {
    version: string;
    time: string;
    branch: string;
  };
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/create?appId=${data.appId}`, {
    method: 'POST',
    data,
  });
}

// 更新环境

export async function updateEnv(data: {
  appId: number;
  id?: number;
  ident: string;
  name: string;
  status: string;
  deployType: string;
  deployName: string;
  deployConfig: {
    version: string;
    time: string;
    branch: string;
  };
}) {
  const id = data.id;
  delete data.id;
  return await request<ResponseResult>(`/devops-manager/v1/env/update/${id}?appId=${data.appId}`, {
    method: 'POST',
    data,
  });
}

// 删除环境

export async function deleteEnv(data: { id?: number }) {
  const id = data.id;
  delete data.id;

  return await request<ResponseResult>(`/devops-env-manager/v1/env/del/${id}`, {
    method: 'POST',
  });
}
