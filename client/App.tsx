import type { PropsWithChildren } from 'react';
import AppProvider from './contexts/AppProvider';
import './index.css';

function App({ children }: PropsWithChildren) {
    return <AppProvider>{children}</AppProvider>;
}

export default App;
