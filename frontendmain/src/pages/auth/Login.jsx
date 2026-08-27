import { useState, useContext } from "react";
import {
  Eye,
  EyeOff,
  Kanban,
  Lock,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { NotificationContext } from "../../context/NotificationContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const { notify } = useContext(NotificationContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      notify(
        "Email and password are required.",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      await login(form);

      notify(
        "Login successful.",
        "success"
      );

      navigate("/dashboard");
    } catch (error) {
      notify(
        error?.response?.data?.message ||
          "Invalid email or password.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">

          <div className="brand-icon">
            <Kanban size={30} />
          </div>

          <h1>CRM Portal</h1>

          <p>
            Sign in to manage your
            customer relationships.
          </p>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {/* Email */}
          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <div className="input-with-icon">

              <Mail size={18} />

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />

            </div>

          </div>

          {/* Password */}
          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="input-with-icon">

              <Lock size={18} />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="input-action"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="primary-button login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <p className="auth-footer">
          CRM Portal
        </p>

      </div>

    </div>
  );
}