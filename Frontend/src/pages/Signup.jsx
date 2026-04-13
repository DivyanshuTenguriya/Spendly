import { useState } from "react";
import { registerUser } from "../utils/api";

const Signup = ({ onToggle, onSuccess }) => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({ 
        fullName: form.fullName, 
        email: form.email, 
        password: form.password 
      });
      if (response.data.user) {
        // Save userId and user info to localStorage
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("userName", form.fullName);
        setMessage("Account created successfully!");
        setTimeout(() => onSuccess(form.fullName), 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        className="w-full max-w-md rounded-[32px] border p-8 shadow-lg"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="mb-8 text-center">
          <div
            className="inline-flex rounded-full px-4 py-1 text-xs uppercase tracking-[0.4em]"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
          >
            Create account
          </div>
          <h2 className="mt-5 text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Sign up for Spendly
          </h2>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
            Securely join and start tracking your expenses.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Full Name
            <input
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={form.fullName}
              className="mt-3 w-full rounded-3xl border px-4 py-3 focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>

          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Email
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              className="mt-3 w-full rounded-3xl border px-4 py-3 focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Password
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              className="mt-3 w-full rounded-3xl border px-4 py-3 focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:brightness-110 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-on-accent)',
              borderColor: 'var(--accent-primary)',
            }}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="transition hover:opacity-80"
            style={{ color: 'var(--accent-primary)' }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;