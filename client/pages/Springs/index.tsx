import { Suspense, useContext, lazy, ComponentType } from 'react';
import { Outlet, Link } from 'react-router-dom';
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

const allSprings = import.meta.glob<{ default: ComponentType<any> }>(
    './scene/*/index.tsx',
    { eager: true }
);

const springsRoutes = [
    {
        path: 'deck',
    },
    {
        path: 'slide',
    },
];

function LazyElement({ name }: { name: string }) {
    const Comp = allSprings[`./scene/${name}/index.tsx`].default;
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
                {springsRoutes.map((routeCfg) => {
                    return (
                        <div key={routeCfg.path}>
                            <Link to={routeCfg.path}>
                                {routeCfg.path.toUpperCase()}
                            </Link>
                        </div>
                    );
                })}
            </div>
        ),
    },
    ...springsRoutes.map((routeCfg) => {
        return {
            path: routeCfg.path,
            element: <LazyElement name={routeCfg.path} />,
        };
    }),
];
