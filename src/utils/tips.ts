import { getLanguage } from './utils'

const tips = {
  'request.fail': {
    'en-US': 'Request Failed',
    'zh-CN': '请求失败',
  },
  'network.err': {
    'en-US': 'Network Error',
    'zh-CN': '网络异常',
  },
  'login.invalid': {
    'en-US': '您的登录状态已失效，请重新登录',
    'zh-CN': '您的登录状态已失效，请重新登录',
  },
}

export const getTips = (key) => {
  const lang = getLanguage()
  const tipItemKey = Object.keys(tips).find((k) => k === key)
  if (!tipItemKey) {
    return null
  }
  const tip = tips[tipItemKey][lang] || null
  return tip
}
