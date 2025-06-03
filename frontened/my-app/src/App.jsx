import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./components/componentcss/Homepage.jsx";
import Login from "./components/componentcss/Login2.jsx"; 
import SignupForm from "./components/componentcss/Signup";
import Help from "./components/componentcss/Help";
import ChatUI from "./components/componentcss/ChatUI.jsx"; // Fixed import path
import AddUsers from "./components/componentcss/Addusers.jsx";
import React from "react";
import { useAuth } from "./authcontext/contextapi";
import { ChatContextProvider } from "./authcontext/chatcontextapi"; // Fixed spacing in 




function App() {
  const { localuser } = useAuth(); // Fixed spacing

  return (
    <ChatContextProvider >
      
        <Routes>
           <Route path="/AddUser" element={<AddUsers/>} />
            <Route path="/chat" element={<ChatUI/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupForm />} />
          <Route path="/help" element={<Help />} />
          <Route path="/forgot" element={<Homepage />} />
          <Route path="/" element={<Homepage />} />
        
          
          {/* Redirect any unknown paths to the homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      
    </ChatContextProvider>
    
  );
}

export default App;
