import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, LogOut, Settings, User } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-primary w-6 h-6" />
        <Link to="/" className="text-xl font-bold text-primary">
          ChatUp
        </Link>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {authUser && (
          <>
            <Link
              to="/update-profile"
              className="flex items-center gap-1 text-sm font-medium"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm font-medium btn btn-sm btn-ghost"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
