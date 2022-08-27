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
