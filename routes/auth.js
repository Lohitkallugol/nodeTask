const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = 'my_jwt_secret'; // Use a strong secret and store in environment variable

// Register Route
router.post('/register', async (req, res) => {
    const { full_name, username, email_id, mobile_number, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ username }, { email_id }] });

        if (user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username or Email already exists'
            });
        }

        user = new User({ full_name, username, email_id, mobile_number, password });

        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({
            status: 'success',
            message: {
                _id: user._id,
                token,
                full_name: user.full_name,
                username: user.username,
                email_id: user.email_id,
                mobile_number: user.mobile_number,
                date_n_time: user.date_n_time
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Server Error'
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { loginID, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ username: loginID }, { email_id: loginID }] });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({
                status: 'fail',
                message: {
                    error_message: 'Invalid Login Credentials'
                }
            });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            status: 'success',
            message: {
                _id: user._id,
                token,
                full_name: user.full_name,
                username: user.username,
                email_id: user.email_id,
                mobile_number: user.mobile_number,
                date_n_time: user.date_n_time
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Server Error'
        });
    }
});

module.exports = router;
