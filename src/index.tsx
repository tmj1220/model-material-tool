/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-16 11:33:11
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-25 14:27:29
 * @FilePath: /model-material-tool/src/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import { createRoot } from 'react-dom/client'
import { ConfigProvider, message, notification } from 'antd';
import { getLanguage } from '@/utils/utils';
import antdCN from 'antd/es/locale/zh_CN';
import antdEN from 'antd/es/locale/en_US';

import store from './store'
import App from './app'

const lang = getLanguage() || 'zh-CN'

const rootName = `${process.env.ROOT_NAME}`

message.config({
  maxCount: 1,
});
notification.config({
  maxCount: 1,
});
const root = createRoot(document.getElementById(rootName))
root.render(
  <ConfigProvider locale={lang === 'zh-CN' ? antdCN : antdEN}>
    <store.Provider>
      <App />
    </store.Provider>
  </ConfigProvider>,
)
