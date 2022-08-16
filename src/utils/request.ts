import axios, { AxiosRequestConfig } from 'axios'
import { notification, Modal } from 'antd'
import { getLanguage, getToken, redirectLogin } from './utils'
import { getTips } from './tips'

// 请求不需要带上token的接口
const NoTokenUrls = ['/auth/oauth/token']

// 通用业务统一接口 响应json的数据结构
// interface BusinessJson{
//   code: number
//   data: any
//   msg: string
//   timestamp: number
//   uuid:string
// }
// 通用业务统一接口 响应json的数据结构的key
// const BusinessJsonKeys = ['code', 'data', 'msg', 'timestamp', 'uuid']

const instance = axios.create({
  baseURL: '/api',
  // timeout: 1000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    credentials: 'include',
    'Accept-Language': getLanguage(),
  },
  validateStatus(status) {
    if (status === 403) {
      window.location.href = '/exception/403'
    }
    if (status === 401) {
      redirectLogin()
    }
    return status >= 200 && status < 300; // 默认值
  },
  transitional: {
    // silentJSONParsing: false,
    // forcedJSONParsing: false,
  },
});

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  console.log('request config', config);
  // 如果存在token 并且 当前请求是
  const token = getToken()
  if (token
    && !NoTokenUrls.includes(config.url)
  ) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, (error) => {
  // 对请求错误做些什么
  console.log('request error', error);
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  const { data, config } = response
  console.log('response', response);
  /**
  *如果响应的data 确定是 所有业务接口统一响应的json数据结构 BusinessJson
  *  code === 1 说明请求业务接口返回状态正常 直接返回data.data
  *  code !==1 直接抛错
  */
  const isJson = !config.responseType || config.responseType === 'json'
  if (isJson
    && (data instanceof Object)
    // && hasOwnProperties(data, BusinessJsonKeys)
  ) {
    if (data.code === 1) {
      return data.data
    } if (data.code === 10002) {
      Modal.warn({
        title: getTips('login.invalid'),
        onOk: redirectLogin,
      })
      throw new Error('loginInvalid')
    }
    throw new Error(data.msg)
  }

  /**
   * 如果响应的data 不是业务接口业务接口统一响应的json数据结构
   * 那么直接返回data
   */
  return data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  console.log('response error', error);
  return Promise.reject(error);
});

const request = (url, options:AxiosRequestConfig = {}):any => instance.request({
  url,
  ...options,
}).catch((err) => {
  if (axios.isCancel(err)) {
    // 如果是主动取消的不用报错
    console.log('Request canceled', err.message)
    throw err
  }
  const isLoginInvalid = err.message === 'loginInvalid'
  const isNetWorkError = err.message === 'Network Error'
  if (!isLoginInvalid) {
    notification.error({
      message: getTips('request.fail'),
      description: isNetWorkError ? getTips('network.err') : err.message,
    })
  }

  throw err
})

export default request
