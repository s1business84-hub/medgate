"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "student" | "supervisor";
  timestamp: Date;
}

export function SupervisorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help answer your questions about the program, requirements, and next steps.",
      sender: "supervisor",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const quickQuestions = [
    "What are the program requirements?",
    "How do I submit my application?",
    "What documents do I need?",
    "When does the program start?",
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "student",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate supervisor response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutomatedResponse(inputText),
        sender: "supervisor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const getAutomatedResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes("requirement") || lowerQ.includes("eligibility")) {
      return "Program requirements typically include: valid medical student enrollment, proof of insurance, updated vaccinations, and supervisor approval. Specific requirements vary by program - check the program details page.";
    }
    
    if (lowerQ.includes("application") || lowerQ.includes("apply")) {
      return "To submit your application: 1) Browse programs and find one that matches your interests, 2) Click 'Apply Now' on the program page, 3) Fill out the application form with required documents, 4) Submit and track your status in the Student Portal.";
    }
    
    if (lowerQ.includes("document")) {
      return "Common required documents include: Medical school enrollment letter, CV/Resume, Personal statement, Letter of recommendation, Proof of medical insurance, Vaccination records, and Passport copy. Check specific program requirements for complete list.";
    }
    
    if (lowerQ.includes("start") || lowerQ.includes("date") || lowerQ.includes("when")) {
      return "Start dates vary by program. Most programs have multiple intake periods throughout the year. Check the specific program page for exact start dates and application deadlines.";
    }
    
    return "Thank you for your question! For specific details, please check the program information page or contact the hospital directly. I'm here to help with general questions about the platform and application process.";
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[32rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-full">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Supervisor Assistant</h3>
                  <p className="text-xs text-slate-400">Ask me anything!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "student"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white/10 text-slate-200"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-white/10 space-y-2">
                <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
                <div className="space-y-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInputText(q);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="w-full text-left text-xs p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
