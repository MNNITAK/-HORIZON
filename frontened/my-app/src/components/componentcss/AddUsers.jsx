import React from "react";
import "./AddUsers.css";
import AddUserProfileCard from "./AddUserProfileCard";
import { ownChats } from "../../authcontext/chatcontextapi";
import { useAuth } from "../../authcontext/contextapi";

const generateStars = (count = 100) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const style = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${1 + Math.random() * 2}s`,
      opacity: Math.random(),
    };
    stars.push(<div key={i} className="adduser-star" style={style} />);
  }
  return stars;
};

const AddUsers = () => {
  const { potentialChats, Adduser } = ownChats();
  const { localuser } = useAuth();

  return (
    <div className="adduser-container">
      <div className="adduser-stars">{generateStars(120)}</div>
      <div className="adduser-panel">
        <div className="adduser-header">
          <h1 className="adduser-title">Add Astronauts</h1>
        </div>
        <div className="adduser-list">
          {potentialChats.length > 0 ? (
            potentialChats.map(user => (
              <div key={user._id} className="adduser-item">
               <AddUserProfileCard userid={user._id} username={user.name} />
                <button
                  className="adduser-button"
                  onClick={() => Adduser({ firstId: localuser?.id, secondId: user._id })}
                >
                  Add
                </button>
              </div>
            ))
          ) : (
            <div className="adduser-empty">No astronauts found to add.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUsers;
