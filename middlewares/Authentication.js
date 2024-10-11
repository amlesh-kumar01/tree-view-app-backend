import jwt from 'jsonwebtoken';

const ensureAuthenticated = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided', success: false });
    }

    // Handle tokens provided in the Authorization header
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Invalid token', success: false });
    }
};

export default ensureAuthenticated;
