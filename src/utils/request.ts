import * as fetch from 'isomorphic-fetch';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function obj2QueryString(url, obj) {
  const arr = [];
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      arr.push(`${key}=${encodeURIComponent(obj[key])}`);
    });
  }
  arr.push(`__t=${Date.now()}`);
  const queryStr = arr.join('&');
  if (url.indexOf('?') === -1) {
    return `${url}?${queryStr}`;
  }
  return `${url}&${queryStr}`;
}

async function redirectFor401(e) {
  let redirectUrl;
  if (e && e.response) {
    try {
      ({ redirectUrl } = await e.response.json());
    } catch (err) {
      // console.error(err);
    }
  }
  if (redirectUrl) {
    window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(window.location.href)}`;
  } else {
    window.location.reload(true);
  }
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error: any = new Error(errortext);
  error.name = response.status;
  error.response = response;
  error.type = 'requestError';
  throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options: any = {}) {
  const newUrl = obj2QueryString(url, options.qs);
  const defaultOptions = {
    credentials: 'include',
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
    },
  };
  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  newOptions.method = newOptions.method.toUpperCase();
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        ...newOptions.headers,
      };
    }
  }
  return fetch(newUrl, newOptions)
    .then(checkStatus)
    .then(async response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      // if (newOptions.method === 'DELETE' || response.status === 204) {
      //   return response.text();
      // }
      const data = await response.json();
      return data;
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        redirectFor401(e);
      }
      // throw e;
    });
}
