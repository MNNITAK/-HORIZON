
const express = require('express');
const http = require('http'); 
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userroute.js');
const Chatroute = require('./routes/Chatroute.js');
const Messageroute = require('./routes/Messageroute.js');
const Getuser = require('./routes/Getuserroute.js');
const dotenv = require('dotenv');


// Configure dotenv to load environment variables
dotenv.config();
const app = express();
app.use(cors()); // Enable CORS
const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5000'], // Allowed 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions)); 
// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies



const server = http.createServer(app);
const io = new Server(server, { // <-- ATTACH SOCKET.IO
  cors: {
    origin: ['http://localhost:5173','http://localhost:5000'],
    methods: ['GET', 'POST']
  }
});

let onlineUser = [];

io.on('connection', (socket) => {
  console.log('socket connection', socket.id);

  socket.on("addNewUser", (userId) => {
    if (!onlineUser.some((user) => user.userId === userId)) {
      onlineUser.push({
        userId,
        socketId: socket.id
      });
    }
    console.log("online users", onlineUser);
    io.emit("getOnlineUser", onlineUser);
  });

  socket.on("newMessage", (message) => {
    const online = onlineUser.find(user => user.userId === message.recipientId);
    if (online) {
      io.to(online.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUser", onlineUser);
  });
});









// Connect to MongoDB
const uri = process.env.ATLAS_URI; // Ensure the environment variable is named correctly
if (!uri) {
  console.error("Error: ATLAS_URI is not defined in the .env file.");
  process.exit(1);
}

try {
  mongoose.connect(uri);
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed");
  console.error(error);
  process.exit(1); // Exit the process if the database connection fails
}

// Routes

app.use('/api/user', userRoutes); // Middleware to load user routes
app.use('/api/getuser',Getuser);
app.use('/api/chat', Chatroute); // Middleware to load auth routes
app.use('/api/message',Messageroute)
app.get('/', (req, res) => {
  res.send("Welcome to the server");
});







// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});