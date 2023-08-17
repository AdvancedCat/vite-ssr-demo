import {
    createStaticRouter,
    StaticRouterProvider,
} from 'react-router-dom/server';

export function MainRouter({ dataRoutes, context }: any) {
    // console.log('context', context);

    let router = createStaticRouter(dataRoutes, context);

    return <StaticRouterProvider router={router} context={context}/>;
}
