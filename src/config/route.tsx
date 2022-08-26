import React, { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from '@/pages/loading'

// 静态路由
import Layout from '@/layouts/index'
import LoginLayout from '@/layouts/login-layout'
import Login from '@/pages/login'

const lazy = (path) => {
  const Comp = React.lazy(() => import(`@/pages${path}`))
  return (
    <Suspense fallback={<Loading />}>
      <Comp />
    </Suspense>
  )
}

// 动态路由
const list = lazy('/list')
const addmodel = lazy('/addmodel')
export interface RouteItem {
    type:'page'|'menu'|'index'|'layout'
    key:string
    path?:string
    index?:boolean
    element?:React.ReactNode
    children?:RouteItem[]
}

/**
 * 路由配置规则：
 *  四种基础路由：
 *    page: 页面级路由 只包含页面。  index:false, 有: element、path ,没有: children
 *    menu: 模块路由 不包含页面 但是拥有子路由。 index:false，有: path、children, 没有：element
 *    index：同级优先路由 index:true, 有:element, 没有：children、path(出现路径是父级路由的path)
 *    layout: 布局路由 index:false 有path、element、children
 * routeList：由以上四种路由 组合的树形列表
 */

const routeList:RouteItem[] = [
  {
    type: 'layout',
    path: '/',
    key: '/',
    element: <Layout />,
    children: [
      {
        type: 'page',
        path: 'loading',
        key: '/loading',
        element: <Loading />,
      },
      {
        type: 'page',
        path: 'list',
        key: '/list',
        element: list,
      },
      {
        type: 'page',
        path: 'addmodel',
        key: '/addmodel',
        element: addmodel,
      },
      {
        type: 'page',
        path: '',
        key: '/',
        element: <Navigate to="list" />,
      },
    ],
  },
  {
    type: 'layout',
    path: '/login',
    key: 'unlogin',
    element: <LoginLayout />,
    children: [
      {
        type: 'index',
        // path:'/',
        key: '/login',
        index: true,
        element: <Login />,
      },
    ],
  },
]

export default routeList
