"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, AlertCircle, Clock, Mail, Smartphone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Notification {
  id: string;
  type: "accepted" | "rejected" | "waitlisted" | "updated";
  program: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function StudentInbox() {
  const { user } = useAuth();
  const [showInbox, setShowInbox] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showNotificationPrefs, setShowNotificationPrefs] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [deletedNotifications, setDeletedNotifications] = useState<Set<string>>(new Set());
  
  // Load notifications from localStorage - memoized based on user
  const baseNotifications = useMemo<Notification[]>(() => {
    if (!user) return [];

    try {
      const { getApplications } = require("@/lib/storage");
      const applications = getApplications();

      // Filter to current student's applications
      const studentApps = applications.filter(
        (a: any) => a.studentId === user.id || a.studentId === user.email
      );

      // Convert applications to notifications
      return studentApps.map((app: any) => {
        let type: "accepted" | "rejected" | "waitlisted" | "updated" =
          (app.status.toLowerCase() as any) || "updated";
        if (
          !["accepted", "rejected", "waitlisted"].includes(
            app.status.toLowerCase()
          )
        ) {
          type = "updated";
        }

        const statusMessages: Record<string, string> = {
          approved: "Your application has been approved! Next steps available.",
          accepted: "Your application has been accepted! You can now proceed.",
          rejected:
            "Unfortunately, your application was not selected at this time.",
          waitlisted:
            "You have been placed on the waitlist. We will notify you if a position becomes available.",
          "stage 2 accepted":
            "Congratulations! You have advanced to Stage 2.",
          declined: "Your application was declined.",
          "in training":
            "You are now in training. Welcome aboard!",
          completed: "Your application period has been completed.",
          "under review": "Your application is under review.",
          submitted: "Your application has been submitted successfully.",
          draft: "Your application is still in draft status.",
          deferred: "Your application has been deferred for future consideration.",
        };

        return {
          id: app.id,
          type,
          program: app.programName || "Unknown Program",
          message:
            statusMessages[app.status.toLowerCase()] ||
            `Your application status: ${app.status}`,
          timestamp: app.submissionDate || new Date().toISOString(),
          read: false,
        };
      });
    } catch (error) {
      console.error("Error loading notifications:", error);
      return [];
    }
  }, [user]);

  // Load preferences from localStorage - memoized based on user
  const [notificationPrefs, setNotificationPrefs] = useState<{
    email: string;
    phone: string;
    channels: ("email" | "sms")[];
  }>(() => {
    if (!user) return { email: "", phone: "", channels: [] };

    try {
      const savedPrefs = localStorage.getItem(
        `notification_prefs_${user.id || user.email}`
      );
      if (savedPrefs) {
        return JSON.parse(savedPrefs);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }

    return {
      email: user?.email || "",
      phone: "",
      channels: [],
    };
  });

  // Apply read/deleted state to notifications
  const notifications = useMemo(() => {
    return baseNotifications
      .filter(n => !deletedNotifications.has(n.id))
      .map(n => ({
        ...n,
        read: readNotifications.has(n.id)
      }));
  }, [baseNotifications, readNotifications, deletedNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set(prev).add(id));
  };

  const deleteNotification = (id: string) => {
    setDeletedNotifications(prev => new Set(prev).add(id));
  };

  const saveNotificationPrefs = () => {
    if (!user) return;
    localStorage.setItem(
      `notification_prefs_${user.id || user.email}`,
      JSON.stringify(notificationPrefs)
    );
    setShowNotificationPrefs(false);
  };

  const toggleChannel = (channel: "email" | "sms") => {
    setNotificationPrefs((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "waitlisted":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "accepted":
        return "bg-green-500/15 border-green-500/30";
      case "rejected":
        return "bg-red-500/15 border-red-500/30";
      case "waitlisted":
        return "bg-yellow-500/15 border-yellow-500/30";
      default:
        return "bg-blue-500/15 border-blue-500/30";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Inbox Bell Icon */}
      <button
        onClick={() => setShowInbox(!showInbox)}
        className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Inbox Dropdown */}
      <AnimatePresence>
        {showInbox && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-96 max-h-96 rounded-xl bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-950/80 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNotificationPrefs(true)}
                  className="p-1 hover:bg-white/10 rounded transition-all"
                  title="Notification Preferences"
                >
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setShowInbox(false)}
                  className="p-1 hover:bg-white/10 rounded transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 px-4 pt-3 border-b border-white/10">
              <button
                onClick={() => setFilter("all")}
                className={`pb-3 px-2 font-medium transition-all ${
                  filter === "all"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`pb-3 px-2 font-medium transition-all ${
                  filter === "unread"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Unread
              </button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[calc(100%-120px)]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">
                    No {filter === "unread" ? "unread" : ""} notifications
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-white/20 ${
                        getTypeColor(notification.type)
                      } ${!notification.read ? "bg-white/10" : "bg-white/5"}`}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">
                            {notification.program}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-all shrink-0"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Preferences Modal */}
      <AnimatePresence>
        {showNotificationPrefs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotificationPrefs(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Notification Preferences
              </h2>

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={notificationPrefs.email}
                  onChange={(e) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone Input for SMS */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number (for SMS)
                </label>
                <input
                  type="tel"
                  value={notificationPrefs.phone}
                  onChange={(e) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="+971 50 123 4567"
                />
              </div>

              {/* Notification Channels */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Receive notifications via:
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.channels.includes("email")}
                      onChange={() => toggleChannel("email")}
                      className="w-4 h-4"
                    />
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Email</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.channels.includes("sms")}
                      onChange={() => toggleChannel("sms")}
                      className="w-4 h-4"
                    />
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <span className="text-white">SMS</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={saveNotificationPrefs}
                  className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowNotificationPrefs(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
