import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function UserProfile() {
  const { email, token } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (password && password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          user: {
            email,
            password: password || undefined,
            password_confirmation: passwordConfirmation || undefined,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.errors?.join(", ") || "Update failed. Try again.");
        return;
      }

      toast.success("Profile updated successfully!");
      navigate("/albums");
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

          {/* Heading */}
          <h2 className="form-title fw-bold mb-1">My Profile</h2>
          <p className="form-subtitle mb-4">Update your account details</p>

          {/* Email — disabled */}
          <div className="mb-3">
            <label className="form-label-custom d-block mb-1">
              Email address
            </label>
            <input
              type="email"
              disabled
              className="form-control search-input input-disabled"
              placeholder="you@example.com"
              value={email}
            />
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label-custom d-block mb-1">
              New Password
            </label>
            <input
              type="password"
              className="form-control search-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="input-hint mt-1 mb-0">Minimum 6 characters</p>
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
            className="btn w-100 rounded-3 fw-semibold btn-primary-custom"
            onClick={handleUpdate}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Updating..." : "Update Account"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default UserProfile;