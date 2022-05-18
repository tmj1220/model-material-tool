import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import { ConfigProvider } from 'antd';
import { getLanguage } from '@/utils/utils';
import LocaleProvider, { getLocale } from './locales/LocaleProvider';
import store from './store'
import App from './app'

const lang = getLanguage() || 'zh-CN'
const appLocale = getLocale(lang)
const rootName = `${process.env.ROOT_NAME}`

// // 传递给子应用主色
// starkStore.set('theme', {
//   primaryColor: '#194BFB',
// });
// // 设置主色
// ConfigProvider.config({
//   prefixCls: 'industry-common',
//   theme: {
//     primaryColor: '#194BFB',
//   },
// });

const root = createRoot(document.getElementById(rootName))
root.render(
  <LocaleProvider
    locale={{
      locale: lang,
      messages: {
        ...appLocale.locale,
      },
    }}
  >
    <IntlProvider locale={lang} messages={appLocale.locale}>
      <ConfigProvider locale={appLocale.antLocal}>
        <store.Provider>
          <App />
        </store.Provider>
      </ConfigProvider>
    </IntlProvider>
  </LocaleProvider>,
)
