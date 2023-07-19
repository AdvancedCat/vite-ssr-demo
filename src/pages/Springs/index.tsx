import { Suspense, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
// import Deck from './scene/Deck';
import {AppConfigContext} from '../../contexts/AppConfigProvider'

export default function Springs() {

    const appConfig = useContext(AppConfigContext)

    console.log(appConfig.siteName)

    return (
        <div style={{ height: '100%' }}>
            <Suspense fallback={<div>loading...</div>}>
                <Outlet></Outlet>
            </Suspense>
        </div>
    );
}

// 子页面路由
export const SpringsRoutes = [
    {
        index: true,
        element: (
            <div>
                <Link to="deck">Deck</Link>
            </div>
        ),
    },
    {
        path: 'deck',
        async lazy() {
            let { default: Deck } = await import('./scene/Deck');
            return { element: <Deck /> };
        },
    },
];
