"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Users, ArrowLeft, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  createConversation, 
  markMessagesAsRead,
  getStudents,
  getUsers
} from "@/lib/storage";
import type { Conversation, ChatMessage } from "@/lib/types";

export function StudentChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"list" | "chat" | "new">("list"); // list = conversations, chat = active chat, new = select student
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  const loadConversations = () => {
    if (!user) return;
    const convs = getConversations(user.id, "supervisor");
    setConversations(convs.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    ));
  };

  const loadMessages = (conversationId: string) => {
    const msgs = getMessages(conversationId);
    setMessages(msgs);
    if (user) {
      markMessagesAsRead(conversationId, user.id);
      loadConversations(); // Refresh to update unread counts
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    loadMessages(conv.id);
    setView("chat");
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConversation || !user) return;

    const newMessage = sendMessage({
      conversationId: activeConversation.id,
      senderId: user.id,
      senderRole: "supervisor",
      recipientId: activeConversation.studentId,
      message: inputText,
    });

    setMessages([...messages, newMessage]);
    setInputText("");
    loadConversations(); // Refresh conversation list
  };

  const handleStartNewChat = (studentId: string) => {
    if (!user) return;
    
    const conv = createConversation(studentId, user.id);
    setActiveConversation(conv);
    loadMessages(conv.id);
    setView("chat");
    loadConversations();
  };

  const getStudentInfo = (studentId: string) => {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) return { name: student.name, email: student.email };
    
    // Fallback to users
    const users = getUsers();
    const user = users.find(u => u.id === studentId);
    return user ? { name: user.name, email: user.email } : { name: "Unknown Student", email: "" };
  };

  const getAvailableStudents = () => {
    const students = getStudents();
    const users = getUsers().filter(u => u.role === "student");
    
    // Combine and deduplicate
    const allStudents = [
      ...students.map(s => ({ id: s.id, name: s.name, email: s.email })),
      ...users.map(u => ({ id: u.id, name: u.name, email: u.email }))
    ];
    
    const unique = allStudents.filter((student, index, self) => 
      index === self.findIndex(s => s.id === student.id)
    );
    
    if (searchQuery) {
      return unique.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return unique;
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <MessageCircle className="w-6 h-6" />
        {conversations.some(c => c.unreadCount.supervisor > 0) && (
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {conversations.reduce((sum, c) => sum + c.unreadCount.supervisor, 0)}
          </motion.div>
        )}
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
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-green-600/30 to-emerald-600/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {view === "chat" && (
                  <button
                    onClick={() => {
                      setView("list");
                      setActiveConversation(null);
                      setMessages([]);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                )}
                {view === "new" && (
                  <button
                    onClick={() => setView("list")}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                )}
                <Users className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="text-white font-semibold">
                    {view === "list" && "Student Messages"}
                    {view === "chat" && activeConversation && getStudentInfo(activeConversation.studentId).name}
                    {view === "new" && "New Conversation"}
                  </h3>
                  {view === "chat" && activeConversation && (
                    <p className="text-xs text-slate-400">{getStudentInfo(activeConversation.studentId).email}</p>
                  )}
                  {view === "list" && (
                    <p className="text-xs text-slate-400">{conversations.length} conversations</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setView("list");
                  setActiveConversation(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Conversation List View */}
            {view === "list" && (
              <div className="flex-1 overflow-y-auto">
                <div className="p-3">
                  <button
                    onClick={() => setView("new")}
                    className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Start New Conversation
                  </button>
                </div>
                
                <div className="px-3 pb-3 space-y-2">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No conversations yet</p>
                      <p className="text-xs mt-1">Start a new chat with a student</p>
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const studentInfo = getStudentInfo(conv.studentId);
                      return (
                        <motion.button
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          whileHover={{ scale: 1.02 }}
                          className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {studentInfo.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">{studentInfo.name}</p>
                                <p className="text-xs text-slate-400">{studentInfo.email}</p>
                              </div>
                            </div>
                            {conv.unreadCount.supervisor > 0 && (
                              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                                {conv.unreadCount.supervisor}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 truncate mt-1">{conv.lastMessage}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(conv.lastMessageAt).toLocaleString()}
                          </p>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* New Conversation View */}
            {view === "new" && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {getAvailableStudents().map((student) => (
                    <motion.button
                      key={student.id}
                      onClick={() => handleStartNewChat(student.id)}
                      whileHover={{ scale: 1.02 }}
                      className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                  
                  {getAvailableStudents().length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">No students found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat View */}
            {view === "chat" && activeConversation && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`flex ${message.senderRole === "supervisor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl shadow-lg ${
                          message.senderRole === "supervisor"
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                            : "bg-white/10 backdrop-blur-sm text-slate-200 border border-white/10"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.senderRole === "supervisor" ? "opacity-70" : "opacity-50"}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-gradient-to-t from-slate-950 to-transparent">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl transition-all shadow-lg hover:shadow-green-500/30"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
