import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !passwordConfirmation) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { email, password, password_confirmation: passwordConfirmation },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.errors?.join(", ") || "Signup failed. Try again.");
        return;
      }

      const token = res.headers.get("Authorization");
      login(token, email); // context se login karo
      toast.success("Account created successfully!");
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
            Create your account — it's free
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
          <div className="mb-3">
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
            <p className="input-hint mb-0 mt-1">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label-custom d-block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control search-input"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            className="btn w-100 rounded-3 fw-semibold mb-4 btn-primary-custom"
            onClick={handleSignup}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {/* Divider */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="divider-line flex-grow-1" />
            <span className="divider-text">or</span>
            <div className="divider-line flex-grow-1" />
          </div>

          {/* Login link */}
          <p className="text-center mb-0 auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign In</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;