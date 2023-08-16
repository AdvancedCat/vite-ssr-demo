import ReactDOMServer from 'react-dom/server';
import App from './App.js';
import { MainRouter } from './pages/ServerRouter.js';
import { createStaticHandler } from 'react-router-dom/server';
import { routes } from './pages/routes.js';
import type { Request } from 'express';

export async function render(req: Request) {
    const fetchRequest = createFetchRequest(req);
    const handler = createStaticHandler(routes);
    const context = await handler.query(fetchRequest);

    return ReactDOMServer.renderToString(
        <App>
            <MainRouter handler={handler} context={context}></MainRouter>
        </App>
    );
}

function createFetchRequest(req: Request) {
    let origin = `${req.protocol}://${req.get('host')}`;
    // Note: This had to take originalUrl into account for presumably vite's proxying
    let url = new URL(req.originalUrl || req.url, origin);

    let controller = new AbortController();
    req.on('close', () => controller.abort());

    let headers = new Headers();

    for (let [key, values] of Object.entries(req.headers)) {
        if (values) {
            if (Array.isArray(values)) {
                for (let value of values) {
                    headers.append(key, value);
                }
            } else {
                headers.set(key, values);
            }
        }
    }

    let init = {
        method: req.method,
        headers,
        signal: controller.signal,
        body: null,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = req.body;
    }

    return new Request(url.href, init);
}
