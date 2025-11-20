import React from "react";
import { useHomepageStore } from "../store/useHomePageStore";
import { useAuthStore } from "../store/useAuthStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useHomepageStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 px-4 py-2 bg-base-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              src={selectedUser.avatar || "/default_pic.png"}
              alt="avatar"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-base-content truncate">
            {selectedUser.name}
          </h2>
          <span
            className={`badge badge-sm ${
              isOnline ? "badge-success" : "badge-error"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <button
        className="btn btn-sm btn-circle btn-ghost text-base-content"
        onClick={() => setSelectedUser(null)}
        aria-label="Close chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
