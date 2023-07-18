


## 项目结构

目前仅假设是前端CSR应用，若考虑扩展至 SSR，则需要将 src 文件夹进一步拆分为 client / server 两部分。

- components

可复用的组件库，如 Modal Taost 等

- contexts

React Context 集合，也包括 Provider 组件，可以将多个 Provider 合并为一个大的 Provider

- hooks

React Hooks 集合，自定义的业务 hook 等。

- layouts

页面布局集合，根据不同路由使用不同的布局。

- pages

页面集合，子页面放在附属的一级页面文件夹下面。
页面内自身使用的组件或工具，则放置在页面文件夹中。

- services

服务类，比如异步请求、数据预处理等。

- shared

公用的工具类


## 第三方依赖

### 运行时

- react-router-dom 前端路由库
- @use-gesture/react  React 手势库
- @react-spring/web  动画库
- immer : 不可变数据
- ahooks : React Hook 集合
- clsx : classnames 的替代

### 开发时

- typescript 类型校验
- vite 构建工具