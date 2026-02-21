import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    // Only allow access if the user is logged in AND is an admin
    return userInfo && userInfo.isAdmin ? (
        <Outlet />
    ) : (
        <Navigate to='/login' replace />
    );
};

export default AdminRoute;
