import { useState } from "react";
import api from "../../api/axios";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.post("/auth/forgotPassword", { email });
      setMsg("Reset link sent! Check your email.");
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="forgot-wrapper">
      <form onSubmit={handleSubmit} className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>

        {err && <p className="forgot-error">{err}</p>}
        {msg && <p className="forgot-success">{msg}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="forgot-btn">Send Reset Link</button>
      </form>
    </div>
  );
}
