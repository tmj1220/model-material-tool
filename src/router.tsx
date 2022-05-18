import React from 'react';
import {
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom';
import Exception404 from '@/pages/exception404';
import routeList from '@/config/route';
import type{ RouteItem } from './config/route';

const renderRoute = (list):React.ReactElement[] => {
  const routes = list.map(({
    children, path, key, element, index,
  }: RouteItem) => {
    const isLayout = !path
    const isIndex = !!index
    const hasChildren = !!children && !!children.length
    const hasElement = !!element
    try {
      if (!hasChildren && !hasElement) {
        throw new Error('路由配置children、element，至少包含一个')
      }

      if (hasElement && !hasChildren) {
        if (isIndex) {
          return <Route key={key} index element={element} />
        }
        return <Route key={key} path={path} element={element} />
      }
      if (!hasElement && hasChildren) {
        return (
          <Route key={key} path={path}>
            {renderRoute(children)}
          </Route>
        )
      }
      if (isLayout) {
        return (
          <Route key={key} element={element}>
            {renderRoute(children)}
          </Route>
        )
      }
      return (
        <Route key={key} path={path} element={element}>
          {renderRoute(children)}
        </Route>
      )
    } catch (error) {
      console.error(error?.message);
      return <React.Fragment key={`error-route=${key}`} />
    }
  })
  return routes
}

interface RouterConfigProps { }

const RouterConfig: React.FC<RouterConfigProps> = () => {
  const data = renderRoute(routeList)
  return (
    <Router>
      <Routes>
        {data}
        <Route path="*" element={<Exception404 />} />
      </Routes>
    </Router>
  )
}
export default RouterConfig;
