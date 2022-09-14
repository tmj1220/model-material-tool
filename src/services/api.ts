/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-26 18:18:56
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-14 15:57:29
 * @FilePath: /model-material-tool/src/services/api.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import request from '@/utils/request';

// 获取用户信息
export async function getUserInfoService() {
  return request('/user/current/name');
}
// 登录
export async function login(data) {
  return request('/auth', {
    method: 'POST',
    data,
  });
}
// 退出
export async function logout() {
  return request('/auth', {
    method: 'DELETE',
  });
}
