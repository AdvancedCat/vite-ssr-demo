import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance, PerformanceObserver } from 'perf_hooks';
import express from 'express';

import paths from './paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// 初始化监听器逻辑，用于性能监控
const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        console.log(
            '[performance]',
            entry.name,
            entry.duration.toFixed(2),
            'ms'
        );
    });
    performance.clearMarks();
});
perfObserver.observe({ entryTypes: ['measure'] });

let createServer = async () => {
    throw new Error('createServer is empty, please specify it.');
};

if (isProd) {
    createServer = async () => {
        const indexProd = fs.readFileSync(paths.appIndexHtml, {
            encoding: 'utf-8',
        });
        const render = (
            await import(path.resolve(paths.appDistServer, 'entry-server.js'))
        ).render;

        const app = express();
        app.use((await import('compression')).default());
        app.use(
            (await import('serve-static')).default(paths.appDistClient, {
                index: false,
            })
        );

        app.use('*', async (req, res, next) => {
            if (req.query?.csr) {
                res.status(200)
                    .set({ 'Content-Type': 'text/html' })
                    .end(indexProd);
                return;
            }

            try {
                performance.mark('render-start');
                // TODO: 这里应该加入预获取数据的流程，比如 data = await fetchData()，从而传入到组件 ssr
                const appHtml = await render(req /* data */);
                const html = indexProd
                    .replace(`<!--ssr-outlet-->`, appHtml)
                    .replace(
                        '<!--ssr-data-outlet-->',
                        `<script>window.__ssr_data__=${JSON.stringify({
                            ssr: true,
                        })}</script>`
                    );
                performance.mark('render-end');
                performance.measure(
                    'renderToString',
                    'render-start',
                    'render-end'
                );
                res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            } catch (error) {
                console.error(error);
                next(error);
            }
        });

        app.listen(5173, () => {
            console.log('Listening at port 5173');
        });
    };
}

if (isDev) {
    createServer = async function () {
        const app = express();
        const vite = await import('vite').then(async (module) => {
            return await module.createServer({
                server: { middlewareMode: true },
                appType: 'custom',
            });
        });

        app.use(vite.middlewares);
        app.use('*', async (req, res, next) => {
            const url = req.originalUrl;
            try {
                let template = fs.readFileSync(
                    path.resolve(__dirname, '../index.html'),
                    'utf-8'
                );

                template = await vite.transformIndexHtml(url, template);
                const { render } = await vite.ssrLoadModule(
                    path.resolve(paths.appClient, 'entry-server.tsx')
                );
                const mod = await vite.moduleGraph.getModuleByUrl(
                    path.resolve(paths.appClient, 'entry-client.tsx')
                ); /* replace with your entry */
                // const cssUrls = mod.ssrTransformResult.deps.filter((d) =>
                //     d.endsWith('.css')
                // );
                console.log('cssUrls', mod);

                const appHtml = await render(req);
                const html = template
                    .replace(`<!--ssr-html-outlet-->`, appHtml)
                    .replace(
                        '<!--ssr-data-outlet-->',
                        `<script>window.__ssr_data__=${JSON.stringify({
                            ssr: true,
                        })}</script>`
                    );
                res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            } catch (e) {
                vite.ssrFixStacktrace(e);
                next(e);
            }
        });

        app.listen(5173, () => {
            console.log('Listening at port 5173');
        });
    };
}

createServer();
