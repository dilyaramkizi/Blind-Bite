import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import MainPage from "./pages/MainPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Preferences from "./pages/Preferences";
import MakeOrder from "./pages/MakeOrder";
import History from "./pages/History";
import ChefPanel from "./pages/ChefPanel";
import AdminPanel from "./pages/AdminPanel";
import ManageUsers from "./pages/ManageUsers";
import ManageOrder from "./pages/ManageOrder";


  function App() {

    const user = useSelector((state) => state.auth.user)

  return (
    <BrowserRouter>
          {/* ToastContainer should be outside Routes */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="login" element={<Login />}/>
        <Route path="/client" element={user && user.role === "client" ? <UserProfile /> : <Navigate to="/" />} />
        <Route path="/preferences" element={user && user.role === "client" ? <Preferences /> : <Navigate to="/" />} />
        <Route path="/make-order" element={user && user.role === "client" ? <MakeOrder /> : <Navigate to="/" />} />
        <Route path="/history" element={user && user.role === "client" ? <History /> : <Navigate to="/" />} />
        <Route path="/chef" element={user && user.role === "chef" ? <ChefPanel /> : <Navigate to="/" />} />
        <Route path="/admin" element={user && user.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/manage-order" element={user && user.role === "admin" ? <ManageUsers /> : <Navigate to="/" />} />
        <Route path="/manage-users" element={user && user.role === "admin" ? <ManageOrder /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
