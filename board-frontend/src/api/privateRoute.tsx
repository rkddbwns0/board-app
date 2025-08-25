import { Navigate } from 'react-router-dom';
import { useAuth } from './authProvider.tsx';
import { JSX } from 'react';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>loading...</div>;
    if (!user) return <Navigate to="/" />;
    return children;
};

export default PrivateRoute;
