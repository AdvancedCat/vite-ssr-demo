import fs from 'node:fs';
import path from 'node:path';
import { performance, PerformanceObserver } from 'perf_hooks';
import express from 'express';

import paths from './paths.js';
import { createDevServerFactory } from './devServer.js';
import { isDev, isProd } from './shared/env.js'

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

let createServer = () => {
    throw new Error('createServer is empty, please specify it.');
};

const app = express();

if (isDev) {
    createServer = createDevServerFactory(app);
}

if (isProd) {
    createServer = async () => {
        const indexProd = fs.readFileSync(paths.appIndexHtml, {
            encoding: 'utf-8',
        });
        const render = (
            await import(path.resolve(paths.appDistServer, 'entry-server.js'))
        ).render;

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
    };
}

await createServer();

app.listen(5173, () => {
    console.log('Listening at port 5173');
});
