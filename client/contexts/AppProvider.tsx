import React from 'react'
import AppConfigProvider from './AppConfigProvider';

export default function AppProvider({children}: React.PropsWithChildren) {
    return (
        <AppConfigProvider>
            {children}
        </AppConfigProvider>
    );
}
