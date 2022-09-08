/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-07 19:24:59
 * @FilePath: /model-material-tool/src/types/list.d.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable no-unused-vars */
declare interface IResourceParams {
  pageNum: number
  pageSize: number
  resourceType?: 1 | 2 | null // 1:模型 2材质 null:全部
  keyword?: string // 检索关键字
  materialCategoryId?: string // 材质分类
  tagId?: string // 标签id
}
declare interface ITagInfo {
  tagId: string
  tagName: string
}

declare interface BaseSource {
  gmtModified:string
  categoryName: string
  resourceId: string
  resourceName: string
  resourceThumbFileId: string
  resourceThumbUrl: string
  resourceType: number
  tagInfo?: any
  resourceDescription?: string
  tagIdList?: string
  tagInfoList?: ITagInfo[]
}

declare interface Material {
  categoryId: string
  categoryName: string
  createdBy: string
  gmtCreated: number
  gmtModified: number
  id: number
  modifiedBy: string
}
