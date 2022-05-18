import React from 'react'
import { useOutlet, useNavigate } from 'react-router-dom'
import { getToken } from '@/utils/utils';
import { useModelDispatchers } from '@/store';

import Header from '@/components/header'
import s from './index.less'

interface UserLayoutProps {
}

const UserLayout: React.FC<UserLayoutProps> = () => {
  const outlet = useOutlet()
  const navigate = useNavigate()
  const { logout } = useModelDispatchers('login')
  // console.log('getToken', getToken());

  if (!getToken()) {
    logout().finally(() => {
      navigate('/login')
    })
  }
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
