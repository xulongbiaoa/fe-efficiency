import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

// 阶段列表
export const getStageList = (appId: number) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/list`, {
    method: 'GET',
    params: { appId },
  });
};

// 创建阶段
export const createStage = (data: {
  appId: number;
  ident: string;
  name: string;
  envId: number;
  envIdent: string;
  branchType: number; //分支类型 0 固定分支 1 特性分支
  branchValue: string; //分支值
  order: number; // 顺序
}) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/create`, {
    method: 'POST',
    data,
  });
};

// 更新阶段
export const updateStage = (
  appId: number,
  data: {
    ident: string;
    name: string;
    envId: number;
    envIdent: string;
    branchType: number; //分支类型 0 固定分支 1 特性分支
    branchValue: string; //分支值
    order: number; // 顺序
  },
) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/update/${appId}`, {
    method: 'POST',
    data,
  });
};

// 删除阶段
export const deleteStage = (
  appId: number,
  data: {
    ident: string;
    name: string;
    envId: number;
    envIdent: string;
    branchType: number; //分支类型 0 固定分支 1 特性分支
    branchValue: string; //分支值
    order: number; // 顺序
  },
) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/del/${appId}`, {
    method: 'POST',
    data,
  });
};

// 查询流水线
export const checkStagePipelineList = (params: {
  appId: number;
  stageId: number;
  name: string;
}) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/pipeline/list`, {
    method: 'GET',
    params,
  });
};

// 创建/关联/复制 流水线
export const createPipelineWithStage = (data: {
  stageId: number;
  name: string;
  op: number; // 0:由模板新建，1:关联已有实例 2:复制已有实例
  pipelineTplId?: number; // pipeline模版ID，新建时使用
  pipelineInstId?: number; // pipeline实例ID，关联/复制时使用
}) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/pipeline/create`, {
    method: 'POST',
    data,
  });
};

// 删除流水线
export const deletePipelineWithStage = (data: number[]) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/pipeline/del`, {
    method: 'POST',
    data,
  });
};

//
// 绑定默认触发流水线
export const pipelineDefmark = (id: number, data: { defMark: number }) => {
  return request<ResponseResult>(`/devops-manager/v1/stage/pipeline/defmark/${id}`, {
    method: 'POST',
    data,
  });
};
