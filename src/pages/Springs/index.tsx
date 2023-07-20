import { Suspense, useContext, lazy } from 'react';
import { Outlet, Link } from 'react-router-dom';
// import Deck from './scene/Deck';
import { AppConfigContext } from '../../contexts/AppConfigProvider';

export default function Springs() {
    const appConfig = useContext(AppConfigContext);

    console.log(appConfig.siteName);

    return (
        <div style={{ height: '100%' }}>
            <Outlet></Outlet>
        </div>
    );
}

function LazyElement() {
    const Comp = lazy(() => import(`./scene/Deck`));
    return (
        <Suspense fallback="Loading...">
            <Comp />
        </Suspense>
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
        element: <LazyElement />,
    },
];
