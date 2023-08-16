import { fileURLToPath } from 'node:url';
import path from 'node:path'

const cwd = process.cwd() 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveApp = (p) => path.resolve(cwd, p)

export default {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appDist: resolveApp('./dist'),
    appClient: resolveApp('./dist/client'),
    appIndexHtml: resolveApp('./dist/client/index.html'),
    appServer: resolveApp('./dist/server'),
    appPackageJson: resolveApp('./package.json'),
    appSrc: resolveApp('./src')
}