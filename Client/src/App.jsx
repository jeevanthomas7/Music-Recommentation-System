import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signin";
import Premium from "./pages/Premium";
import AiCamera from "./pages/AiCamera";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/camera" element={<AiCamera />} />


      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>

         <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="*" element={<div className="p-20 text-center text-2xl">404 | Page Not Found</div>} />
    </Routes>
  );
}

export default App;
