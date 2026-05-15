import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/users/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!res.ok) {
        toast.error("Invalid email or password.");
        return;
      }

      const token = res.headers.get("Authorization");
      const data = await res.json();
      login(token, data.user.email);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg d-flex align-items-center justify-content-center px-3">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="form-card rounded-4 p-4 p-md-5">

          {/* Brand */}
          <h2 className="form-title fw-bold text-center mb-1">
            Album<span className="text-accent">.</span>
          </h2>
          <p className="form-subtitle text-center mb-4">
            Welcome back — sign in to continue
          </p>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label-custom d-block mb-1">
              Email address
            </label>
            <input
              type="email"
              className="form-control search-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="form-label-custom d-block mb-1">
              Password
            </label>
            <input
              type="password"
              className="form-control search-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot */}
          <div className="text-end mb-4">
            <span className="forgot-link">Forgot password?</span>
          </div>

          {/* Submit */}
          <button
            className="btn w-100 rounded-3 fw-semibold mb-4 btn-primary-custom"
            onClick={handleLogin}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="divider-line flex-grow-1" />
            <span className="divider-text">or</span>
            <div className="divider-line flex-grow-1" />
          </div>

          {/* Signup link */}
          <p className="text-center mb-0 auth-footer-text">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;