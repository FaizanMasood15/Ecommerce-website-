import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as HTTP-Only cookie
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: isProd, // Required for SameSite=None
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
    });
};

export default generateToken;
