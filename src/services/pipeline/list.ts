import { request } from '@/utils/request';
import type { ResponseResult, TableResponseResult } from '@/app.global';
import { tableResponseAdapter, tableRequestParamsAdapter } from '@/utils/adapters';

// 获取配置字典

interface IDictItem {
  key: string;
  name: string;
  parentKey: string;
  item: any;
}
export interface IDict {
  COLLECT_TYPE_DICT: IDictItem[];
  ROOT: IDictItem[];
  RUN_STATUS_DICT: IDictItem[];
  PIPELINE_RUN_ENV_DICT: IDictItem[];
}
export async function getDict() {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/query`, {
    method: 'GET',
  });
}

// 获取流水线列表

export function getPipelineList(extraParams: {
  groupType?: 'MY' | 'COLLECT' | 'GROUP';
  groupId?: number;
}) {
  return async (
    params: {
      current?: number;
      pageSize?: number;
      name?: string;
      pipelineName?: string;
    },
    options?: Record<string, any>,
  ) => {
    params.name = params.pipelineName;
    delete params.pipelineName;

    const r = await request<TableResponseResult<any[]>>(`/devops-pipeline/v1/instance/list`, {
      method: 'GET',
      params: {
        ...tableRequestParamsAdapter(params),
        ...options,
        ...extraParams,
      },
    });
    return tableResponseAdapter<any[]>(r);
  };
}

// 创建流水线by empty

// export async function createPipelineByEmpty() {
//   return await request<ResponseResult>(`/devops-pipeline/v1/instance/saveOrUpdate`, {
//     method: 'POST',
//     data: {},
//   });
// }

// 修改 template

// export async function createPipelineByTempalte(data: { id: number }) {
//   return await request<ResponseResult>(`/devops-pipeline/v1/tpl/saveOrUpdate`, {
//     method: 'POST',
//     data,
//   });
// }

// 流水线复制

export async function copyPipeline(data: { id: number }) {
  return await request<ResponseResult>(`/devops-pipeline/v1/instance/copy`, {
    method: 'POST',
    data,
  });
}

// 获取运行变量

export async function getConfigVar(params: { id: number }) {
  return await request<ResponseResult>(`/devops-pipeline/v1/instance/detail`, {
    method: 'GET',
    params,
  });
}
// 运行流水线

export async function runPipeline(params: {
  ids: number[];
  remark: string;
  [key: string]: string | number[];
}) {
  return await request<ResponseResult>(`/devops-pipeline/v1/instance/run`, {
    method: 'GET',
    params,
  });
}

//  获取流水线收藏列表

export async function getCollectPipeline() {
  return await request<ResponseResult>(`/devops-pipeline/v1/collect/PIPELINE/list`, {
    method: 'GET',
  });
}
//  收藏流水线

export async function addCollectPipeline(data: number[]) {
  return await request<ResponseResult>(`/devops-pipeline/v1/collect/PIPELINE/add`, {
    method: 'POST',
    data,
  });
}

// 取消收藏流水线
export async function delCollectPipeline(data: number[]) {
  return await request<ResponseResult>(`/devops-pipeline/v1/collect/PIPELINE/del`, {
    method: 'POST',
    data,
  });
}

// 删除流水线

export async function deletePipelines(data: number[]) {
  return await request<ResponseResult>(`/devops-pipeline/v1/instance/delete`, {
    method: 'POST',
    data,
  });
}

// 流水线分组

export async function pipelinesGroup(data: { ids: number[]; groupId: number }) {
  return await request<ResponseResult>(`/devops-pipeline/v1/instance/group`, {
    method: 'POST',
    data,
  });
}

// 查询分组

export async function getGroup() {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/PIPELINE_GROUP_DICT/list`, {
    method: 'GET',
  });
}

// 查询标签

export async function getTag() {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/PIPELINE_TAG_DICT/list`, {
    method: 'GET',
  });
}

// 删除标签

export async function deleteTag(data: { name: string }) {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/PIPELINE_TAG_DICT/del`, {
    method: 'POST',
    data,
  });
}

// 增加标签

export async function addTag(data: { name: string }) {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/PIPELINE_TAG_DICT/add`, {
    method: 'POST',
    data,
  });
}

// 删除分组

export async function deleteGroup(data: { name: string }) {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/PIPELINE_GROUP_DICT/del`, {
    method: 'POST',
    data,
  });
}

//  获取gourp收藏列表

export async function getCollectGroup() {
  return await request<ResponseResult>(`/devops-pipeline/v1/collect/GROUP/list`, {
    method: 'GET',
  });
}

//  收藏分组

export async function collectGroup(data: number[]) {
  return await request<ResponseResult>(`/devops-pipeline/v1/collect/GROUP/add`, {
    method: 'POST',
    data,
  });
}

//  取消收藏分组

export async function delCollectGroup(data: number[]) {
  return await request<ResponseResult>(`/devops-pipeline/v1/collect/GROUP/del`, {
    method: 'POST',
    data,
  });
}

//  增加分组

export async function addCollectGroup(data: { name: string }) {
  return await request<ResponseResult>(`/devops-pipeline/v1/dict/PIPELINE_GROUP_DICT/add`, {
    method: 'POST',
    data,
  });
}

// 获取模版
type TGetTemplate = {
  category?: string;
  pageNo?: number;
  pageSize?: number;
  id?: number;
  search?: string;
};

export async function getTemplate(params?: TGetTemplate) {
  return await request<ResponseResult>(`/devops-pipeline/v1/tpl/list`, {
    method: 'GET',
    params: params || '',
  });
}

// 模板类别

export const getCategoryList = async () => {
  return await request<ResponseResult>('/devops-pipeline/v1/tpl/category', {
    method: 'GET',
  });
};

// 流水线实例query

type TGetPipelineInsList = {
  search?: string;
};

export async function getPipelineInsList(params?: TGetPipelineInsList) {
  return await request<ResponseResult>(`/devops-pipeline/v1/inst/pipeline/query`, {
    method: 'GET',
    params: params || '',
  });
}
