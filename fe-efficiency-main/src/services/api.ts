// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import { ResponseResult } from '@/app.global';
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<
    ResponseResult<{
      data: API.CurrentUser;
    }>
  >('/mock/43/optimus-producer/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/mock/43/optimus-producer/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  console.log('login1111');
  return request<ResponseResult<API.LoginResult>>('/mock/43/optimus-producer/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
    skipErrorHandler: true,
  });
}
