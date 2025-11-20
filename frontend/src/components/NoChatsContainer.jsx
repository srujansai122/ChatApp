import React from "react";
import { MessageSquare } from "lucide-react";

const NoChatsContainer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <MessageSquare className="w-10 h-10 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Chat Selected</h2>
      <p className="text-sm">Please select a chat to start messaging.</p>
    </div>
  );
};

export default NoChatsContainer;
