import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

let createServer = async () => {
    throw new Error('createServer is empty, please specify it.');
};

if (isProd) {
    createServer = async () => {
        const resolve = (p) => path.resolve(__dirname, p);
        const indexProd = fs.readFileSync(resolve('../dist/client/index.html'),{encoding: 'utf-8'});
        const app = express();
        app.use((await import('compression')).default());
        app.use(
            (await import('serve-static')).default(resolve('../dist/client'), {
                index: false,
            })
        );

        app.use('*', async (req, res, next) => {
            try {
                const template = indexProd;
                // @ts-ignore
                const render = (await import(resolve('../dist/server/entry-server.js'))).render;

                const appHtml = await render(req);
                const html = template
                    .replace(`<!--ssr-outlet-->`, appHtml)
                    .replace(
                        '<!--ssr-data-outlet-->',
                        `<script>window.__ssr_data__=${JSON.stringify({
                            ssr: true,
                        })}</script>`
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
                    '/src/entry-server.tsx'
                );
                const appHtml = await render(req);
                const html = template
                    .replace(`<!--ssr-outlet-->`, appHtml)
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
