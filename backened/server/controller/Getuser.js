const userModel = require("../models/User.model.js");





// get all the users from the database

const Getuser = async (req, res) => {
   try {
      const user = await userModel.find();
      res.status(200).json(user);
   } catch (error) {
      res.status(400).json(error);
   }
};

module.exports = Getuser;


