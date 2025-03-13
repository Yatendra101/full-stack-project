const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '../config.env') });
const { promisify } = require('util');
const sendEmail = require('../utils/Email');
const crypto = require('crypto');
const cloudinary = require('../utils/Cloudinary');

// Function to sign a JWT token
const signToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Function to send JWT token as a response
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
};

// Helper function to filter allowed object fields
const filterObj = (obj, ...allowedFields) => {
    let newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

// Default avatar URL
const defaultAvatarUrl = 'https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg';

// Signup function
exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            avatar: {
                url: req.body.avatar || defaultAvatarUrl
            }
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Please provide email and password');
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new Error('Incorrect email or password');
        }

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(401).json({ message: 'Login unsuccessful' });
    }
};

// Logout function
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ status: 'success' });
};

// Middleware to protect routes (JWT authentication)
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
            token = req.cookies.jwt;
        }

        if (!token) {
            throw new Error('You are not Logged!! Please log in to get access');
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            throw new Error('The user belonging to this token doesn\'t exist');
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            throw new Error('User recently changed the password. Please login again');
        }

        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update user profile
exports.updateMe = async (req, res, next) => {
    try {
        const filteredBody = filterObj(req.body, 'name', 'phoneNumber', 'avatar');

        if (req.body.avatar !== undefined) {
            const uploadedImage = await cloudinary.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                height: 150,
                crop: 'scale'
            });

            filteredBody.avatar = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url
            };
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update user password
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            throw new Error('Your current password is wrong');
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
