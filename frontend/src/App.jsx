import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import UpdateProfile from "./pages/UpdateProfile";
import Signup from "./pages/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isCheckingAuth, checkAuth, onlineUsers } = useAuthStore();
  console.log({ onlineUsers });
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/update-profile"
          element={authUser ? <UpdateProfile /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster></Toaster>
    </div>
  );
}

export default App;
