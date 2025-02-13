// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import { TableListItem } from '@/datas/data';
import { tableResponseAdapter } from '@/utils/adapters';
import { ResponseResult, TableResponseResult } from '@/app.global';

export async function getUserList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const r = await request<TableResponseResult<TableListItem[]>>('/api/user/list', {
    method: 'GET',
    params: {
      ...params,
      ...options,
    },
  });
  return tableResponseAdapter<TableListItem[]>(r);
}
interface D {
  name: string;
  age: number;
}
export async function saveUser(data: any) {
  const r = await request<ResponseResult<D>>('/api/saveUser', {
    data,
    method: 'POST',
  });

  return r;
}
export async function getUserDetail(params: { poolCode: string }) {
  return await request<ResponseResult>(`/idaasweb/user/getOne`, {
    method: 'GET',
    params,
  });
}
