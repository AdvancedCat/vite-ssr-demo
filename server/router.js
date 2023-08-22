import Router from '@koa/router';
import koaConnect from 'koa-connect';

import paths from './paths.js';
import { createDevServerRouter } from './devServer/index.js';
import { isDev, isProd } from './shared/env.js';

export const router = new Router();

// api 路由

export async function createServerRouter(app) {
    if (isDev) {
        await createDevServerRouter(app, router);
    }

    if (isProd) {
        await registerProdMiddleware(app);

        // 页面渲染路由
        router.get(/\/*/, app.controller.scene.main.bind(app.controller.scene));
    }

    app.use(router.routes()).use(router.allowedMethods());

    app.use((ctx) => {
        console.log('触发兜底中间件');
        const { response } = ctx;
        response.status = 500;
        response.body = '<div>出错啦</div>';
    });
}

async function registerProdMiddleware(app) {
    app.use(koaConnect((await import('compression')).default()));
    app.use(
        (await import('koa-static')).default(paths.appDistClient, {
            index: false,
        })
    );
}
