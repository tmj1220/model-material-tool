import { message } from 'antd'
import { getMaterialCategory, getResource, getResourceByKeyword } from '@/services/list'

interface DefaultState {
  requestParams: IResourceParams
  defaultRequestParams: IResourceParams
  curCategory: 2 | 3 | null // 2 资产 3关于
  materialCategory: Material[] // 材质下的分类
  searchKeyword: string // 搜索关键字
  resources: BaseSource[] // 资源列表
  isGetMoreResources: boolean // 是否能够加载更多资源
  curSearchTag: ITagInfo[] // 当前筛选的标签类型
}

const defaultState: DefaultState = {
  requestParams: {
    pageNum: 1,
    pageSize: 10,
    /** 创建时间 */
    order: 'gmt_created',
    /** 倒序 */
    direction: 'desc',
  },
  defaultRequestParams: {
    pageNum: 1,
    pageSize: 10,
    /** 创建时间 */
    order: 'gmt_created',
    /** 倒序 */
    direction: 'desc',
  },
  curCategory: 2, //  2 资产
  materialCategory: [], // 材质下的分类
  searchKeyword: '', // 搜索关键字
  resources: [], // 资源列表
  isGetMoreResources: true, // 是否能够加载更多资源
  curSearchTag: [], // 当前筛选的标签类型
};

const stores = {
  state: defaultState,
  reducers: {
    updateCurCategory: (prevState: DefaultState, tab) => ({ ...prevState, curCategory: tab }),
    updateMaterialCategory: (prevState: DefaultState, categorys) => (
      { ...prevState, materialCategory: categorys }
    ),
    updateRequestParams: (prevState: DefaultState, params: IResourceParams) => (
      { ...prevState, requestParams: params }
    ),
    updateSearchKeyword: (prevState: DefaultState, keyword: string) => (
      { ...prevState, searchKeyword: keyword }
    ),
    updateIsGetMoreResources: (prevState: DefaultState, status: boolean) => (
      { ...prevState, isGetMoreResources: status }
    ),
    updateCurSearchTag: (prevState: DefaultState, tag: ITagInfo[]) => (
      { ...prevState, curSearchTag: tag }
    ),
    updateResources: (prevState: DefaultState, list) => (
      {
        ...prevState,
        resources: prevState.resources.concat(list),
      }
    ),
    updateResourcesAll: (prevState: DefaultState, list) => (
      {
        ...prevState,
        resources: list,
      }
    ),
    clearResources: (prevState: DefaultState) => (
      {
        ...prevState,
        resources: [],
      }
    ),
  },
  effects: () => ({
    // 获取材质分类
    async getMaterialCategory() {
      try {
        const res = await getMaterialCategory()
        const category = [...res]
        category.unshift({
          categoryId: '',
          categoryName: '全部',
        })
        this.updateMaterialCategory(category)
      } catch (error) {
        message.error(error?.message)
      }
    },
    async getResourceList(params: IResourceParams) {
      try {
        this.updateRequestParams(params)
        const res = await getResource(params)
        if (res.rows) {
          // 请求第一页数据
          if (params.pageNum === 1) {
            this.updateResourcesAll(res.rows)
          } else {
            this.updateResources(res.rows)
          }
          /** 当前请求的数据小于页码，则是最后一页 */
          if (res.rows.length < params.pageSize) {
            this.updateIsGetMoreResources(false)
          }
        }
      } catch (error) {
        message.error(error?.message)
      }
    },
    async getResourceByKeyword(params: IResourceParams) {
      try {
        this.updateRequestParams(params)
        const res = await getResourceByKeyword(params)
        if (res.rows) {
          // 请求第一页数据
          if (params.pageNum === 1) {
            this.updateResourcesAll(res.rows)
          } else {
            this.updateResources(res.rows)
          }
          /** 当前请求的数据小于页码，则是最后一页 */
          if (res.rows.length < params.pageSize) {
            this.updateIsGetMoreResources(false)
          }
        }
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
