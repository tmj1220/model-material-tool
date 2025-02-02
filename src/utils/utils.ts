/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-26 12:06:58
 * @LastEditors: mingjian.tang mingjian.tang@rokid.com
 * @LastEditTime: 2022-09-25 15:30:53
 * @FilePath: /model-material-tool/src/utils/utils.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable no-useless-escape */
import jsCookie from 'js-cookie'

export const hasOwnProperties = (
  obj: Object,
  keys: Array<string | number>,
) => !keys.some((key) => !Object.prototype.hasOwnProperty?.call(obj, key))

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

/** 获取所有参数
* @returns json/object
*/
export const getQueryString = () => {
  // 定义返回结果
  const result: Record<string, any> = {};
  // 获取url上的参数（使用decodeURIComponent对url参数进行解码）
  const search = decodeURIComponent(window.location.search);
  const tempArr = search !== '' ? search.substr(1).split('&') : [];

  tempArr.forEach((item) => {
    if (item) {
      // 将参数名和参数值拆分
      const itemArr = item.split('=');
      // 参数名作为key, 参数值为value
      // eslint-disable-next-line prefer-destructuring
      result[itemArr[0]] = itemArr[1];
    }
  });

  return result;
}

export const getCompanyCode = () => {
  const tmp = getQueryString();
  if (tmp.state === '1212' && tmp.code && Object.keys(tmp).length === 2) {
    return localStorage.getItem('companyCode');
  }
  return getParameterByName('code') || localStorage.getItem('companyCode');
}

export const getToken = () => jsCookie.get('Admin-Token')
export const removeToken = () => jsCookie.remove('Admin-Token')

export const setToken = (value) => jsCookie.set('Admin-Token', value)

export const redirectLogin = () => {
  removeToken()
  const currentUrl = window.location.pathname + window.location.search;
  const redirectUrl = encodeURIComponent(currentUrl);
  if (window.location.pathname === '/login') {
    window.location.reload();
  } else if (redirectUrl === '%2Fempty') { // 如果是从/empty跳登录  就不加重定向
    window.location.href = '/login';
  } else {
    window.location.href = '/login';
  }
};

// 匹配这些中文标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥
export const commonReg = {
  specialCharOfZh: /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/,
  importabilityChar: /^[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|a-zA-Z\u4e00-\u9fa50-9!-~]+$/,
  importabilityCharAnother: /^(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g,
  emoj: /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/,
}
/** @name kb换算成mb，gb，tb */
export const figureFileSize = (size) => { // 把字节转换成正常文件大小
  if (!size) return '';
  const num = 1024.00; // byte
  if (size < num) { return `${size}B`; }
  if (size < num ** 2) { return `${(size / num).toFixed(2)}KB`; } // kb
  if (size < num ** 3) { return `${(size / num ** 2).toFixed(2)}MB`; } // M
  if (size < num ** 4) { return `${(size / num ** 3).toFixed(2)}G`; } // G
  return `${(size / num ** 4).toFixed(2)}T`; // T
}
