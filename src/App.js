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
import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constant";
import Settings from "./components/core/Dashboard/Settings";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";

const App = () => {

  const { user } = useSelector((state) => state.profile)
  
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter bg-[#F9F9F9]">
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog/>} />
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

        <Route
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="*" element={<Error />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                <Route path="dashboard/cart" element={<Cart/>} />
              </>
            )
          }
          {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
            {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
            <Route path="dashboard/add-course" element={<AddCourse  />} />
            <Route path="dashboard/my-courses" element={<MyCourses />} />
            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
          
          </>
        )
      }
        </Route>
        
      </Routes>
    </div>
  )
}

export default App