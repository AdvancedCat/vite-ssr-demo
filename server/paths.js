import { fileURLToPath } from 'node:url';
import path from 'node:path'

const cwd = process.cwd() 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveApp = (p) => path.resolve(cwd, p)

export default {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appDist: resolveApp('./dist'),
    appDistClient: resolveApp('./dist/client'),
    appIndexHtml: resolveApp('./dist/client/index.html'),
    appDistServer: resolveApp('./dist/server'),
    appPackageJson: resolveApp('./package.json'),
    appClient: resolveApp('./client'),
    appServer: resolveApp('./server'),
    appPublic: resolveApp('public')
}