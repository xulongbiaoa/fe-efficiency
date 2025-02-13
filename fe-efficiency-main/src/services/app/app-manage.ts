import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

//获取应用列表
type TGetAppList = {
  scope?: number;
  search?: string;
  unitCodes?: string;
  type?: number;
  level?: number;
  status?: number;
  pageNo?: number;
  pageSize?: number;
};
export async function getAppList(params: TGetAppList) {
  const defaultParams = {
    scope: 0,
    search: '',
    unitCodes: '',
    // type: 0,
    // level: 101,
    // status: 0,
    pageNo: 1,
    pageSize: 15,
  };

  return await request<ResponseResult>(`/devops-manager/v1/app/list`, {
    method: 'GET',
    params: Object.assign(defaultParams, params),
  });
}

//创建应用
type ICreateApp = {
  name: string;
  unitCode: string;
  devLang: string;
  type: number;
  devRepo: string;
  level: number;
  desc?: string;
};

export async function createApp(data: ICreateApp) {
  return await request<ResponseResult>(`/devops-manager/v1/app/create`, {
    method: 'POST',
    data,
  });
}

//应用详情
export async function getAppDetail(id: string | number) {
  return await request<ResponseResult>(`/devops-manager/v1/app/detail/${id}`, {
    method: 'GET',
  });
}

// 更新应用
export async function updateApp(
  id: number,
  data: {
    name: string;
    unitCode: string;
    desc: string;
    type: number;
    level: number;
    status: number;
    devLang: string;
    devMode: number;
    devRepo: string;
    trunk: string;
  },
) {
  return await request<ResponseResult>(`/devops-manager/v1/app/update/${id}`, {
    method: 'POST',
    data,
  });
}

// 删除应用
export async function deleteApp(id: number) {
  return await request<ResponseResult>(`/devops-manager/v1/app/del/${id}`, {
    method: 'POST',
  });
}

// 应用下线
export async function offlineApp(id: number) {
  return await request<ResponseResult>(`/devops-manager/v1/app/offline/${id}`, {
    method: 'POST',
  });
}

// 添加角色成员
export async function addMember(data: {
  roleId: number;
  roleName: string;
  members: { id: number; uid: string; name: string };
}) {
  return request<ResponseResult>(`/devops-manager/v1/roleMember/add`, {
    method: 'POST',
    data,
  });
}

// 转交角色成员
export async function transMember() {}

// 查询分支
export async function checkBranchRef(params: { appId: number; search: string }) {
  return request<ResponseResult>(`/devops-manager/v1/code/branch/list`, {
    method: 'GET',
    params,
  });
}

// 创建分支
export async function createBranch(data: { appId: number; branch: string; ref: string }) {
  return request<ResponseResult>(`/devops-manager/v1/code/branch/add`, {
    method: 'POST',
    data,
  });
}

// 查询仓库
export async function codeLibrarySearch(params: { search: string }) {
  return request<ResponseResult>(`/devops-manager/v1/code/project/list`, {
    method: 'GET',
    params,
  });
}
