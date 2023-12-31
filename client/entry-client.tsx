import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MainRouter } from './pages/ClientRouter';

declare global {
    interface Window {
        __ssr_data__: any;
    }
}

const ssrData = window.__ssr_data__ || {};
const container = document.getElementById('root')!;
const reactNode = (
    <React.StrictMode>
        <App>
            <MainRouter></MainRouter>
        </App>
    </React.StrictMode>
);

let root;
if (ssrData.ssr) {
    ReactDOM.hydrateRoot(container, reactNode);
} else {
    root = ReactDOM.createRoot(container);
    root.render(reactNode);
}
