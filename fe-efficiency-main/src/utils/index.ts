/* eslint-disable @typescript-eslint/no-shadow */
export function debounce(fn: Function, delay: number, isImmediate?: boolean) {
  let timer: any = null; // 初始化timer，作为计时清除依据
  console.log('debounce');
  return function (...rest: any) {
    // @ts-ignore
    const context: any = this as any; // 获取函数所在作用域this
    const args = rest; // 取得传入参数
    console.log('timer:', timer);
    clearTimeout(timer);
    if (isImmediate && timer === null) {
      // 时间间隔外立即执行
      fn.apply(context, args);
      console.log('isImmediate:', timer);
      timer = 0;
      return;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null;
    }, delay);
  };
}
// fn 是需要执行的函数
// wait 是时间间隔
export const throttle = (fn: Function, wait = 50) => {
  // 上一次执行 fn 的时间
  let previous = 0;
  // 将 throttle 处理结果当作函数返回
  return function (...args: any) {
    // 获取当前时间，转换成时间戳，单位毫秒
    const now = +new Date();
    // 将当前时间和上一次执行函数的时间进行对比
    // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
    if (now - previous > wait) {
      previous = now;
      // @ts-ignore
      const context: any = this as any; // 获取函数所在作用域this
      fn.apply(context, args);
    }
  };
};
export function downloadFile(blob: any, name: string) {
  // FileReader主要用于将文件内容读入内存
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function (e: any) {
    const a: any = document.createElement('a');
    // 获取文件名fileName
    const fileName = `${name}`;
    a.download = fileName;
    a.href = e.target.result;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
}

// 获取url上的参数
export function getParamsToJson(): Record<string, any> {
  const paramJson = {};
  if (location.search) {
    const paramStr = location.search.substr(1);
    const paramArr = paramStr.split('&').filter((s) => s && s.trim());
    paramArr.map((item) => {
      const itemArr = item.split('=');
      paramJson[itemArr[0]] = itemArr[1];
      return null;
    });
  }
  return paramJson;
}

// autoId
export const autoId = (function () {
  const idsCache = [];
  let n = 0;
  return function () {
    n = n + 1;
    idsCache.push(n);
    return n;
  };
})();

type Ttree = {
  parent: any;
  children: Ttree[];
};

export const mapArrayToTree = (data: { parent: any }, key: string): Ttree => {
  const map = new Map();
  let result: any = {};
  if (!Array.isArray(data) || data.length === 0) {
    return result;
  }
  data.forEach((item) => map.set(item[key], item));
  data.forEach((item) => {
    const parent = map.get(item.parent);
    if (!parent) {
      result = item;
    } else {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
  });
  return result;
};

export const setUrlWithoutFreshBrowser = (params: Record<string, any>): string => {
  let paramsStr = '';
  let url = location.href;
  let defaultParams = getParamsToJson();
  defaultParams = Object.assign({}, defaultParams, params);
  Object.keys(defaultParams).forEach((key, index, keys) => {
    if (defaultParams.hasOwnProperty(key)) {
      paramsStr += `${key}=${defaultParams[key]}${index === keys.length - 1 ? '' : '&'}`;
    }
  });
  url = `${location.pathname}?${paramsStr}`;
  history.replaceState({ url: url, title: document.title }, document.title, url);
  return url;
};

export const delUrlParamsWithoutFreshBrowser = (keys: string[] = []): string => {
  let paramsStr = '';
  let url = location.href;
  const defaultParams = getParamsToJson();
  keys.forEach((key) => {
    if (defaultParams.hasOwnProperty(key)) {
      delete defaultParams[key];
    }
  });
  Object.keys(defaultParams).forEach((key, index, keys) => {
    if (defaultParams.hasOwnProperty(key)) {
      paramsStr += `${key}=${defaultParams[key]}${index === keys.length - 1 ? '' : '&'}`;
    }
  });
  url = `${location.pathname}?${paramsStr}`;
  history.replaceState({ url: url, title: document.title }, document.title, url);
  return url;
};
