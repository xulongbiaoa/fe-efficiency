import { request } from '@/utils/request';
import type { TableResponseResult } from '@/app.global';
import { tableResponseAdapter } from '@/utils/adapters';

// 获取模版
type TGetTemplate = {
  category?: string;
  pageNo?: number;
  pageSize?: number;
  id?: number;
  search?: string;
  current?: number;
};

export async function getTemplate(params?: TGetTemplate) {
  if (params?.current) {
    params.pageNo = params?.current;
    delete params.current;
  }

  const r = await request<TableResponseResult<[]>>(`/devops-pipeline/v1/tpl/list`, {
    method: 'GET',
    params: params,
  });
  return tableResponseAdapter<any[]>(r);
}

// 删除模版

export async function delTemplate(data: number[]) {
  const r = await request<TableResponseResult<[]>>(`/devops-pipeline/v1/tpl/delete`, {
    method: 'POST',
    data,
  });
  return tableResponseAdapter<any[]>(r);
}
