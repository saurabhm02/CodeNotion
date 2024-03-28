import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";

const App = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter bg-[#F9F9F9]">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App