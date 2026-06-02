const mongoose = require('mongoose');

// Cache the connection state globally across serverless function calls
let cachedConnection = null;

const connectDB = async () => {
    // If an active connection already exists, reuse it immediately
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log("Using cached MongoDB connection");
        return cachedConnection;
    }

    const primaryUri = process.env.MONGO_URI;
    const fallbackUri = "mongodb://127.0.0.1:27017/EmployeeManagement";
    
    // Force it to use the cloud URI on Vercel production. Never fallback to localhost.
    const isProduction = process.env.NODE_ENV === 'production';
    const uri = isProduction ? primaryUri : (primaryUri || fallbackUri);

    if (!uri) {
        throw new Error("Database connection URI string is completely missing!");
    }

    // Serverless optimization options
    const options = {
        serverSelectionTimeoutMS: 5000, // Fail fast after 5s so we can see the real error
        maxPoolSize: 2,                 // Prevent hitting your 500 max connection limit on Atlas
        minPoolSize: 1,
    };

    try {
        console.log("Opening a new MongoDB connection pool...");
        cachedConnection = await mongoose.connect(uri, options);
        console.log("🚀 MongoDB Cloud Connected Successfully");
        return cachedConnection;
    } catch (error) {
        console.error("❌ MongoDB connection failed!", error.message);
        
        // Only attempt local fallback if running on your local machine
        if (!isProduction && uri !== fallbackUri) {
            try {
                console.log("Attempting local MongoDB fallback...");
                cachedConnection = await mongoose.connect(fallbackUri, options);
                console.log(`DB connected to fallback ${fallbackUri}`);
                return cachedConnection;
            } catch (fallbackError) {
                console.error("Local MongoDB fallback failed!", fallbackError.message);
                throw fallbackError;
            }
        } else {
            // Throw the explicit cloud database error so Vercel logs print the REAL issue
            throw error;
        }
    }
};

module.exports = connectDB;
