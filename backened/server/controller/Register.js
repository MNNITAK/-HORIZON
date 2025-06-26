const UserModel = require("../models/User.model.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");




dotenv.config();






const SECRET_KEY = process.env.SECRET_KEY; // Ensure SECRET_KEY is defined in your .env file

const generateToken = (_id) => {
  return jwt.sign({ _id }, SECRET_KEY, { expiresIn: "1d" });
};

const Register = async (req, res) => {
  const { name, email, password } = req.body; // Destructure the data from the request body
    console.log(req.body); // Log the request body for debugging
  try {
    // Check if the user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email format is not valid" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password is not strong enough. It must include uppercase, lowercase, numbers, and symbols.",
      });
    }

    // Create a new user
    const user1 = new UserModel({ name: name, email: email, password: password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user1.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user1.save();

    // Generate a token
    const token = generateToken(user1._id);




    // Send the response
    res.status(200).json({
      message: "User registered successfully",
      _id: user1._id,
      email,
      name,
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = Register;
