import { Outlet } from 'react-router-dom';
import Deck from './scene/Deck';

export default function Springs() {
    return (
        <div style={{height: '100%'}}>
            <Outlet></Outlet>
        </div>
    );
}

// 子页面路由
export const SpringsRoutes = [
    {
        path: 'deck',
        element: <Deck />,
    },
];
