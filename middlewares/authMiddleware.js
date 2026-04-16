const jwt = require("jsonwebtoken");
const User = require("../modals/User");

// MUST MATCH the secret in authController.js exactly
const JWT_SECRET_KEY = "3b776744c61c801cd7d5e28a84d0e83bee527c35885750184c2a45ebd519f1d6";

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // 1. Get token from header
            token = req.headers.authorization.split(" ")[1];

            // 2. Verify token using the hardcoded secret
            const decoded = jwt.verify(token, JWT_SECRET_KEY);

            // 3. Get user from the database
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            next();
        } catch (err) {
            console.error("Auth Middleware Error:", err.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
