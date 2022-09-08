/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-26 17:52:11
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-08-29 18:19:36
 * @FilePath: /model-material-tool/src/services/addModel.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import request from '@/utils/request'

// 获取材质分类
export async function addModel(data) {
  return request('/resource', {
    method: 'POST',
    data,
  });
}
// 获取标签分类
export async function getTags() {
  return request('/resource/tag');
}
// 新增标签
export async function addTag(data) {
  return request('/resource/tag', {
    method: 'POST',
    data,
  });
}
