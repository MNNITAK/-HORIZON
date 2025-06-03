const express = require('express');
const Getuser = require('../controller/Getuser.js');
const Search = require('../controller/Search.js');
const router = express.Router();

router.get('/', Getuser);
router.get('/:userId', Search);


module.exports = router;

 


