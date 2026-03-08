import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const resolveUserFromToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return User.findById(decoded.userId).select('-password');
};

// Protect routes
const protect = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            req.user = await resolveUserFromToken(token);
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Optional auth: attach req.user if valid JWT exists, but never block request.
const optionalProtect = async (req, _res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return next();
    }

    try {
        req.user = await resolveUserFromToken(token);
    } catch {
        req.user = null;
    }
    next();
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin' });
    }
};

export { protect, optionalProtect, admin };
