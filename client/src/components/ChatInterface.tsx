import React, { useState, useRef, useEffect } from "react";
import { ToyBrick, Send, Paperclip, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { formatConfidence, getIntentDescription, extractHtmlContent } from "@/lib/nlp";

const ChatInterface: React.FC = () => {
  const { messages, isLoading, lastIntent, sendMessage } = useChat();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  // Render a message with HTML content if present
  const renderMessageContent = (content: string) => {
    const { text, html } = extractHtmlContent(content);
    
    return (
      <>
        {text && <p className="text-sm">{text}</p>}
        {html && <div className="mt-2" dangerouslySetInnerHTML={{ __html: html }} />}
      </>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-7rem)]">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <ToyBrick className="text-primary mr-2" size={20} />
          <h3 className="text-lg font-medium">Business Virtual Assistant</h3>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="h-2 w-2 mr-1 bg-green-400 rounded-full"></div>
            Online
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Ask me about inventory, orders, or customer inquiries</p>
      </div>
      
      <div className="flex-1 px-6 py-4 overflow-y-auto" id="chat-messages">
        {messages.map((message, index) => (
          <div key={message.id}>
            {/* Message bubble */}
            <div className={`flex items-start mb-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                {message.sender === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">A</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <ToyBrick size={16} />
                  </div>
                )}
              </div>
              <div className={`${message.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3 max-w-[80%]`}>
                {renderMessageContent(message.content)}
              </div>
            </div>
            
            {/* Intent classification bubble (after user messages) */}
            {message.sender === 'user' && message.intent && index < messages.length - 1 && (
              <div className="flex justify-center mb-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Intent: {getIntentDescription(message.intent)} <CheckCircle className="ml-1" size={12} />
                </span>
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Processing <span className="ml-1 animate-pulse">...</span>
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Paperclip size={20} />
          </Button>
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border-0 focus:ring-0"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            size="icon" 
            className="ml-2 rounded-full"
            onClick={handleSendMessage}
            disabled={isLoading || messageInput.trim() === ""}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
