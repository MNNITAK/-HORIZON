import React, { useState } from "react";
import "./ChatUI.css";
import { Link } from "react-router-dom";
import { ownChats } from "../../authcontext/chatcontextapi";
import { useAuth } from "../../authcontext/contextapi"; // Make sure to import useAuth
import InputEmoji from "react-input-emoji";
import { motion } from "framer-motion";
// import { FaPhone, FaVideo, FaEllipsisV } from "react-icons/fa";
// import { FiEdit } from "react-icons/fi";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";

const generateStars = (count = 100) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const style = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${1 + Math.random() * 2}s`,
      opacity: Math.random(),
    };
    stars.push(<div key={i} className="star" style={style} />);
  }
  return stars;
};

const Profile = ({ u }) => {
  return (
    <div className="spacechat-profile-item">
      <div className="spacechat-avatar" />
      <div className="spacechat-user-info">
        <h4 className="spacechat-user-name">{u?.user?.name}</h4>
      </div>
      <button className="spacechat-view-btn">🪐 Profile</button>
    </div>
  );
};

const ChatUI = () => {
  const { localuser } = useAuth();
  const [text, setText] = useState("");
  const [currentName, setCurrentName] = useState("");
  const {
    users,
    userChats,
    UpdateCurrentChat,
    sendTextMessage,
    currentChat,
    message,
    receiver,
    receiverId,
    onlineUser,
  } = ownChats();

  return (
    <div className="chat-container">
      <div className="stars">{generateStars(150)}</div>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="messages-title">Mission Logs</h2>
          <Link to="/AddUser">
            <button className="Addusers">Add Astronauts</button>
          </Link>
        </div>
        <input
          type="text"
          placeholder="Scan Frequencies..."
          className="search-input"
        />
        <div className="message-item">
          {users.map((chat, index) => (
            <div
              key={chat?._id}
              onClick={(e) => UpdateCurrentChat(e, userChats[index])}
            >
              <Profile u={chat} />
            </div>
          ))}
          <span className="message-time"></span>
        </div>
      </div>

      {/* Chat Window or Loader */}
      {currentChat ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-user">
              <div className="user-info">
                <h4 className="user-name">
                  <span className="online-status">
                    {onlineUser?.some((user) => user.userId === receiverId)
                      ? "🟢"
                      : "🔴"}
                  </span>
                </h4>
                <p className="username">{receiver?.user?.name}</p>
              </div>
            </div>
            <div className="chat-actions">
              <button className="view-profile">View Profile</button>
            </div>
          </div>
          <div className="chat-body">
            <div className="chat-body-main">
              {message.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message-bubble ${
                    msg.senderId === localuser?.id ? "sent" : "received"
                  }`}
                >
                  <p className="message-text">{msg.text}</p>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
            <div className="chat-body-type">
              <div className="chat-input">
                
                <InputEmoji
                  
                  value={text}
                  onChange={setText}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendTextMessage(
                        text,
                        localuser?.id,
                        currentChat?._id,
                        setText
                      );
                    }
                  }}
                  fontFamily="Orbitron, Arial, sans-serif"
                  border="light-200"
                  placeholder="Transmit a message..."
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    sendTextMessage(
                      text,
                      localuser?.id,
                      currentChat?._id,
                      setText
                    );
                  }}
                >
                  🚀 Launch
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-window loader-container">
          <motion.div
            className="planet-loader"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
          <motion.p
            className="galaxy-loading-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Expand HORIZONS <span className="loading-dots" />
          </motion.p>
        </div>
      )}
    </div>
  );
};

export default ChatUI;
