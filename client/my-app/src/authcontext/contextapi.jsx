import { createContext, useCallback, useContext, useState } from "react";
import { baseUrl } from "../utils/services.js"; // Import baseUrl
// import PostRequest from "../utils/services"; // Import PostRequest
import { useNavigate } from 'react-router-dom';
import UserModel from "../models/FUser.model.js";
import { useRef } from "react";
import { startRegistration } from '@simplewebauthn/browser';



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
  console.log("registererror",registererror);
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
      // console.log("register", response);
      
      if (response.error) {
        setregisterloading(false);
        return setregistererror(response?.message);
        console.log(registererror);
      }

      localStorage.setItem("User", JSON.stringify(response));  //saved as user the current user
      //       setUser(response);
      console.log("response2", response);
      setLocalUser(response); // Set the local user to the user property of the response
      setregisterloading(false);

//navigate to passkey generator page

     navigate('/passkey');
      // navigate('/login');
    } catch (error) {
      setregisterloading(false);
      setregistererror({ error: true, message: error.message });
    }
  }, [registerinfo]);




  const setPasskey = useCallback(async () => {
    try {
      // Call the backend API to set the passkey
      console.log("localuser/passkey", localuser._id);
      console.log("data to be sent to passkey",{userId: localuser._id, username: localuser.name});
      const response = await PostRequest(`${baseUrl}/user/setpasskey`, { 
        userId: localuser._id, 
        userName: localuser.name 
      }); // Pass userId and username directly
      console.log("passkey response got", response);

      const ChallengeResult= await response;

      console.log("challenge got from backend");
      const{options}= ChallengeResult;
      const authenticationResult = await startRegistration({...options});
      console.log("authenticationResult", authenticationResult);


      // console.log("Passkey set successfully:", response);
      // Handle success, e.g., navigate to another page or show a success message
    } catch (error) {
      console.error("Error setting passkey:", error);
      // Handle error, e.g., show an error message
    }


  })


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
   const logout = useCallback(() => {
    console.log("user-succefully-logged out");
    setLocalUser(null);
    localStorage.removeItem("User");
    localStorage.removeItem("login");
  }, []);




  return (
    <AuthContext.Provider
      value={{
        setPasskey,
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