import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { User, Lock, Mail, CheckCircle, AlertCircle, ShoppingBag, Loader } from 'lucide-react';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!userInfo) navigate('/login');
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setErrorMsg('');

        if (password && password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        try {
            const updatedUser = await updateProfile({ name, email, ...(password ? { password } : {}) }).unwrap();
            dispatch(setCredentials(updatedUser));
            setSuccess('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to update profile.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-4xl px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                            <div className="flex items-center gap-3 p-3 border-b border-gray-100 mb-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{userInfo?.name}</p>
                                    <p className="text-xs text-gray-500">{userInfo?.email}</p>
                                </div>
                            </div>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 font-medium text-sm"
                            >
                                <User className="w-4 h-4" /> Edit Profile
                            </Link>
                            <Link
                                to="/profile/orders"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium text-sm transition"
                            >
                                <ShoppingBag className="w-4 h-4" /> My Orders
                            </Link>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                <User className="w-5 h-5 text-amber-700" /> Edit Profile
                            </h2>

                            {success && (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
                                </div>
                            )}
                            {errorMsg && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                <hr className="my-2" />
                                <p className="text-sm text-gray-500">Leave password blank to keep your current password.</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-2 bg-amber-700 hover:bg-amber-800 text-white font-bold py-2.5 px-6 rounded-lg transition"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
