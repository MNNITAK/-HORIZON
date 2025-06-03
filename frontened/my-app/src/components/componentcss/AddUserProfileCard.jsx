import React from "react";
import "./AddUserProfileCard.css";

const AddUserProfileCard = ({ userid, username }) => {
  return (
    <div className="adduser-card-container">
      <div className="adduser-avatar" />
      <div className="adduser-username">{username}</div>
    </div>
  );
};

export default AddUserProfileCard;
