import { message } from 'antd'

const getMenuListService = () => new Promise<any[]>((res) => {
  setTimeout(() => {
    res([
      {
        title: '测试页面1',
        key: 'test1',
        path: '/test1',
      },
    ])
  }, 1000);
})

const defaultState = {
  menuList: [],
};

const stores = {
  state: defaultState,
  reducers: {
    reset() {
      return defaultState
    },
  },
  effects: () => ({
    async getMenuList() {
      try {
        const menuList = await getMenuListService()
        this.setState({ menuList })
      } catch (error) {
        message.error(error?.message)
      }
    },
  }),
}
export default stores;
