"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Sparkles } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What are the program requirements?",
    "How do I submit my application?",
    "What documents do I need?",
    "When does the program start?",
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    const newMessage: Message = {
      id: `msg-${crypto.getRandomValues(new Uint8Array(8)).join('')}`,
      text: userMessage,
      sender: "student",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate supervisor response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutomatedResponse(userMessage),
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
      {/* Chat Button with Flow Design smooth animation */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <MessageCircle className="w-6 h-6" />
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
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
            {/* Header with enhanced gradient */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-2 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    Supervisor Assistant
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Online</span>
                  </h3>
                  <p className="text-xs text-slate-400">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Messages with smooth scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-lg ${
                      message.sender === "student"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white/10 backdrop-blur-sm text-slate-200 border border-white/10"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "student" ? "opacity-70" : "opacity-50"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions with hover effects */}
            {messages.length <= 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-white/10 space-y-2 bg-gradient-to-b from-transparent to-blue-500/5"
              >
                <p className="text-xs text-slate-400 mb-2 font-semibold">Quick questions:</p>
                <div className="space-y-2">
                  {quickQuestions.map((q, idx) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      onClick={() => {
                        setInputText(q);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="w-full text-left text-xs p-3 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-indigo-500/20 text-slate-300 hover:text-white transition-all duration-300 border border-white/5 hover:border-blue-500/30"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input with enhanced styling */}
            <div className="p-4 border-t border-white/10 bg-gradient-to-t from-slate-950 to-transparent">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
