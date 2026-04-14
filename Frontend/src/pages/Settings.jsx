import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import API from "../utils/api";
import { getStoredUserId } from "../utils/helpers";

const sections = [
  {
    icon: User,
    label: "Profile",
    fields: [
      { name: "fullName", label: "Full Name", type: "text" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "currency", label: "Currency", type: "text" },
    ],
  },
  {
    icon: Palette,
    label: "Appearance",
    toggles: [
      {
        label: "Dark Mode",
        desc: "Switch between light and dark themes",
        on: true,
        key: "theme",
      },
    ],
  },
  {
    icon: HelpCircle,
    label: "Help",
    help: true,
  },
  {
    icon: LogOut,
    label: "Logout",
    logout: true,
  },
];

function Toggle({ on, onClick }) {
  return (
    <div
      className="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
      style={{
        backgroundColor: on ? "var(--accent-primary)" : "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
      onClick={onClick}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        style={{
          backgroundColor: "var(--text-primary)",
        }}
      />
    </div>
  );
}

export default function Settings({
  theme,
  onToggleTheme,
  userInfo: globalUserInfo,
  setUserInfo: setGlobalUserInfo,
}) {
  const [userInfo, setUserInfo] = useState({
    fullName: globalUserInfo?.fullName || "",
    phone: "",
    currency: "INR – Indian Rupee",
  });

  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user info on mount
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchUserInfo = async () => {
    try {
      const userId = getStoredUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await API.get(`/userInfo/${userId}`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.userInfo) {
        setUserInfo({
          fullName: data.userInfo.fullName || "",
          phone: data.userInfo.phone || "",
          currency: data.userInfo.currency || "INR – Indian Rupee",
        });
        setGlobalUserInfo({ fullName: data.userInfo.fullName || "User" });
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ fullName: data.userInfo.fullName || "User" }),
        );
      } else {
        // If no user info, set defaults
        setUserInfo({
          fullName: globalUserInfo?.fullName || "",
          phone: "",
          currency: "INR – Indian Rupee",
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("Error loading user info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const userId = getStoredUserId();
      if (!userId) {
        setSaveMessage("User ID not found");
        return;
      }

      const response = await API.put(
        `/userInfo/${userId}`,
        {
          fullName: userInfo.fullName,
          phone: userInfo.phone,
          currency: userInfo.currency,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;
      if (response.status >= 200 && response.status < 300) {
        setSaveMessage("Changes saved successfully!");
        setGlobalUserInfo({ fullName: userInfo.fullName || "User" });
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ fullName: userInfo.fullName || "User" }),
        );
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage(data.msg || "Error saving changes");
      }
    } catch (error) {
      console.error("Error saving user info:", error);
      setSaveMessage("Error saving changes");
    }
  };

  const handleSendHelp = async () => {
    try {
      const userId = getStoredUserId();
      if (!userId) {
        setSaveMessage("User ID not found");
        return;
      }

      if (!helpMessage.trim()) {
        setSaveMessage("Please enter a help message");
        return;
      }

      const response = await API.post(
        "/help",
        {
          userId,
          message: helpMessage,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;
      if (response.status >= 200 && response.status < 300) {
        setSaveMessage("Help message sent successfully!");
        setHelpMessage("");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage(data.msg || "Error sending help message");
      }
    } catch (error) {
      console.error("Error sending help message:", error);
      setSaveMessage("Error sending help message");
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    console.log("Logging out...");

    // Clear authentication data only
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInfo");

    // Notify the root app to switch to the login view without reloading
    window.dispatchEvent(new Event("app-logout"));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <div className="fade-up">
        <h2
          className="font-display text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Settings
        </h2>
        <p
          className="text-xs font-mono mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Manage your account and preferences
        </p>
      </div>

      {error && (
        <p className="text-center mb-4" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      {sections.map((s, si) => (
        <div
          key={s.label}
          className="card p-6 fade-up"
          style={{
            animationDelay: `${(si + 1) * 100}ms`,
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "var(--bg-hover)",
                borderColor: "var(--border-color)",
              }}
            >
              <s.icon size={15} style={{ color: "var(--accent-primary)" }} />
            </div>
            <h3
              className="font-display text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {s.label}
            </h3>
          </div>

          {s.fields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {s.fields.map((f) => (
                <div key={f.name}>
                  <label
                    className="block text-[10px] font-mono uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={userInfo[f.name]}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {s.toggles && (
            <div className="flex flex-col gap-4">
              {s.toggles.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {t.label}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t.desc}
                    </p>
                  </div>
                  <Toggle
                    on={t.key === "theme" ? theme === "dark" : t.on}
                    onClick={t.key === "theme" ? onToggleTheme : undefined}
                  />
                </div>
              ))}
            </div>
          )}

          {s.help && (
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Having trouble? Send us a message and we'll get back to you.
              </p>
              <textarea
                value={helpMessage}
                onChange={(e) => setHelpMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none"
                rows={4}
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              />
              <button
                onClick={handleSendHelp}
                disabled={loading || !helpMessage.trim()}
                className="px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50 self-start transition-all"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--text-on-accent)",
                  borderColor: "var(--accent-primary)",
                }}
              >
                Send Help Request
              </button>
            </div>
          )}

          {s.logout && (
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Sign out of your account. You'll need to log in again to access
                your data.
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl text-sm font-medium self-start transition-all"
                style={{
                  backgroundColor: "var(--danger)",
                  color: "white",
                  borderColor: "var(--danger)",
                }}
              >
                Sign Out
              </button>
            </div>
          )}

          {s.fields && (
            <div className="mt-5 flex justify-end gap-3">
              {saveMessage && (
                <span className="text-sm" style={{ color: "var(--success)" }}>
                  {saveMessage}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--text-on-accent)",
                  borderColor: "var(--accent-primary)",
                }}
              >
                Save changes
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
