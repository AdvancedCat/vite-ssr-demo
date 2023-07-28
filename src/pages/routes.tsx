/**
 * 这里仅维护一级路由的页面
 * 页面的子页面则由宿主页面来确定路由，如果子页面提升为一级页面了，则同步提升到这个路由文件中
 */

import { useMemo } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import Home from './Home';
import LiginPage from './Login';
import Editor from './Editor'
import Springs, { SpringsRoutes } from './Springs';

type IRouteObject = RouteObject & { auth?: boolean };

// 这里是完整的路由
const routes: Array<IRouteObject> = [
    {
        path: '/',
        element: <Home />,
        errorElement: <div>404</div>
    },
    {
        path: '/404',
        element: <div>404</div>,
    },
    {
        path: '/login',
        element: <LiginPage></LiginPage>,
    },
    {
        path: '/springs',
        element: <Springs />,
        children: SpringsRoutes,
        auth: true,
    },
    {
        path: '/editor',
        element: <Editor></Editor>
    }
];

function isLogined() {
    return localStorage.getItem('login-token');
}

/**
 * 路由守卫，这里只是将未授权的页面过滤掉，不够严谨
 * 更好的方案是统一给页面 Page 组件套一个 @Controller ，统一在里面判断路由权限，还可以根据用户角色来控制路由
 * @param xRoutes 
 * @returns 
 */
function checkRouteAuth(xRoutes: IRouteObject[] = []) {
    return xRoutes.filter((route) => {
        if (route.auth) {
            return isLogined();
        }

        if (route.children && route.children.length > 0) {
            route.children = checkRouteAuth(route.children);
        }

        return true;
    });
}

export function MainRouter() {
    const authedRoutes = useMemo(() => checkRouteAuth(routes), []);
    const router = createBrowserRouter(authedRoutes);

    return <RouterProvider router={router} />;
}
