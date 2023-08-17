import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div style={{ height: '100%' }}>
            <Outlet></Outlet>
        </div>
    );
}
