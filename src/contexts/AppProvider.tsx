import { MainRouter } from '../pages/routes';
import AppConfigProvider from './AppConfigProvider';

export default function AppProvider() {
    return (
        <AppConfigProvider>
            <MainRouter></MainRouter>
        </AppConfigProvider>
    );
}
