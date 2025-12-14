import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signin";
import AdminDashboard from "./admin/AdminDashboard";
import Premium from "./pages/Premium";
import AiCamera from "./pages/AiCamera";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/camera" element={<AiCamera />} />
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>

    </>
  );
}


export default App
