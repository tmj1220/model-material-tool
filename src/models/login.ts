import { message } from 'antd'
import { login } from '@/services/api'
import {
  getParameterByName,
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
        const accessToken = await login(payload.data);
        if (accessToken) {
          setToken(accessToken);
          payload.navigate(getParameterByName('redirect') || '/');
        }
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
