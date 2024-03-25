const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

exports.generateAccessToken = (username, role) => {
    // Retrieve the token secret from environment variables
    const tokenSecret = process.env.TOKEN_SECRET;

    // Use the retrieved secret to sign the JWT
    return jwt.sign({ username, role }, tokenSecret, { expiresIn: '1800s' });
};