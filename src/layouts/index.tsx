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

  // console.log('getToken', getToken());
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
