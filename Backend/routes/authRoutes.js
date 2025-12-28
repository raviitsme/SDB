const express = require('express');
const router = express.Router();
const { login, createUser, registerUser, forgotPassword, verifyOTP, resetPass } = require('../controllers/authControllers');
const { verifyToken } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/checkRole');

// Login Route
router.post('/login', login);

// SuperUser create user
router.post('/createUser', verifyToken, checkRole(['SuperUser']), createUser);

// Register Route
router.post('/register', registerUser)

// Forgot Password Route
router.post('/forgotPassword', forgotPassword)

// Verify OTP
router.post('/verifyOTP', verifyOTP)

// Change Password
router.post('/resetPass', resetPass)

module.exports = router;