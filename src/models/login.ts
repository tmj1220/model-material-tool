import { message } from 'antd'
import { login } from '@/services/api'
import {
  setToken,

} from '@/utils/utils'

const defaultState = {

};

const stores = {
  state: defaultState,
  reducers: {

  },
  effects: () => ({
    async login(payload) {
      console.log('login payload', payload);
      try {
        // const { companyInfo } = rootState.common
        const { accessToken } = await login({
        })
        setToken(accessToken)

        // await Promise.all([dispatch.user.getUserInfo(), dispatch.common.getMenuList()])
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
