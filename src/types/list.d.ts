/* eslint-disable no-unused-vars */
declare interface IResourceParams {
  pageNum: number
  pageSize: number
  resourceType?: 2 | 3 | null //  2 资产 null:全部
  keyword?: string // 检索关键字
  materialCategoryId?: string // 材质分类
  tagId?: string // 标签id
  mine?: number // 是否获取自己上传的资源，1获取自己的
  order?: string // 排序:gmt_modified根据修改时间排序,score 根据关联性排序
  direction?: string // desc倒序 asc正序
  format?: string // 文件格式 示例值：c4d
  resourcePoiType?: string // POI类型分类 示例值：启动确认
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
  resourceFileSize?: number
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
  resourceThumbRgb?:string;
  resourceSn?: string
  format?: string
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
