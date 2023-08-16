import type { PropsWithChildren } from 'react';
import AppProvider from './contexts/AppProvider';
import './index.css'

function App({ children }: PropsWithChildren) {
    return (
        <div style={{ height: '100%' }}>
            <AppProvider >{children}</AppProvider>
        </div>
    );
}

export default App;
