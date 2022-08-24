import { message } from 'antd'
import { getMaterialCategory } from '@/services/list'

const defaultState = {

};

const stores = {
  state: defaultState,
  reducers: {

  },
  effects: () => ({
    async getMaterialCategory() {
      try {
        // const { companyInfo } = rootState.common
        const res = await getMaterialCategory()
        console.log(res)
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
