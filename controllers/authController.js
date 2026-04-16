const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// Hardcoded secret to ensure Vercel never crashes on login/register
const JWT_SECRET_KEY = "3b776744c61c801cd7d5e28a84d0e83bee527c35885750184c2a45ebd519f1d6";

const generateToken = (id) => {
    return jwt.sign(
        { id },
        JWT_SECRET_KEY, 
        { expiresIn: "24h" }
    );
};

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({ 
            email: email.toLowerCase(), 
            password: hashedPassword 
        });

        res.status(201).json({
            _id: user.id,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: "Register error", error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (!existingUser) {
            return res.status(401).json({ message: "Email not registered" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.json({
            _id: existingUser.id,
            email: existingUser.email,
            token: generateToken(existingUser.id),
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login error",
            error: error.message
        });
    }
};
