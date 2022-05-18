import { message } from 'antd'
import { setToken, removeToken, getParameterByName } from '@/utils/utils'

interface UserInfo {
  name: string
  avtar?: string
  token: string
}

const loginService = () => new Promise<UserInfo>((res, rej) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      res({
        name: '张三',
        // menuList: [
        //   {
        //     title: '测试页面1',
        //     key: 'test1',
        //     path: '/test1',
        //   },
        // ],
        token: '3234kfjas;lkfjlkasjflkdasjklf',
      })
    } else {
      rej(new Error('账号或密码错误'))
    }
  }, 1000);
})
const defaultState = {

};

const stores = {
  state: defaultState,
  reducers: {

  },
  effects: (dispatch) => ({
    async login(...data) {
      console.log('loa', data);
      try {
        const { token } = await loginService()
        setToken(token)
        await Promise.all([dispatch.user.getUserInfo(), dispatch.common.getMenuList()])
        window.location.href = getParameterByName('redirect') || '/'
      } catch (error) {
        message.error(error?.message)
      }
    },
    async logout() {
      removeToken()
      dispatch.user.reset()
      dispatch.common.reset()
    },
    async redirectLogin() {
      this.logout()
      const currentUrl = window.location.pathname + window.location.search;
      let redirectUrl = encodeURIComponent(currentUrl);
      const companyCode = '';
      // 已经是登录页面
      if (getParameterByName('redirect')) {
        redirectUrl = getParameterByName('redirect');
      }
      console.log('redirectUrl', redirectUrl);
      // // 企业号
      // if (getCompanyCode()) {
      //   companyCode = `&code=${getCompanyCode()}`
      // }
      if (window.location.pathname === '/login') {
        window.location.reload();
      } else if (redirectUrl === '%2Fempty') { // 如果是从/empty跳登录  就不加重定向
        window.location.href = `/login?${companyCode}`;
      } else {
        window.location.href = `/login?redirect=${redirectUrl}${companyCode}`;
      }
    },
  }),
}
export default stores;
