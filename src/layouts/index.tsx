import React from 'react'
import { useOutlet, useNavigate, NavLink } from 'react-router-dom'
import { Button } from 'antd'
import { getToken } from '@/utils/utils';
import { useModelDispatchers } from '@/store';
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
      <div className={s['head-box']}>
        我是userLayout

        <Button onClick={() => {
          logout().finally(() => {
            navigate('/login')
          })
        }}
        >
          退出登录
        </Button>

      </div>
      <div className={s['body-box']}>
        <div className={s.menu}>
          <NavLink to="/test">test list</NavLink>
          <NavLink to="/test/234">test detail</NavLink>
        </div>

        {outlet}
      </div>
      {/* <div className={s.menu}>
            <MenuList />
          </div>
          <div className={s.rightBox}>
            <div className={s.headeBox}>
              <Header />
            </div>
            <div className={s.content}> */}
      {/* {outlet} */}

      {/* </div>
          </div> */}

    </div>
  )
};

export default UserLayout
