const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs'); // Changed to bcryptjs

const generateToken = (id) => {
    // Check if JWT_SECRET exists to prevent 500 crash
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }
    
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Secure password using bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            _id: user.id,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({
                message: "Email not registered"
            });
        }

        // Compare password using bcryptjs
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        return res.json({
            _id: existingUser.id,
            email: existingUser.email,
            token: generateToken(existingUser.id),
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
