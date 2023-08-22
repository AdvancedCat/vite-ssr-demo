import Koa from 'koa';
import { createServerRouter } from './router.js';
import paths from './paths.js';
import { registerController } from './controller/index.js';

const app = new Koa();

async function startApp() {
    app.paths = paths;
    await registerController(app);
    await createServerRouter(app);

    app.on('error', (err, ctx) => {
        console.log('出错啦');

        log.error('server error', err, ctx);
    });
}

startApp().then(() => {
    app.listen(5173, () => {
        console.log('Listening at port 5173');
    });
});
