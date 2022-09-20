import React, { useEffect } from 'react'
import { useOutlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken } from '@/utils/utils';
import { useModelDispatchers } from '@/store';
import Header from '@/components/header'
import jsCookie from 'js-cookie'
import s from './index.less'

interface UserLayoutProps {
}

const UserLayout: React.FC<UserLayoutProps> = () => {
  const outlet = useOutlet()
  const navigate = useNavigate()
  const location = useLocation()
  const { getUserInfo } = useModelDispatchers('user');
  const { updateRequestParams } = useModelDispatchers('list')

  useEffect(() => {
    // 默认行个数
    let sizeNum: number = 4
    if (document.body.scrollWidth > 1440) {
      // 大分辨率行个数
      sizeNum = 6
    }
    // 根据窗口高度确定列个数
    const lineNum = Math.round(document.body.scrollHeight / 280)
    updateRequestParams({
      pageNum: 1,
      pageSize: sizeNum * lineNum,
    })
  })

  useEffect(
    () => {
      if (!getToken()) {
        setTimeout(() => {
          navigate('/login')
        }, 0);
      }
    },
    [location],
  )
  useEffect(() => {
    if (jsCookie.get('Admin-Token')) {
      getUserInfo()
    }
  }, [])

  return (
    <div className={s['user-layout-root']}>
      <Header />
      <div className={s['body-box']}>
        {outlet}
      </div>
    </div>
  )
};

export default UserLayout
