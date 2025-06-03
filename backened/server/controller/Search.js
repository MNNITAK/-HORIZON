const userModel = require("../models/User.model.js");







// to search a particular user with some id 
// but in Getuser.js we are getting all the users from the database
const Search = async (req, res) => {
    try {
        const id = req.params.userId;

        // Find user by ID
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: "Error has occurred", error: error.message });
    }
};

module.exports = Search;
