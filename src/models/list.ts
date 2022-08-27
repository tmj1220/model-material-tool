import { message } from 'antd'
import { getMaterialCategory, getResource, getResourceByKeyword } from '@/services/list'

interface DefaultState {
  requestParams: IResourceParams
  curCategory: 1 | 2 | null // 1:模型 2材质
  materialCategory: Material[] // 材质下的分类
  searchKeyword: string // 搜索关键字
  resources: BaseSource[] // 资源列表
}

const defaultState: DefaultState = {
  requestParams: {
    pageNum: 1,
    pageSize: 10,
  },
  curCategory: 1, // 1:模型 2材质
  materialCategory: [], // 材质下的分类
  searchKeyword: '', // 搜索关键字
  resources: [], // 资源列表
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
    updateResources: (prevState: DefaultState, list) => (
      {
        ...prevState,
        resources: prevState.resources.concat(list),
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
        // 请求第一页数据前先清空列表数据
        if (params.pageNum === 1) {
          this.clearResources()
        }
        const res = await getResource(params)
        if (res.rows && res.rows.length > 0) {
          this.updateRequestParams(params)
          this.updateResources(res.rows)
        }
      } catch (error) {
        message.error(error?.message)
      }
    },
    async getResourceByKeyword(params: IResourceParams) {
      try {
        // 请求第一页数据前先清空列表数据
        if (params.pageNum === 1) {
          this.clearResources()
        }
        const res = await getResourceByKeyword(params)
        if (res.rows && res.rows.length > 0) {
          this.updateRequestParams(params)
          this.updateResources(res.rows)
        }
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
