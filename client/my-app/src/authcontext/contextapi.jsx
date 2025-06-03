import { createContext, useCallback, useContext, useState } from "react";
import { baseUrl } from "../utils/services.js"; // Import baseUrl
// import PostRequest from "../utils/services"; // Import PostRequest
import { useNavigate } from 'react-router-dom';
import UserModel from "../models/FUser.model.js";
import { useRef } from "react";
const AuthContext = createContext();




//to handle post request


const PostRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(body),  // transmitted the data as a JSON string
  });
 
  const data = await response.json();

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, message };
  }

  return data; 
};







export const AuthProvider = ({ children }) => {
   const navigate = useNavigate();
  

  const [registerloading, setregisterloading] = useState(false);
  const [registererror, setregistererror] = useState(null);
  const [loginloading, setloginloading] = useState(false);
  const[userlogin, setuserlogin] = useState(null);
  const [loginerror, setloginerror] = useState(null);
  const [logininfo,setlogininfo] = useState({
    email: "",
    password: "",
  });
//  const [localuser, setLocalUser] = useState(null)
 const [localuser, setLocalUser] = useState(() => {
  const userString = localStorage.getItem("login");
  const userObj = userString ? JSON.parse(userString) : null;
  return userObj?.user || null;
});
//even after refreshing the page, the local user will be set to the user property of the parsed object
  console.log("localuser", localuser);
  const [registerinfo, setregisterinfo] = useState({
    name: "",
    email: "",
    password: "",
  });









  // Function to update login info
  const updateuser = useCallback((info) => {
    setlogininfo(info);
  }, []);

  // Function to update register info
  const updateregisterinfo = useCallback((info) => {
    setregisterinfo(info);
  }, []);

  // Function to register a user
  const registerUser = useCallback(async (e) => {
    e.preventDefault();
    console.log(registerinfo);
    setregisterloading(true);

    try {
      // Call the backend API
      const response = await PostRequest(`${baseUrl}/user/register`, registerinfo);
      console.log("register", response);
      if (response.error) {
        setregisterloading(false);
        return setregistererror(response);
        console.log(registererror);
      }

      localStorage.setItem("User", JSON.stringify(response));  //saved as user the current user
      //       setUser(response);
      setregisterloading(false);
    } catch (error) {
      setregisterloading(false);
      setregistererror({ error: true, message: error.message });
    }
  }, [registerinfo]);

  // Function to log in a user
  const loginuser = useCallback(async (e,email,password) => {
    
    e.preventDefault();
    // console.log(email,password);
    setloginloading(true);
    // console.log(logininfo)

    try {
      // Call the backend API
      const response = await PostRequest(`${baseUrl}/user/login`,{email,password}); // Pass email and password directly
      setLocalUser(response); // Set the local user to the user property of the response
      
      if (response.error || response.status >= 400) {
        setloginloading(false);
        return setloginerror(response);
      }

       localStorage.setItem("login", JSON.stringify(response)); // Store credentials in local storage
      const locallogin=async()=>{
        const userString = localStorage.getItem("login"); // Get the JSON string from localStorage
        const userObj = JSON.parse(userString); // Parse the string to an object
        console.log("userObj", userObj);
        await setLocalUser(userObj?.user);  // Set the local user to the user property of the parsed object
      }
      setuserlogin(response);
      console.log(localuser)
      if(response.message =="Login successful"){
        setloginloading(false);
         await locallogin();
        navigate('/homepage');


      }
    } catch (error) {
      console.log("hello");
      setloginerror({ error: true, message: error.message });
    }
  }, [logininfo]);

  // Function to log out a user
  const logout = () => {
    setLocalUser(null);
    localStorage.removeItem("User");
    localStorage.removeItem("login");
  };

  return (
    <AuthContext.Provider
      value={{
        localuser,
        loginuser,
        registerUser,
        registerloading,
        registererror,
        loginerror,
        logininfo,
        updateuser,
        updateregisterinfo,
        logout,
        loginloading,
        userlogin

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};