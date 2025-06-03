const MessageModel = require("../models/Message.model.js");

// creating the actual message in the database
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
    res.status(200).json(response); // Return the newly created message document
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};



// get all the messages between two users in a chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;    

  try {
    const messages = await MessageModel.find({ chatId });   //
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessages };

