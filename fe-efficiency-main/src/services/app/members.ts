import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

// 根据昵称模糊查询用户
export const searchUserByNickName = async (params: { nickName: string }) => {
  return await request<ResponseResult>(`/idaasweb/user/listAccountByNickName`, {
    method: 'GET',
    params,
  });
};

// 查询角色列表
export const checkRoleList = async (params: { entityType: string }) => {
  return await request<ResponseResult>(`/devops-manager/v1/role`, {
    method: 'GET',
    params,
  });
};

// 添加角色成员
export const addMember = async (data: {
  entityType: string;
  entityId: number;
  roleId: number;
  members: {
    userId: string;
    name: string;
  }[];
}) => {
  return await request<ResponseResult>(`/devops-manager/v1/roleMember/add`, {
    method: 'POST',
    data,
  });
};

// 查询成员
export const checkMembers = async (params: {
  entityType: string;
  entityId: number;
  roleId?: number;
}) => {
  return await request<ResponseResult>(`/devops-manager/v1/roleMember/list`, {
    method: 'GET',
    params,
  });
};

// 删除成员
export const deleteMembers = async (id: number) => {
  return await request(`/devops-manager/v1/roleMember/del/${id}`, {
    method: 'POST',
  });
};

// 转交成员
export const transferMembers = async (
  id: number,
  data: {
    uuid: string;
    name: string;
  },
) => {
  return await request(`/devops-manager/v1/roleMember/passOn/${id}`, {
    method: 'POST',
    data,
  });
};
