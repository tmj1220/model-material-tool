import React, { useEffect } from 'react'
import { Tabs, Input, Button } from 'antd'
import searchSvg from '@/assets/images/icons/search.svg'

import logo from '@/assets/images/icons/logo.svg'
import { menuOptions } from './constant'

import s from './index.less'

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  useEffect(() => {}, [])
  return (
    <div className={s['header-root']}>
      <div className={s['left-box']}>
        <h1 className={s['logo-box']}>
          <img src={logo} alt="" />
          Logo
        </h1>
        <div className={s['menu-box']}>
          <Tabs>
            {menuOptions.map(({ key, title }) => <Tabs.TabPane key={key} tab={title} />)}
          </Tabs>
        </div>
      </div>
      <div className={s['right-box']}>
        <div className={s['input-box']}>
          <Input placeholder="搜索" prefix={<img src={searchSvg} style={{ width: '24px', height: '24px' }} alt="search" />} allowClear className={s.input} />
          <Button type="primary" style={{ width: '80px' }}>上传</Button>
        </div>
        <div className={s['user-info-box']}>
          <div className={s.avtar}>
            A
          </div>
          Annndy
        </div>
      </div>
    </div>
  )
};

export default Header
