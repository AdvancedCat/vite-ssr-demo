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

const allSprings = import.meta.glob<{ default: ComponentType<any>; }>('./scene/*/index.tsx')

const springsRoutes = [
    {
        path: 'deck',
    },
];

function LazyElement({ name }: { name: string }) {
    const Comp = lazy(allSprings[`./scene/${name}/index.tsx`])
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
                    return <Link to="deck" key={routeCfg.path}>{routeCfg.path.toUpperCase()}</Link>;
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
