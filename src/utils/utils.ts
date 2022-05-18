/* eslint-disable no-useless-escape */
import jsCookie from 'js-cookie'

export const hasOwnProperties = (
  obj:Object,
  keys:Array<string|number>,
) => !keys.some((key) => !Object.prototype.hasOwnProperty.call(obj, key))

export const getLanguage = () => {
  const lang = localStorage.getItem('language') || window.navigator.language;
  const region = lang.split('-')[0];
  const langMap = { zh: 'zh-CN', en: 'en-US' }

  if (['zh', 'en'].indexOf(region) > -1) {
    return langMap[region];
  }
  return langMap.en;
}

export const getParameterByName = (name: string, url?: string) => {
  if (!url) {
    url = window.location.href
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const getToken = () => jsCookie.get('Admin-Token')
export const removeToken = () => jsCookie.remove('Admin-Token')

export const setToken = (value) => jsCookie.set('Admin-Token', value)
