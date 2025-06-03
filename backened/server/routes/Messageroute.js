const express = require("express");
const { createMessage,  getMessages } = require("../controller/Message.js");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);

module.exports = router;

