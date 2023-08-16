import {
    createStaticRouter,
    StaticRouterProvider,
} from 'react-router-dom/server';

export function MainRouter({ handler, context }: any) {
    let router = createStaticRouter(handler.dataRoutes, context);

    return <StaticRouterProvider router={router} context={context} />;
}

