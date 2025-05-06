import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Message, Intent, ChatResponse } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

interface ChatContextType {
  messages: Message[];
  conversationId: number | null;
  isLoading: boolean;
  lastIntent: Intent | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastIntent, setLastIntent] = useState<Intent | null>(null);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          content: "Welcome to BusinessAI Assistant! I can help you with inventory management, customer support, and sales assistance. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    // Ignore empty messages
    if (!content.trim()) return;

    // Create a user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date()
    };

    // Add user message to the list
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Send to backend
      const response = await apiRequest("POST", "/api/chat", {
        message: content,
        conversationId: conversationId
      });

      const data: ChatResponse = await response.json();

      // Update conversation ID if it's a new conversation
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Update last detected intent
      if (data.intent) {
        setLastIntent(data.intent);
      }

      // Add bot response to the list
      setMessages(prevMessages => [...prevMessages, data.message]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: "bot",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setLastIntent(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversationId,
        isLoading,
        lastIntent,
        sendMessage,
        clearMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
