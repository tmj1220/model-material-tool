import { message } from 'antd'
import { getMaterialCategory, getResource } from '@/services/list'

interface DefaultState {
  requestParams: IResourceParams
  curCategory: 1 | 2 | null // 1:模型 2材质
  materialCategory: any[] // 材质下的分类
  searchKeyword: string // 搜索关键字
  resources: any[] // 资源列表
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
    updateResources: (prevState: DefaultState, list) => ({ ...prevState, resources: list }),
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
        const res = await getResource(params)
        if (res.rows && res.rows.length > 0) {
          this.updateResources(res.rows)
          this.updateRequestParams(params)
        }
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
