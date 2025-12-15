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

import ProtectedRoute from "../routes/ProtectedRoute";
// import Search from "./pages/search";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      {/* <Route
  path="/search"
  element={
    <Layout>
      <Search/>
    </Layout>
  }
/> */}

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
<Route
  path="/camera"
  element={
    <ProtectedRoute>
      <AiCamera />
    </ProtectedRoute>
  }
/>

<Route
  path="/premium"
  element={
    <ProtectedRoute>
      <Premium />
    </ProtectedRoute>
  }
/>


      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>

         <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="*" element={<div className="p-20 text-center text-red-500 text-2xl">404 | Page Not Found</div>} />
    </Routes>
  );
}

export default App;
