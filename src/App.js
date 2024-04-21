import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/common/Navbar";
import ProtectRoutes from "./components/core/auth/ProtectRoutes";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/verifyEmail";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";


const App = () => {
  
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter bg-[#F9F9F9]">
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="signup"
          element={
            <ProtectRoutes>
              <Signup />
            </ProtectRoutes>
          }
        />
        <Route
          path="login"
          element={
            <ProtectRoutes>
              <Login />
            </ProtectRoutes>
          }
        />

        <Route
          path="forgot-password"
          element={
            <ProtectRoutes>
              <ForgetPassword/>
            </ProtectRoutes>
          }
        />  

        <Route
          path="verify-email"
          element={
            <ProtectRoutes>
              <VerifyEmail />
            </ProtectRoutes>
          }
        />  

        <Route
          path="update-password/:id"
          element={
            <ProtectRoutes>
              <UpdatePassword />
            </ProtectRoutes>
          }
        />  
        <Route path="/about" element={ <About/> } />

        <Route path="/contact" element={<ContactUs/>} />
      </Routes>
    </div>
  )
}

export default App