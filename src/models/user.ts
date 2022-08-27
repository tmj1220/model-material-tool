import { getUserInfoService } from '@/services/api';
import { message } from 'antd';

interface UserInfo {
  name: string
  avtar?: string
  token: string
}
const defaultState: UserInfo = {
  name: '',
  avtar: '',
  token: '',
};

const stores = {
  state: defaultState,
  reducers: {
    reset() {
      return defaultState
    },
  },
  effects: () => ({
    async getUserInfo() {
      try {
        const name = await getUserInfoService()
        this.setState({ name })
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
