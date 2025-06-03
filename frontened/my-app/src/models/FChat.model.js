import mongoose from"mongoose";

//this model have update of , the connection created in the app between the users .
//like which two users are connected previously.

const ChatSchema = new mongoose.Schema({
members:{
    type:Array,
    required:true,
}
},
{
    timestamps:true,

})



const FChatmodel = mongoose.model("Chat", ChatSchema);

export default FChatmodel;
