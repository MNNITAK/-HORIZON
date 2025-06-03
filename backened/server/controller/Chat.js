const Chatmodel = require("../models/Chat.model.js");
const MessageModel = require("../models/Message.model.js");
//createchat
//getuserchat
//findchat
//deletechat








 //creating the connection between two users to chat
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    // const chat = await Chatmodel.findOne({
    //   members: { $all: [firstId, secondId] },
    // });

    // if (chat) return res.status(200).json(chat);

    const newChat = new Chatmodel({
      members: [firstId, secondId]   
    });
    // Create a new chat document with the members array containing firstId and secondId
    const response = await newChat.save();
    res.status(200).json(response);   // Return the newly created chat document

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};







//to find all The chats of a local user......// This function retrieves all chat documents where the user is a member


const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await Chatmodel.find({
      members: { $in: [userId] },   
//     If you search with userId = "userA", the query:
//members: { $in: [userId] },
// will return all chats where "userA" is in the members array.
// {
//   "_id": "chat1",
//   "members": ["userA", "userB"]
// }
    });

    res.status(200).json(chats);   // Return the list of chats where the user is a member
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};




const findChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await Chatmodel.find({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);   // Return the chat document where both firstId and secondId are members more specifically
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


module.exports = { createChat, findUserChats, findChat };

