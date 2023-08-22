import fs from 'node:fs';
import path from 'node:path';
import koaConnect from 'koa-connect';
import paths from '../paths.js';

function sleep(){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 2000);
    })
}

export async function createDevServerRouter(app, router) {
    const vite = await import('vite').then(async (module) => {
        return await module.createServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });
    });

    app.use(koaConnect(vite.middlewares));

    router.use('/editor', async (ctx, next) => {
        console.log('fuck me 1');
        // await sleep()
        await next();
        console.log('fuck me 3');
    });

    router.get(/\/*/, async (ctx, next) => {
        console.log('fuck me ');
        const { request: req, response: res } = ctx;
        const url = req.originalUrl;
        let template = fs.readFileSync(
            path.resolve(paths.appPath, 'index.html'),
            'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);

        if (req.query?.csr) {
            ctx.type = 'text/html';
            ctx.body = template;
            return;
        }

        try {
            const { render } = await vite.ssrLoadModule(
                path.resolve(paths.appClient, 'entry-server.tsx')
            );

            const appHtml = await render(req);
            const html = template
                .replace(`<!--ssr-html-outlet-->`, appHtml)
                .replace(
                    '<!--ssr-data-outlet-->',
                    `<script>window.__ssr_data__=${JSON.stringify({
                        ssr: true,
                    })}</script>`
                );
            ctx.type = 'text/html';
            ctx.body = html;
        } catch (e) {
            vite.ssrFixStacktrace(e);
            console.log(e.stack);
            ctx.throw(500, e.stack);
        }
    });
}
