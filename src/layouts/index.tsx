import React, { useEffect } from 'react'
import { useOutlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken } from '@/utils/utils';
import { useModelState, useModelDispatchers } from '@/store';
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
  const { requestParams, defaultRequestParams } = useModelState('list')
  const { updateRequestParams } = useModelDispatchers('list')

  useEffect(() => {
    if (document.body.scrollWidth > 1440) {
      /** 大分辨率增大页码，避免无法滚动 */
      updateRequestParams({
        ...requestParams,
        pageSize: defaultRequestParams.pageSize * 2,
      })
    }
  }, [])

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
