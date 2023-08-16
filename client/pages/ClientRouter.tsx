import { useMemo } from 'react';
import { isClient } from '../shared';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

type IRouteObject = RouteObject & { auth?: boolean };

function isLogined() {
    return isClient && localStorage.getItem('login-token');
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
    // const authedRoutes = useMemo(() => checkRouteAuth(routes), []);
    // routes 不能随意变更，如果与 SSR 中使用的 routes 不一致，就会报错。因为它是根据 route id 来复用数据的, 即 __staticRouterHydrationData
    const router = createBrowserRouter(routes /*authedRoutes*/);

    return <RouterProvider router={router} />;
}
