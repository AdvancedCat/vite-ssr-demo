/**
 * 这里仅维护一级路由的页面
 * 页面的子页面则由宿主页面来确定路由，如果子页面提升为一级页面了，则同步提升到这个路由文件中
 */

import type { RouteObject } from 'react-router-dom';

import Home from './Home';
import LoginPage from './Login';
import { route as EditorRoute } from './Editor';
import Springs, { SpringsRoutes } from './Springs';

type IRouteObject = RouteObject & { auth?: boolean };

// 这里是完整的路由
export const routes: Array<IRouteObject> = [
    {
        path: '/',
        element: <Home />,
        errorElement: <div>404</div>,
    },
    {
        path: '/404',
        element: <div>404</div>,
    },
    {
        path: '/login',
        element: <LoginPage></LoginPage>,
    },
    {
        path: '/springs',
        element: <Springs />,
        children: SpringsRoutes,
        auth: true,
    },
    EditorRoute,
];
