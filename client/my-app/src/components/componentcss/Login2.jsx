import React, { useState } from "react";
import { useAuth } from "../../authcontext/contextapi";
import "./Login2.css";
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

const Login2 = () => {
  const { localuser, loginuser, loginerror,logininfo,loginloading } = useAuth(); // Ensure loginuser is imported from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="mains">
      <div className="stars">{generateStars(150)}</div>
      <div className="signupContainer">
        <div className="signupBox">
          <h2 className="signupTitle_l">SIGN-IN</h2>
          <form
            onSubmit={(e)=> {
              e.preventDefault();
              loginuser(e,email, password );
            }}
            className="signupForm"
          >
            <div className="inputs">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  updatelogininfo((prev) => ({
                  ...prev,
                  email: e.target.value,password
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
                  updatelogin((prev) => ({
                  ...prev,
                  email,password: e.target.value,
                }));
                }}
                required
                className="inputField"
              />

              <button type="submit" className="submitButton">
                {loginloading ? "Fetching your profile..." : "Login"}
              </button>
            </div>
            <span className="extras">
              <Link to="/signup" className="link">
                New User ?
              </Link>
              <Link to="/help" className="link">
                Help
              </Link>
            </span>

            {loginerror?.error && (
              <div className="alert-login">
                <p>{loginerror?.message}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login2;

// const Login2 = () => {
//   const { localuser, loginuser, loginerror } = useAuth(); // Ensure loginuser is imported from context
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//  return (
//     <div className="try">
//       <div className="loginbox">
//         <h2 className="text">Sign in</h2>
//         <h5 className="text2">
//           keep it all together <br />
//           you will be fine
//         </h5>

//         <form onSubmit={loginuser}>
//           <div className="inputbox">
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 console.log(e.target.value);
//                 updateregisterinfo((prev) => ({
//                   ...prev,
//                   email: e.target.value,
//                 }));
//               }}
//               className="inputField"
//               required
//             />

//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 console.log(e.target.value);
//                 updateregisterinfo((prev) => ({
//                   ...prev,
//                   password: e.target.value,
//                 }));
//               }}
//               className="inputField"
//               required
//             />
//             <span
//               className="togglePassword"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </span>
//             <span className="forgotpassword">
//               <Link to="/forgot">forgot password..</Link>
//             </span>
//             <button type="submit" className="submitButton">
//               {!loginloading ? "Logging in..." : "Login"}
//             </button>
//           </div>
//         </form>
//         {loginerror?.error && (
//           <div className="Loginstyle.alert">
//             <p>{loginerror?.message}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default Login2;
