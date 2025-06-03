import { createContext, useState, useEffect, useContext } from "react";
import { baseUrl, getRequest, PostRequest } from "../utils/services.js"; // <-- updated getRequest import
import { useAuth } from "./contextapi.jsx";
import Chatmodel from "../models/FChat.model.js";
import { Form } from "react-router-dom";
import { useCallback } from "react";
import { io } from "socket.io-client"; //socket on client side
import { use } from "react";

// Create a context for managing chat-related data
export const ChatContext = createContext();

// ChatContextProvider component to provide chat-related data and functionality to its children
export const ChatContextProvider = ({ children }) => {
  // Get the logged-in user from the Auth context
  const [userChats, setUserChats] = useState([]);

  const { localuser, userlogin } = useAuth(); // <-- updated usage of useAuth

  const [users, setUsers] = useState([]);

  // userChats will hold the chat connection info not msg of the logged-in user
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);

  const [userChatsError, setUserChatsError] = useState(null);

  const [potentialChats, setPotentialChats] = useState([]);

  const [ischatcreated, setIschatcreated] = useState(false);

  // we should have  seperate variable conatining the current chat connection...
  const [currentChat, setCurrentChat] = useState(null);
  const[receiver,setReceiver] = useState(null);
  const [receiverId, setReceiverId] = useState(null);


  // varibles related to currentchat messages
  const [message, setMessage] = useState([]);

  // in this all the message from message model is retrieved for the current chat.....
  const [messageloading, setMessageLoading] = useState(false);

  const [messageError, setMessageError] = useState(null);

  // to have the newly created message ka (message model)...
  const [newMessage, setNewMessage] = useState([]);

  // to have the newly created message ka (message model)...
  const [textMessageError, setTextMessageError] = useState(null);

  const [socket, setSocket] = useState(null);

  // it contains one by one changing socket connections, as new user adds
  const [onlineUser, setOnlineUser] = useState(null);
  const baseurl="https://horizon-kxu9.onrender.com"

  // have the latest online users....
  //now useffect to send the messag in realtime....

