import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import API from "../utils/api";
import { getStoredUserId } from "../utils/helpers";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = getStoredUserId();
      if (!userId) return;

      const response = await API.get(`/notifications/${userId}`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await API.put(
        `/notifications/${notificationId}/read`,
        null,
        { withCredentials: true },
      );
      if (response.status >= 200 && response.status < 300) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, read: true } : n,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-8 max-w-screen-2xl mx-auto flex flex-col gap-6">
      <div className="fade-up">
        <h2
          className="font-display text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Notifications
        </h2>
        <p
          className="text-xs font-mono mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Stay updated with your financial activity{" "}
          {unreadCount > 0 && `(${unreadCount} unread)`}
        </p>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center h-40"
          style={{ color: "var(--text-muted)" }}
        >
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="card p-8 text-center">
          <Bell
            size={48}
            style={{ color: "var(--text-muted)" }}
            className="mx-auto mb-4"
          />
          <h3
            className="font-display text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No notifications yet
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            You'll see updates about your budgets, transactions, and summaries
            here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notification, i) => (
            <div
              key={notification._id}
              className={`card p-6 fade-up ${!notification.read ? "border-ink-500/30 bg-ink-500/5" : ""}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${!notification.read ? "bg-ink-400" : "bg-slate-300/20"}`}
                    />
                    <h4
                      className="font-display text-base font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {notification.title}
                    </h4>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-mono uppercase tracking-widest ${
                        notification.type === "budget"
                          ? "bg-red-500/20 text-red-300"
                          : notification.type === "transaction"
                            ? "bg-green-500/20 text-green-300"
                            : notification.type === "summary"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {notification.type}
                    </span>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="ml-4 p-2 rounded-lg bg-ink-500/20 hover:bg-ink-500/30 transition-colors"
                    title="Mark as read"
                  >
                    <Check size={16} className="text-ink-300" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
