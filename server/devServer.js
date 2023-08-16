import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import paths from './paths.js';

export async function createDevServer() {
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
        let template = fs.readFileSync(
            path.resolve(paths.appPath, 'index.html'),
            'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);

        if (req.query?.csr) {
            res.status(200)
                .set({ 'Content-Type': 'text/html' })
                .end(template);
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
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    app.listen(5173, () => {
        console.log('Listening at port 5173');
    });
}
