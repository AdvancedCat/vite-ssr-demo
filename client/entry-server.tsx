import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App.js';
import { MainRouter } from './pages/ServerRouter.js';
import { createStaticHandler } from 'react-router-dom/server';
import { routes } from './pages/routes.js';
import type { Request } from 'express';

export async function render(req: Request) {
    // Step 1. 构造一个 Request 对象，里面含义完整的url路径，以及 headers 等参数，传入到 routes 中进行路由匹配，如获取 params 等、触发 loader
    const fetchRequest = createFetchRequest(req);
    // Step 2. 调用 createStaticHandler 返回参数
    const { dataRoutes, query } = createStaticHandler(routes);
    // Step 3. context 中包含了根据 url 匹配后的上下文，{ location, loaderData, loaderHeaders, matches, statusCode }
    // 若路由不匹配，则 statusCode 返回 404
    // query 的目的是匹配路由，触发loader/action，从而为后面直出提供数据
    const context = await query(fetchRequest, {
        requestContext: { name: 'hongxin' }, // loader({ context })
    });

    return ReactDOMServer.renderToString(
        <React.StrictMode>
            <App>
                <MainRouter
                    dataRoutes={dataRoutes}
                    context={context}
                ></MainRouter>
            </App>
        </React.StrictMode>
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
