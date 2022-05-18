import React from 'react'
import { useOutlet } from 'react-router-dom'
import s from './login-layout.less'

interface LoginLayoutProps {}

const LoginLayout: React.FC<LoginLayoutProps> = () => {
  const outlet = useOutlet()
  return <div className={s['login-layout-root']}>{outlet}</div>
};

export default LoginLayout
