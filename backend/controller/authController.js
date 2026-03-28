const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({name, email, password});

    if (user) {
        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' }); 
    }
    
   }catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

    }catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get current logged-in user
// @route GET /api/auth/profile
// @access Private
exports.getProfile = async (req, res) => {
    try{

    }catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update user profile
// @route PUT /api/auth/me 
// @access Private
exports.updateUserProfile = async (req, res) => {
    try{

    }catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
