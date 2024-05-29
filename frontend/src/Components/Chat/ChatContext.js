"use client";
import { createContext, useState, useContext } from 'react';

// Create the context
export const ChatContext = createContext();

// Create a provider component
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
// export const useChat = () => {
//   return useContext(ChatContext);
// };
