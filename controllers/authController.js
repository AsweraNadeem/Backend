const User = require("../modals/User"); // Double check if this should be ../models/User
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs'); 

const generateToken = (id) => {
    // If JWT_SECRET is missing in Vercel, it uses 'fallback_secret' 
    // This prevents the 500 crash
    const secret = process.env.JWT_SECRET || "fallback_secret_12345";
    
    return jwt.sign(
        { id },
        secret,
        { expiresIn: "24h" }
    );
};

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            _id: user.id,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: "Register Error: " + err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({ message: "Email not registered" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate token safely
        const token = generateToken(existingUser.id);

        return res.json({
            _id: existingUser.id,
            email: existingUser.email,
            token: token,
        });

    } catch (error) {
        return res.status(500).json({ message: "Login Error: " + error.message });
    }
};
