import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    // Only allow access if the user is logged in AND is an admin
    return userInfo && userInfo.isAdmin ? (
        <AdminLayout />
    ) : (
        <Navigate to='/login' replace />
    );
};

export default AdminRoute;
