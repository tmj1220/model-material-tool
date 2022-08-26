/* eslint-disable no-unused-vars */
declare interface IResourceParams {
  pageNum: number
  pageSize: number
  resourceType?: 1 | 2 | null // 1:模型 2材质 null:全部
  keyword?: string // 检索关键字
  materialCategoryId?: string // 材质分类
  tagId?: string // 标签id
}
