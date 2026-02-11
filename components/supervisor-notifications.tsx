"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, X } from "lucide-react";
import { getUserNotifications, markNotificationAsRead } from "@/lib/storage";
import type { Notification } from "@/lib/types";
import { showToast } from "@/lib/toast";

interface SupervisorNotificationsProps {
  userId: string;
}

export function SupervisorNotifications({ userId }: SupervisorNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    const allNotifications = getUserNotifications(userId);
    // Sort by newest first
    const sorted = allNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotifications(sorted);
    setUnreadCount(sorted.filter(n => !n.isRead).length);
  };

  useEffect(() => {
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
    showToast("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    notifications.filter(n => !n.isRead).forEach(n => {
      markNotificationAsRead(n.id);
    });
    loadNotifications();
    showToast("All notifications marked as read");
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
        return '✓';
      case 'rejection':
        return '✗';
      case 'application_review':
        return '📋';
      case 'update':
        return '🔔';
      default:
        return '📬';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
      case 'application_review':
        return 'from-green-600/30 to-emerald-600/30 border-green-500/50';
      case 'rejection':
        return 'from-red-600/30 to-rose-600/30 border-red-500/50';
      case 'update':
        return 'from-blue-600/30 to-cyan-600/30 border-blue-500/50';
      default:
        return 'from-purple-600/30 to-pink-600/30 border-purple-500/50';
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-3 rounded-xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 hover:from-blue-500/40 hover:to-cyan-500/40 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-500/50 border-2 border-slate-950"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-[32rem] overflow-hidden rounded-2xl border-2 border-blue-500/50 bg-gradient-to-br from-slate-900/98 to-slate-950/98 backdrop-blur-xl shadow-2xl shadow-blue-500/30 z-50"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600/40 to-cyan-600/30 border-b-2 border-blue-500/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-200" />
                  <h3 className="text-lg font-bold text-blue-100">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 rounded-full bg-red-500/30 border border-red-500/50 text-red-200 text-xs font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-blue-200" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[26rem] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-slate-400 font-semibold">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {unreadCount > 0 && (
                      <div className="p-3 border-b border-white/10">
                        <button
                          onClick={handleMarkAllAsRead}
                          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-500/50 text-green-200 hover:from-green-500/40 hover:to-emerald-500/40 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark All as Read
                        </button>
                      </div>
                    )}
                    <div className="p-2 space-y-2">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-xl border-2 bg-gradient-to-br ${getNotificationColor(notification.type)} ${
                            notification.isRead ? 'opacity-60' : ''
                          } transition-opacity cursor-pointer hover:opacity-100`}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-bold text-white">
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50 flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-white/90 mb-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-white/60 font-semibold">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
