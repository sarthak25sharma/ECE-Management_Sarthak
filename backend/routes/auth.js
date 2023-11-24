// authRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin, studentLogin, addStudent,addAdmin,sendOtp,verifyOtp,students } = require('../controllers/authController');
 // Assuming you have a token verification middleware
router.post('/admin', adminLogin);
router.post('/student', studentLogin);
router.post('/addStudent', addStudent);
router.post('/addAdmin',addAdmin)
router.post( '/sendotp' ,sendOtp )
router.post( '/verifyotp', verifyOtp )
router.get('/students',students )



module.exports = router;
