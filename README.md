# model-material-tool

设计 三维模型材质 管理工具

## 技术栈

react@18+react-router+dom@6++webapck@5+typescript@4.6+antd@4.2+less@4.1+webpack-dev-server@4.9+...

stylelint、eslint、prettier、commitlint、husky...

## 命令：

"start": 开发
"build": 打包
"analyz": 打包分析
"lint": 规范校验
"commit": 规范 git commit

跳过 husky 检查 直接提交：
git commit --no-verify -m "xxx"

## 路由：

修改路由目录：src/config/route.tsx

/\*\*

- 路由配置规则：
- 四种基础路由：
- page: 页面级路由 只包含页面。 index:false, 有: element、path ,没有: children
- menu: 模块路由 不包含页面 但是拥有子路由。 index:false，有: path、children, 没有：element
- index：同级优先路由 index:true, 有:element, 没有：children、path(出现路径是父级路由的 path)
- layout: 布局路由 index:false 有 path、element、children
- routeList：由以上四种路由 组合的树形列表
  \*/

## 请求工具：

业务请求 使用 src/utils/request.ts
非业务请求 直接使用 axios
