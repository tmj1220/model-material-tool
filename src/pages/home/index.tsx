import React, { useCallback } from 'react'
import { Button } from 'antd'
import request from '@/utils/request'
import img from '@/assets/images/favicon.png'
import s from './index.less'

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
    <div className={s['home-root']}>
      我是首页
      <img src={img} alt="23" />
      <Button onClick={getInfo}>请求</Button>
    </div>
  )
};

export default Home
