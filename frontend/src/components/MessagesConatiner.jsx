import React from "react";
import { useHomepageStore } from "../store/useHomePageStore";
import { useAuthStore } from "../store/useAuthStore";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { useEffect } from "react";

const MessagesContainer = () => {
  const { authUser } = useAuthStore();
  const { messages, selectedUser, deleteMessage } = useHomepageStore();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current && messages)
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => {
        const isOwn = msg.senderId === authUser._id;
        const avatarSrc = isOwn
          ? authUser.avatar || "/default_pic.png"
          : selectedUser.avatar || "/default_pic.png";

        return (
          <div
            key={msg._id}
            ref={lastMessageRef}
            className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-8 rounded-full">
                <img src={avatarSrc} alt="avatar" />
              </div>
            </div>
            <div className="chat-bubble bg-base-200 relative max-w-xs p-2 pr-8">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="sent"
                  className="rounded mb-2 max-w-full"
                />
              )}
              {msg.text && (
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              )}
              {isOwn && (
                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="btn btn-xs btn-circle btn-ghost absolute top-1 right-1"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs ml-1 text-gray-500">
                {new Date(msg.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesContainer;
