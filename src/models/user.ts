import { message } from 'antd';

interface UserInfo {
  name: string
  avtar?: string
  token: string
}
const getUserInfoService = () => new Promise<UserInfo>((res) => {
  setTimeout(() => {
    res({
      name: '张三',
      token: '3234kfjas;lkfjlkasjflkdasjklf',
    })
  }, 1000);
})

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
        const info = await getUserInfoService()
        this.setState(info)
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
