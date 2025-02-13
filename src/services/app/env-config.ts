import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

// 环境变量
export async function getVarList(envId: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/variable/list`, {
    method: 'GET',
    params: { envId },
  });
}

// 文件列表
export async function getFileList(params: { envId: number; type?: string; subType?: string }) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/file/list`, {
    method: 'GET',
    params,
  });
}

// 文件修改
export async function setFileChange(
  id: number,
  data: {
    fileName: string;
    fileValue: string;
  },
) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/file/update/${id}`, {
    method: 'POST',
    data,
  });
}

// 文件新增
export async function addFile(data: {
  envId: number;
  fileName: string;
  type: string;
  subType: string;
  fileValue: string;
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/file/create`, {
    method: 'POST',
    data,
  });
}

// 文件删除
export async function delFile(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/file/del/${id}`, {
    method: 'POST',
  });
}

// 根据文件名称获取内容
export async function getContentByFiletype(params: {
  envId: number;
  type: string;
  fileName: string;
}) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/file/detail`, {
    method: 'GET',
    params,
  });
}

// 重置文件 /devops-env-manager/v1/env/file/reset/{id}

export async function resetFile(id: number) {
  return await request<ResponseResult>(`/devops-env-manager/v1/env/file/reset/${id}`, {
    method: 'POST',
  });
}
