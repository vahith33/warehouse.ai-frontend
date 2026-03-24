"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { chatWithAI } from "@/lib/api";


const suggestedQuestions = [
  "Which products are low stock?",
  "Show today's stock movements",
  "What is the stock of Rice Bag 25kg?",
  "Find product with SKU RICE001",
  "How many products are currently active?",
  "What are the recent stock movements?",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your warehouse assistant. Ask me anything about your inventory, stock levels, or products.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message = input) => {
    if (!message.trim() || loading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatWithAI(message);
      const assistantMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(103vh-64px)] max-w-8xl mx-auto bg-white rounded-lg pt-10 pb-4shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-cyan-50">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Warehouse AI Assistant</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your warehouse..."
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 mb-3 font-medium">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSend(question)}
              disabled={loading}
              className="px-3 py-1 bg-white hover:bg-blue-50 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-lg text-sm text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
