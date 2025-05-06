import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Types
export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  intent?: string;
  entities?: Array<{ entity: string; value: string }>;
};

type ChatContextType = {
  messages: MessageType[];
  conversationId: string | null;
  sendMessage: (message: string) => void;
  isLoading: boolean;
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat", {
        message,
        conversationId,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      // Add the bot's response to the messages
      setMessages((prev) => [...prev, data.message]);
      
      // Update conversation ID if it's a new conversation
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId.toString());
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: "Failed to communicate with the assistant. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const sendMessage = (message: string) => {
    // Add user message to the list immediately
    const userMessage: MessageType = {
      id: uuidv4(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Send to the API
    sendMessageMutation.mutate(message);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversationId,
        sendMessage,
        isLoading: sendMessageMutation.isPending,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}