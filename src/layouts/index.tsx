import React, { useEffect } from 'react'
import { useOutlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken } from '@/utils/utils';

import Header from '@/components/header'
import s from './index.less'

interface UserLayoutProps {
}

const UserLayout: React.FC<UserLayoutProps> = () => {
  const outlet = useOutlet()
  const navigate = useNavigate()
  const location = useLocation()

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
