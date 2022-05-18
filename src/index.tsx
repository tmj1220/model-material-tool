import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd';
import { getLanguage } from '@/utils/utils';
import antdCN from 'antd/es/locale/zh_CN';
import antdEN from 'antd/es/locale/en_US';

import store from './store'
import App from './app'

const lang = getLanguage() || 'zh-CN'

const rootName = `${process.env.ROOT_NAME}`

// // 传递给子应用主色
// starkStore.set('theme', {
//   primaryColor: '#194BFB',
// });
// // 设置主色
// ConfigProvider.config({
//   // prefixCls: 'industry-common',
//   theme: {
//     primaryColor: 'red',
//   },
// });

const root = createRoot(document.getElementById(rootName))
root.render(
  <ConfigProvider locale={lang === 'zh-CN' ? antdCN : antdEN}>
    <store.Provider>
      <App />
    </store.Provider>
  </ConfigProvider>,
)
