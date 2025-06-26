import React, { useState } from "react";
import { useAuth } from "../../authcontext/contextapi";
import "./Signup.css";
import { Link } from "react-router-dom";


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



const SignupForm = () => {
  const {
    registerUser,
    registerinfo,
    updateregisterinfo,
    registerloading,
    registererror,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="mains">
       <div className="stars">{generateStars(150)}</div>
    <div className="signupContainer">
      
      <div className="signupBox">
        <h2 className="signupTitle">Create an Account</h2>
        <form onSubmit={registerUser} className="signupForm">
          <div className="inputs">
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}setEmail
              onChange={(e) => {
                setName(e.target.value);
                
                updateregisterinfo((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              required
              className="inputField"
            />

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
               
                updateregisterinfo((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              required
              className="inputField"
            />

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
               
                updateregisterinfo((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
              required
              className="inputField"
            />

            <button type="submit" className="submitButton">
              {registerloading ? "Registering..." : "Register"}
            </button>
          </div>
          <span className="extras">
            <Link to="/login" className="link">
              Already registered
            </Link>
            <Link to="/help" className="link">
              Help window
            </Link>
          </span>

          {registererror?.error && (
            <div className="alerts">
              <p>{registererror?.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignupForm;
