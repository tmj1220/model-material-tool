/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: mingjian.tang mingjian.tang@rokid.com
 * @LastEditTime: 2022-09-21 15:15:32
 * @FilePath: /model-material-tool/src/types/list.d.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable no-unused-vars */
declare interface IResourceParams {
  pageNum: number
  pageSize: number
  resourceType?: 1 | 2 |3| null // 1:模型 2材质 null:全部
  keyword?: string // 检索关键字
  materialCategoryId?: string // 材质分类
  tagId?: string // 标签id
  mine?: number // 是否获取自己上传的资源，1获取自己的
  order?: string // 排序:gmt_modified根据修改时间排序,score 根据关联性排序
  direction?: string // desc倒序 asc正序
}
declare interface ITagInfo {
  tagId: string
  tagName: string
}

declare interface InfoForDownload{
  modelType:string
  resourceFileUrl:string
  suffix:string
  key:string
}
declare interface BaseSource {
  gmtModified:string
  categoryName?:string
  modifiedUserName: string
  resourceId: string
  resourceName: string
  resourceThumbFileId: string
  resourceThumbUrl: string
  resourceType: number
  tagInfo?: any
  resourceDescription?: string
  tagIdList?: string
  tagInfoList?: ITagInfo[]
  infoForDownload:Map<string, InfoForDownload>
  children?: React.ReactNode;
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
