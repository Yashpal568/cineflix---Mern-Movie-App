import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./Signup.css";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await api.post("/auth/signup", data);
      navigate("/login");
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSubmit} className="signup-card">
        <h2 className="signup-title">Create Account</h2>

        {err && <p className="signup-error">{err}</p>}

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="signup-input"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="signup-input"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="signup-input"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="signup-input"
        />

        <button className="signup-btn">Sign Up</button>

        <p className="signup-bottom-text">
          Already have an account?
          <Link to="/login" className="signup-link">
            &nbsp;Login
          </Link>
        </p>
      </form>
    </div>
  );
}
