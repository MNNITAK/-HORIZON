const mongoose = require("mongoose");

//this model have update of , the connection created in the app between the users .
//like which two users are connected previously.

const ChatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Chatmodel = mongoose.model("Chat", ChatSchema);

module.exports = Chatmodel;



