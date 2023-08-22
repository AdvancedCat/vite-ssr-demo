import fs from 'node:fs';
import path from 'node:path';

import Base from './Base.js';

export default class Scene extends Base {
    async init() {
        this.indexHtml = fs.readFileSync(this.app.paths.appIndexHtml, {
            encoding: 'utf-8',
        });
        this.render = (
            await import(
                path.resolve(this.app.paths.appDistServer, 'entry-server.js')
            )
        ).render;

        return this;
    }

    async main(ctx, next) {
        const { request: req, response: res } = ctx;
        // ctx.router available
        if (req.query?.csr) {
            res.type = 'text/html';
            res.body = this.indexHtml;
            return;
        }

        try {
            // TODO: 这里应该加入预获取数据的流程，比如 data = await fetchData()，从而传入到组件 ssr
            const appHtml = await this.render(req /* data */);
            const html = this.indexHtml
                .replace(`<!--ssr-html-outlet-->`, appHtml)
                .replace(
                    '<!--ssr-data-outlet-->',
                    `<script>window.__ssr_data__=${JSON.stringify({
                        ssr: true,
                    })}</script>`
                );

            res.type = 'text/html';
            res.body = html;
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}
