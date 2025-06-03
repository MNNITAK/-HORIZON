import mongoose from "mongoose";





//this contains all the messages done by the users.
//chatid , sendersId makes the message unique.


const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const FmessageModel = mongoose.model("Message", messageSchema);
 
export default FmessageModel;

