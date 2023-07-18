/**
 * 这里仅维护一级路由的页面
 * 页面的子页面则由宿主页面来确定路由，如果子页面提升为一级页面了，则同步提升到这个路由文件中
 */

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Home from './Home';
import Springs, { SpringsRoutes } from './Springs';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/springs',
        element: <Springs />,
        children: SpringsRoutes,
    },
]);

export function MainRouter() {
    return <RouterProvider router={router}></RouterProvider>;
}
