/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-26 11:30:08
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-14 17:10:15
 * @FilePath: /model-material-tool/src/pages/home/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import React, { useCallback } from 'react'
import { Button } from 'antd'
import request from '@/utils/request'
// import img from '@/assets/images/favicon.png'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const getInfo = useCallback(
    async () => {
      try {
        // const data = await request('/test.json')
        // const data = await request('/test.json', {
        //   params: {
        //     a: 1,
        //     b: [1, 2, 3],
        //   },
        // })
        const data = await request('/test.json', {
          // responseType: 'blob',
        })
        console.log('data', data, typeof data);
      } catch (error) {
        console.log('error', error?.message);
      }
    },
    [],
  )

  return (
    <div>
      我是首页
      <Button onClick={getInfo}>请求</Button>
    </div>
  )
};

export default Home
