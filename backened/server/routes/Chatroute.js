const express = require("express");
const { createChat, findUserChats, findChat } = require("../controller/Chat.js");

const router = express.Router();




router.post("/", createChat);
router.get("/:userId", findUserChats);
router.post("/find", findChat);

module.exports = router;




 



