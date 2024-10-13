import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
import joi from 'joi';
import {config} from 'dotenv';
config();
const router = express.Router();

//CREATING A SCHEME FOR USER
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});
const User = mongoose.model("User", userSchema);

const jwtSecret = process.env.JWT_SECRET;

const schema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

router.post('/register', async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message, message: 'Invalid data' });

    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ success: true, message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    // Validate the schema
    const loginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    });

    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message, message: 'Invalid data format' });

    const {  email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'User with this email does not exist' });

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ success: false, message: 'Invalid password' });

        // Generate JWT
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email}, jwtSecret, { expiresIn: '1d' });

        // Set cookie
        res.cookie('token', token, { httpOnly: true, secure: false });

        res.status(200).json({ success: true, message: 'Logged in successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).send('User not found.');

//   const resetToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

//   // Send password reset email
//   // (Email sending code removed for simplicity in this version)

//   res.send('Password reset email sent.');
// });

// router.post('/reset-password/:token', async (req, res) => {
//   const { password } = req.body;

//   try {
//       const decoded = jwt.verify(req.params.token, jwtSecret);
//       const user = await User.findById(decoded.id);
//       if (!user) return res.status(400).send('Invalid token.');

//       const hashedPassword = await bcrypt.hash(password, 10);
//       user.password = hashedPassword;
//       await user.save();

//       res.send('Password reset successful.');
//   } catch (error) {
//       res.status(400).send('Invalid or expired token.');
//   }
// });

export default router;
