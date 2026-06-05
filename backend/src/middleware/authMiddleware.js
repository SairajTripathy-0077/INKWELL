const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Notice the capital U to match your file structure

exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if the frontend sent a Bearer token in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract just the token part
    }

    // 2. If no token is found, kick them out
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // 3. Verify the token using your secret key from the .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find the user in the database and attach their ID to the request!
        // (We use decoded.id because that is what we embedded when they logged in)
        req.user = await User.findById(decoded.id);

        // 5. Let them pass to the next step (e.g., createBook or getBooks)
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized - Token failed' });
    }
};