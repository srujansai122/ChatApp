import React, { useEffect } from "react";
import { useHomepageStore } from "../store/useHomePageStore";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageConatinerNoChats from "./MessageConatinerNoChats";
import MessagesContainer from "./MessagesConatiner";

const SelectedChatContainer = () => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    listenToMessages,
    notListenToMessages,
  } = useHomepageStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    listenToMessages();

    return () => {
      notListenToMessages();
    };
  }, [selectedUser._id, getMessages, listenToMessages, notListenToMessages]);

  return (
    <div className="h-full flex flex-col">
      <ChatHeader />

      <div className="flex-grow overflow-y-auto mt-2">
        {isMessagesLoading ? (
          <MessageConatinerNoChats />
        ) : (
          <MessagesContainer />
        )}
      </div>

      <ChatInput />
    </div>
  );
};

export default SelectedChatContainer;
