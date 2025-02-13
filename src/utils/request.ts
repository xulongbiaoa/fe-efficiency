import { request as umiRequest } from 'umi';
import { CODE_MESSAGE } from '@/constants';
import { message } from 'antd';
import gateway from '@/gateway.config';
import { logout, loginErrorCodes } from 'open-login-utils';
import { SentryUtils } from '@dw/sentry-utils';
const { userServer, openLoginDomain, poolCode, appCode, incServer } = gateway;
export const request = async <T = any>(url: string, options: any = {}): Promise<T> => {
  let newUrl = '';

  if (url.startsWith('/idaasweb')) {
    newUrl = `${userServer}${url}`;
  } else {
    newUrl = `${incServer}${url}`;
  }
  //  authentication
  const skipErrorHandler = options.skipErrorHandler;
  // 关闭框架默认的异常处理逻辑
  options.skipErrorHandler = true;
  let resData: any = await umiRequest<T>(newUrl, options).catch((error) => {
    const { status, statusText, data } = error?.response || {};
    SentryUtils.uploadErrorMsg(url, error);
    if (!status) {
      return {
        success: false,
        data: data || {},
        errorCode: null,
        errorMessage: '接口请求失败',
      };
    }
    const errorMessage = data?.message || CODE_MESSAGE[status] || statusText;
    const errorCode = status.toString();
    return {
      success: false,
      data: data || {},
      errorCode,
      errorMessage,
    };
  });

  const normalResponseSchemaKeyMap = {
    success: false,
    errorMessage: false,
    errorCode: false,
    data: false,
  };

  const normalResponseSchemaKey = Object.keys(normalResponseSchemaKeyMap);
  Object.keys(resData).forEach((key) => {
    if (normalResponseSchemaKey.includes(key)) {
      normalResponseSchemaKeyMap[key] = true;
    }
  });
  let isNormalResponseData = true;
  normalResponseSchemaKey.forEach((key) => {
    if (!normalResponseSchemaKeyMap[key]) {
      isNormalResponseData = false;
    }
  });

  // 如果api返回的数据不是统一的schema则需要进行适配
  if (!isNormalResponseData) {
    const rpCode = resData.code;
    resData = {
      success: rpCode === '00000',
      errorMessage: resData.message,
      errorCode: rpCode !== '00000' ? rpCode : '',
      data: resData.data,
    };
  }
  // 自定义的默认全局异常处理逻辑
  if (!skipErrorHandler && resData.success === false) {
    // 未登录
    if (loginErrorCodes.indexOf(resData.errorCode) > -1) {
      // history.push({
      //   pathname: '/user/login',
      // });
      window.history.replaceState({}, document.title, location.origin);
      logout({ openLoginDomain, poolCode, appCode });
    } else if (resData.errorMessage) {
      message.error(resData.errorMessage);
    }
  }

  return resData as unknown as Promise<T>;
};
