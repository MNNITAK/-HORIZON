const express = require('express');
const Register = require('../controller/Register.js');
const Login = require('../controller/Login.js');
const Findone = require('../controller/Search.js');
const Getuser = require('../controller/Getuser.js');
const Passkey = require('../controller/Passkey.js');
const router = express.Router();

router.post('/setpasskey', Passkey);
router.post('/register', Register);
router.post('/login', Login);
router.get('/findone/:userId', Findone);
router.get('/getuser', Getuser);
module.exports = router;



// This code defines an Express router for user-related routes. It imports the necessary controllers for handling user registration, login, and fetching user information. The router is then exported for use in the main server file.
// The routes are defined as follows:
// - POST /register: Handles user registration.


