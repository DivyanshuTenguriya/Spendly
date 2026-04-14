import { useState } from "react";
import { loginUser } from "../utils/api";

const Login = ({ onToggle, onSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });
      if (response.data.user) {
        // Save user object and ID to localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem(
          "userName",
          response.data.user.email.split("@")[0],
        );
        setMessage("Login successful!");
        setMessageType("success");
        const nameFromEmail = form.email.split("@")[0];
        setTimeout(() => onSuccess(nameFromEmail), 1000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Login failed. Please try again.",
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-[32px] border p-8 shadow-lg"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="mb-8 text-center">
          <div
            className="inline-flex rounded-full px-4 py-1 text-xs uppercase tracking-[0.4em]"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            Secure sign in
          </div>
          <h2
            className="mt-5 text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Log in to Spendly
          </h2>
          <p
            className="mt-3 text-sm leading-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Access your spending insights and manage budgets.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label
            className="block text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Email
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              className="mt-3 w-full rounded-3xl border px-4 py-3 focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label
            className="block text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Password
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              className="mt-3 w-full rounded-3xl border px-4 py-3 focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:brightness-110 disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--text-on-accent)",
              borderColor: "var(--accent-primary)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            className="mt-4 text-center text-sm"
            style={{ color: messageType === "error" ? "#ef4444" : "#10b981" }}
          >
            {message}
          </p>
        )}

        <p
          className="mt-6 text-center text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          New here?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="transition hover:opacity-80"
            style={{ color: "var(--accent-primary)" }}
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
