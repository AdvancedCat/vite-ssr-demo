import { createContext } from 'react';
import type { PropsWithChildren } from 'react';

const appConfig = {
    siteName: 'spring-demo'
};

export const AppConfigContext = createContext(appConfig);

export default function AppConfigProvider({ children }: PropsWithChildren) {
    return (
        <AppConfigContext.Provider value={appConfig}>
            {children}
        </AppConfigContext.Provider>
    );
}
