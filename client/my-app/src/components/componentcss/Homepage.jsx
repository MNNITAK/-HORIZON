import React from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../authcontext/contextapi"; // Make sure to import useAuth
import { ownChats } from "../../authcontext/chatcontextapi";


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

const Homepage = () => {

  const { localuser } = useAuth();
  const { getUserChats} = ownChats(); // Get potential chats from context
  const name = localuser ? localuser.name.toUpperCase() : "GUEST"; // Get the user's name or set to "GUEST" in uppercase
  
  return (
    <div className="mainh">
      {/* Background Stars */}
      <div className="stars">{generateStars(150)}</div>

      {/* Header */}
      <div className="headerh">
        <header className="navh">
          <div className="logo">
            <span className="logo-icon">🪐</span>
            <span className="logo-text">Layers</span>
          </div>

          <nav className="nav-links">
            <a href="#home">Home</a>
            {localuser && <Link to="/chat">Chat</Link>}

            <a href="#integrations">Integrations</a>
            <Link to="/" onClick={logout}>
              {localuser && <>Log-out</>}
              {!localuser && <>FAQ's</>}
            </Link>
          </nav>

          <div className="auth-buttons">
            {!localuser && (
              <>
                <Link to="/login">
                  <button className="login-btn">Log In</button>
                </Link>
                <Link to="/signup">
                  <button className="signup-btn">Sign Up</button>
                </Link>
              </>
            )}
            {localuser && (
              <>
                <span>👨‍🚀</span><span class="comet-username"> AKSHAY YADAV</span>
              </>
            )}
          </div>
        </header>
      </div>

      <div className="contenth">
        <h1 className="Horizon">HORIZON</h1>
        {/* Additional content here */}
      </div>
    </div>
  );
};

export default Homepage;
