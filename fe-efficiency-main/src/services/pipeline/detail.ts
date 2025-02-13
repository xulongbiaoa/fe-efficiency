import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';

// 流水线运行历史记录
export const getPiplelineHistoryList = async (params: {
  instanceId: number;
  pageNo: number;
  pageSize: number;
}) => {
  return await request<ResponseResult>('/devops-pipeline/v1/runlog/list', {
    method: 'GET',
    params,
  });
};

// 流水线运行详情
export const getPipelineDetail = async (params: { runLogId: number | string }) => {
  return await request<ResponseResult>('/devops-pipeline/v1/runlog/detail', {
    method: 'GET',
    params,
  });
};

// 流水线实例详情
export const getPipelineInstanceDetail = async (params: { id: number | string }) => {
  return await request<ResponseResult>('/devops-pipeline/v1/instance/detail', {
    method: 'GET',
    params,
  });
};

// 流水线保存/更新
export const savePipelineInstanceConfig = async ({
  id,
  data,
}: {
  id?: number | string;
  data: any;
}) => {
  const url = id
    ? `/devops-pipeline/v1/instance/saveOrUpdate?id=${id}`
    : `/devops-pipeline/v1/instance/saveOrUpdate`;
  return await request<ResponseResult>(url, {
    method: 'POST',
    data,
  });
};

// 流水线保存/更新
export const saveTemplateInstanceConfig = async ({
  id,
  data,
}: {
  id?: number | string;
  data: any;
}) => {
  const url = id
    ? `/devops-pipeline/v1/tpl/saveOrUpdate?id=${id}`
    : `/devops-pipeline/v1/tpl/saveOrUpdate`;
  return await request<ResponseResult>(url, {
    method: 'POST',
    data,
  });
};

// 获取日志菜单
export const getLogStepList = async (params: { runLogId: number; stageId: number }) => {
  return await request<ResponseResult>('/devops-pipeline/v1/runsteplog/list', {
    method: 'GET',
    params,
  });
};

// 获取日志详情
export const getLogStepDetail = async (params: { runStepLogId: number }) => {
  return await request<ResponseResult>('/devops-pipeline/v1/runsteplog/detail', {
    method: 'GET',
    params,
  });
};

// 流水线记录重新轮询

export const runRePolling = async (id: number) => {
  return await request<ResponseResult>('/devops-pipeline/v1/runlog/rePolling', {
    method: 'POST',
    data: [id],
  });
};
// 静态字典集合
/**
 *
 * @param  COLLECT_TYPE_DICT (分组)
 * @param  PIPELINE_TAG_DICT（标签）
 * @param  PIPELINE_RUN_ENV_DICT (环境)
 * @returns
 */
export const getStaticGroupAndTag = async (parentKey: string) => {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/${parentKey}/list`, {
    method: 'GET',
  });
};
//
export const getStaticDicQuery = async (params: { parentKeys: string }) => {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/query`, {
    method: 'GET',
    params,
  });
};

// 模版详情

export const getTemplateDetail = async (params: { id: number }) => {
  return await request<ResponseResult>('/devops-pipeline/v1/tpl/detail', {
    method: 'GET',
    params,
  });
};

// 模板所有类目
export const getTemplateCategory = async () => {
  return await request<ResponseResult>('/devops-pipeline/v1/tpl/category', {
    method: 'GET',
  });
};

// 更新流水线的某些参数
export const updatePipelineParams = async (id: number, data: { [key: string]: any }) => {
  return await request<ResponseResult>(`/devops-manager/v1/stage/pipeline/update/${id}`, {
    method: 'post',
    data,
  });
};