useEffect(() => {

  const fetchReceiver = async () => {
    if (!currentChat || !localuser) return;
    const receiverId = currentChat.members.find((id) => id !== localuser?.id);
    setReceiverId(receiverId);
    console.log("Receiver ID:", receiverId);
    if (!receiverId) return;
    try {
      const response = await getRequest(`${baseUrl}/getuser/${receiverId}`);
      console.log("Receiver response:", response?.user?.name);
      if (response.error) {
        console.error("Error fetching receiver:", response.error);
        setReceiver(null);
        return;
      }
      setReceiver(response);
    } catch (err) {
      console.error("Error fetching receiver:", err);
      setReceiver(null);
    }
  };
  fetchReceiver();
}, [currentChat]);

  useEffect(() => {
    if (!localuser) return; // Only connect if user is logged in

    const newsocket = io("https://horizon-kxu9.onrender.com");
    setSocket(newsocket);

    return () => {
      newsocket.disconnect();
    };
  }, [localuser]);

  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members.find((id) => id !== localuser?.id); //used to filter the id of the receiver of the message....
    socket.emit("newMessage", { ...newMessage, recipientId }); //here message have whole model (chatid,senderid,text)....
  }, [newMessage]);
  //this will execute when the current message will change....

  //to get messsage on receiver side

  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return; // i think in res we have no chatId...
      setMessage((prev) => [...prev, res]); // again i think res is not proper to be in setmessage   ....see the comment in index.js
    });
  }, [socket, currentChat]);

  // initialising the connections...

  //as new connection comes it emits this event and send the userid of the new connection
  useEffect(() => {
    if (socket === null) return;

    socket.emit("addNewUser", localuser?.id); // event to add new user to online users
    socket.on("getOnlineUser", (res) => {
      setOnlineUser(res); // have the latest online users....
    });
    console.log(onlineUser);
  }, [socket]);

  // its used to send the message that is written in the text box..
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return console.log("You must type something");
      }
      const response = await PostRequest(
        `${baseUrl}/message`,
        {
          chatId: currentChatId, // currentChat._id is the chatId of the current chat
          senderId: sender, //may use localuser._id also
          text: textMessage,
        }
      );

      if (response.error) {
        return setTextMessageError(response.error);
      } 
      setNewMessage(response);
      setMessage((prev) => [...prev, response]);
      setTextMessage("");
    }
  );



  //to get all the messages from the message model of the currentchat...
  useEffect(() => {
    setMessageLoading(true);
    const getMessages = async () => {
      // Fetch chats for the logged-in user
      const response = await getRequest(
        `${baseUrl}/message/${currentChat?._id}`
      );

      if (response.error) {
        setMessageLoading(false);
        return setMessageError(response);
      }
      setMessage(response);
      setMessageLoading(false);
    };

    getMessages();
  }, [currentChat]);

  //as the current chat changes the messages are updated.....

  // here as we click on to have a chat , this fucntion is performed
  const UpdateCurrentChat = useCallback(async (e, chat) => {
    setCurrentChat(chat);
    console.log("Current chat updated:", chat);
  }, []);

  // when we click to add some user to chat , this function will execute.
  //here send firstid=localuser.id and secondId=the id of the user with whom we want to chat
  const Adduser = useCallback(
    async ({ firstId, secondId }) => {
      try {
        const response = await PostRequest(`${baseUrl}/chat/`, {
          firstId,
          secondId,
        }); // Fetch chat by user ID
        console.log("Response from Adduser:", response);
        if (response.error) {
          console.error("Error adding user:", response.error);
          // Handle error as needed, e.g. setUserChatsError(response.message);
          return;
        }
        setUserChats((prev) => [...prev, response]); // Update the userChats state with the new chat
        //here unnecessary chats which are  are not added to the userChats state
      } catch (error) {
        console.error("Error adding user:", error);
        // Handle error as needed, e.g. setUserChatsError(error);
      }
    },
    [localuser] // Dependency array to re-run when localuser.id changes
  );

  //now using the potential i am gonna have a list of users with whom the user can chat

  // Dependency array to re-run when userChats or localuser changes

  // useEffect to fetch all users and determine potential chats

  // ...existing code...
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        // userChats and localuser should be defined or passed in
        if (!userChats || !localuser) return;

        const response = await Promise.all(
          userChats.map(async (chat) => {
            const otherUserId =
              chat.members[0] === localuser?.id
                ? chat.members[1]
                : chat.members[0];
            return await getRequest(`${baseUrl}/getuser/${otherUserId}`);
          })
        );

        setUsers(response);
        console.log("Fetched users:", response);
        
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error as needed, e.g. setUserChatsError(error);
      }
    };

    fetchUsers();
  }, [userChats, localuser]); // Dependency array to re-run when userChats or localuser changes

  useEffect(() => {
    const getUsers = async () => {
      // Fetch all users from the backend
      const response = await getRequest(`${baseUrl}/getuser`); // <-- updated usage
      //response contains lsit if all users model(usermodel) from database
      // Handle errors in fetching users
      if (response.error) {
        return console.log("Error fetching users", response);
      }
      // Filter users to create a list of potential chats
      // filter is nothing but a loop
      //.filter returns a new array with all elements that pass the test implemented by the provided function.
      const pChats = response.filter((u) => {
        // in u we will get each user model from the response array
        let isChatCreated = false;
        // Exclude the logged-in user from the list of potential chats
        if (localuser?.id === u?._id) return false;
        // Check if a chat already exists with the user
        if (userChats) {
          // .some also is like a filter here return a bolean response
          // .some do not returns a array like .filter here
          //.some comapares if any element of the array passes the test implemented by the provided function.
          //now  we used  USERCHATS containing all the CHATMODEL that are in contact with local user
          //chat will contain each element of the
          isChatCreated = userChats.some((chat) => {
            //the output of the .some function is under the return statement
            return (
              // Chatmodel.members[0] === u._id || Chatmodel.members[1] === u._id its wrong....
              chat.members[0] === u._id || chat.members[1] === u._id
            );
          });
        }
        // Include only users with whom no chat exists
        return !isChatCreated; //this is the output of pchat function .filter vala
      });
      // Update the state with the list of potential chats
      setPotentialChats(pChats);
    };
    // Call the function to fetch users
    getUsers();
  }, [localuser, userChats]); // Dependency array to re-run when localuser or userChats changes

  // useEffect to load the chats of the logged-in user
  useEffect(() => {
    const getUserChats = async () => {
      console.log("Fetching user chats...");
      setIsUserChatsLoading(true);
      console.log("localuser", localuser.id);
      const response = await getRequest(`${baseUrl}/chat/${localuser?.id}`);
      console.log("Response from getUserChats:", response);
      if (response.error) {
        setUserChatsError(response);
        setIsUserChatsLoading(false);
        return;
      }
      setUserChats(response);
      setIsUserChatsLoading(false);
    };
    getUserChats();
  }, [localuser]);

  // function inside useeffect run by its own you need not to call it somwhere..
  // like here in dependency we put localuser....means when localuser changes, this useEffect will run again and fetch the chats for the new user.

  return (
    <ChatContext.Provider
      value={{
        ischatcreated,
        onlineUser,
        socket,
        newMessage,
        textMessageError,
        sendTextMessage,
        message,
        messageError,
        messageloading,
        UpdateCurrentChat,
        Adduser,
        currentChat,
        users,
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        receiver,
        receiverId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to access the ChatContext
export const ownChats = () => {
  return useContext(ChatContext);
};
